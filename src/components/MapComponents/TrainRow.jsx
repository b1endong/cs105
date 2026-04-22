import {useRef, useLayoutEffect, useState, useEffect} from "react";
import {useFrame} from "@react-three/fiber";
import RailModel from "../../model/RailModel";
import TrainModel from "../../model/TrainModel";
import TrainSignModel from "../../model/TrainSignModel";
import {
    TRAIN_SPEED,
    WAGON_COUNT,
    WARN_BEFORE,
    COOLDOWN,
} from "../../metadata/constants";

function trainLength(s) {
    return s * (1.6 + WAGON_COUNT * 1.5 + 0.3);
}

export default function TrainRow({rowIndex, metadata, obstaclesRef}) {
    const s = metadata.tileSize;
    const h = metadata.tilesHeight;
    const n = metadata.tilesPerRow;
    const Y = rowIndex * s;
    const W = s * n;

    const direction = rowIndex % 2 === 0 ? 1 : -1;
    const tLen = trainLength(s);
    const BOUNDARY = W / 2 + tLen + s * 2;
    const startX = direction * BOUNDARY;

    const phaseRef = useRef("idle");
    const timerRef = useRef(null);
    const trainRef = useRef();
    const isWarningRef = useRef(false);

    useLayoutEffect(() => {
        obstaclesRef.current = [
            ...obstaclesRef.current,
            {
                id: `train-${rowIndex}`,
                type: "train",
                rowIndex,
                x: startX,
                width: tLen,
                depth: s * 0.65,
                active: false,
            },
        ];
        return () => {
            obstaclesRef.current = obstaclesRef.current.filter(
                (o) => o.id !== `train-${rowIndex}`,
            );
        };
    }, []);

    const runCycle = () => {
        if (trainRef.current) trainRef.current.position.x = startX;
        phaseRef.current = "warning";
        isWarningRef.current = true;
        timerRef.current = setTimeout(() => {
            phaseRef.current = "running";
        }, WARN_BEFORE * 1000);
    };

    useEffect(() => {
        timerRef.current = setTimeout(runCycle, 1000);
        return () => clearTimeout(timerRef.current);
    }, []);

    useFrame((_, delta) => {
        if (!trainRef.current) return;
        const entry = obstaclesRef.current.find(
            (o) => o.id === `train-${rowIndex}`,
        );

        if (phaseRef.current === "running") {
            trainRef.current.position.x -= direction * TRAIN_SPEED * s * delta;
            if (entry) {
                entry.x = trainRef.current.position.x;
                entry.active = true;
            }

            const passed =
                direction === 1
                    ? trainRef.current.position.x < -BOUNDARY
                    : trainRef.current.position.x > BOUNDARY;

            if (passed) {
                phaseRef.current = "cooldown";
                isWarningRef.current = false;
                if (entry) entry.active = false;
                clearTimeout(timerRef.current);
                timerRef.current = setTimeout(() => {
                    phaseRef.current = "idle";
                    runCycle();
                }, COOLDOWN * 1000);
            }
        }
    });

    const rotZ = direction === -1 ? Math.PI : 0;
    const signPositions = [-W / 2 + s * 1.5, W / 2 - s * 1.5];

    return (
        <group position={[0, Y, 0]}>
            <RailModel s={s} W={W} />

            <group
                ref={trainRef}
                position={[startX, 0, h / 2]}
                rotation={[0, 0, rotZ]}
            >
                <TrainModel s={s} wagonCount={WAGON_COUNT} />
            </group>

            {signPositions.map((xPos, i) => (
                <group key={i} position={[xPos, -s * 0.3, h / 2]}>
                    <TrainSignModel s={s} isWarningRef={isWarningRef} />
                </group>
            ))}
        </group>
    );
}
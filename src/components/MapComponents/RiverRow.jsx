import {useRef, useLayoutEffect, useState} from "react";
import {useFrame} from "@react-three/fiber";
import LogModel from "../../model/LogModel";
import RiverModel from "../../model/RiverModel";
import ItemModel from "../../model/ItemModel";

export default function RiverRow({
    rowIndex,
    speed,
    logs,
    metadata,
    obstaclesRef,
}) {
    const TILE_SIZE = metadata.tileSize;
    const TILE_HEIGHT = metadata.tilesHeight;
    const TILE_PER_ROW = metadata.tilesPerRow;

    const Y = rowIndex * TILE_SIZE;

    return (
        <group position={[0, Y, 0]}>
            <RiverModel s={TILE_SIZE} W={TILE_SIZE * TILE_PER_ROW} />
            {logs.map((log, i) => (
                <Log
                    key={i}
                    initialX={log.initialX * TILE_SIZE}
                    length={log.length}
                    speed={speed}
                    item={log.item}
                    TILE_SIZE={TILE_SIZE}
                    TILE_HEIGHT={TILE_HEIGHT}
                    TILE_PER_ROW={TILE_PER_ROW}
                    rowIndex={rowIndex}
                    obstaclesRef={obstaclesRef}
                    obstacleId={`log-${rowIndex}-${i}`}
                />
            ))}
        </group>
    );
}

function Log({
    initialX,
    length,
    speed,
    item,
    TILE_SIZE,
    TILE_HEIGHT,
    TILE_PER_ROW,
    rowIndex,
    obstaclesRef,
    obstacleId,
}) {
    const ref = useRef();
    const BOUNDARY = (TILE_SIZE * TILE_PER_ROW) / 2 + TILE_SIZE;
    const s = TILE_SIZE;
    const itemId = `item-${obstacleId}`;

    useLayoutEffect(() => {
        const logEntry = {
            id: obstacleId,
            type: "log",
            rowIndex,
            x: initialX,
            width: s * length,
            depth: s * 0.6,
            velocityX: 0,
        };
        const entries = [logEntry];
        if (item) {
            entries.push({
                id: itemId,
                type: "item",
                rowIndex,
                x: initialX,
                width: s * 0.5,
                itemEffect: item,
                active: true
            });
        }
        obstaclesRef.current = [...obstaclesRef.current, ...entries];
        return () => {
            obstaclesRef.current = obstaclesRef.current.filter(
                (o) => o.id !== obstacleId && o.id !== itemId,
            );
        };
    }, []);

    const [itemVisible, setItemVisible] = useState(!!item);

    useFrame((_, delta) => {
        const dx = speed * s * delta;
        ref.current.position.x += dx;

        if (speed > 0 && ref.current.position.x > BOUNDARY)
            ref.current.position.x = -BOUNDARY;
        if (speed < 0 && ref.current.position.x < -BOUNDARY)
            ref.current.position.x = BOUNDARY;

        if (item) {
            const itemEntry = obstaclesRef.current.find((o) => o.id === itemId);
            if (itemEntry) {
                itemEntry.x = ref.current.position.x;
                if (!itemEntry.active && itemVisible) setItemVisible(false);
            }
        }

        const entry = obstaclesRef.current.find((o) => o.id === obstacleId);
        if (entry) {
            entry.x = ref.current.position.x;
            entry.velocityX = dx;
        }
    });

    return (
        <group ref={ref} position={[initialX, 0, TILE_HEIGHT / 2]}>
            <LogModel s={s} length={length} />
            {item && itemVisible && (
                <group position={[0, 0, s * 0.2]}>
                    <ItemModel s={s} isBuff={item.isBuff} />
                </group>
            )}
        </group>
    );
}

import {
    tileSize,
    tilesHeight,
    tilesPerRow,
    MOVE_DURATION,
    LOG_HALF_H,
    CAMERA_START_ROW,
} from "../metadata/constants.js";
import {useRef, useEffect} from "react";
import {useFrame} from "@react-three/fiber";
import PlayerModel from "../model/PlayerModel.jsx";

const HALF_ROW = Math.floor(tilesPerRow / 2);

function overlaps1D(centerA, halfA, centerB, halfB) {
    return Math.abs(centerA - centerB) < halfA + halfB;
}

export default function Player({
    playerPosRef,
    obstaclesRef,
    riverRowSet,
    addRow,
    onDie,
    minAllowedRowRef,
}) {
    const meshRef = useRef();
    const s = tileSize;
    const isDeadRef = useRef(false);
    const maxRowReachedRef = useRef(0);

    const anim = useRef({
        startX: 0,
        startY: 0,
        targetX: 0,
        targetY: 0,
        progress: 1,
    });

    useEffect(() => {
        const onKey = (e) => {
            if (isDeadRef.current || anim.current.progress < 1) return;

            const {x, rowIndex} = playerPosRef.current;
            const roundedX = Math.round(x);
            let dx = 0,
                dy = 0;

            if (e.key === "ArrowUp" || e.key === "w") {
                dy = 1;
                meshRef.current.rotation.z = Math.PI;
            } else if (e.key === "ArrowDown" || e.key === "s") {
                dy = -1;
                meshRef.current.rotation.z = 0;
            } else if (e.key === "ArrowLeft" || e.key === "a") {
                dx = -1;
                meshRef.current.rotation.z = -Math.PI / 2;
            } else if (e.key === "ArrowRight" || e.key === "d") {
                dx = 1;
                meshRef.current.rotation.z = Math.PI / 2;
            } else return;

            const newX = roundedX + dx;
            const newRow = rowIndex + dy;

            // Giới hạn biên X
            if (newX < -HALF_ROW || newX > HALF_ROW) return;

            // Không cho lùi về row đã bị camera bỏ qua
            if (newRow < minAllowedRowRef.current) return;

            // Không đi vào cây
            const hitTree = obstaclesRef.current.find(
                (o) =>
                    o.rowIndex === newRow &&
                    o.type === "tree" &&
                    o.x === newX * tileSize,
            );
            if (hitTree) return;

            playerPosRef.current = {x: newX, rowIndex: newRow};

            // Chỉ thêm row khi player đã vượt CAMERA_START_ROW
            // → camera đang scroll → Map đang xóa row cũ → cần thêm row mới
            if (dy > 0 && newRow > maxRowReachedRef.current) {
                maxRowReachedRef.current = newRow;
                if (newRow > CAMERA_START_ROW && addRow) addRow();
            }

            anim.current = {
                startX: anim.current.targetX,
                startY: anim.current.targetY,
                targetX: newX * tileSize,
                targetY: newRow * tileSize,
                progress: 0,
            };
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useFrame((_, delta) => {
        if (!meshRef.current || isDeadRef.current) return;

        const a = anim.current;
        if (a.progress < 1) {
            a.progress = Math.min(1, a.progress + delta / MOVE_DURATION);
            const t = a.progress;
            meshRef.current.position.x = a.startX + (a.targetX - a.startX) * t;
            meshRef.current.position.y = a.startY + (a.targetY - a.startY) * t;
            const baseZ = tilesHeight / 2 + tileSize * 0.45;
            meshRef.current.position.z =
                baseZ + Math.sin(t * Math.PI) * tileSize * 0.6;
        }

        if (a.progress < 0.7) return;

        const playerX = meshRef.current.position.x;
        console.log("Player X:", playerX);
        const playerRow = playerPosRef.current.rowIndex;
        const playerHalf = s * 0.3;
        const sameRow = obstaclesRef.current.filter(
            (o) => o.rowIndex === playerRow,
        );

        const hitCar = sameRow.find(
            (o) =>
                o.type === "car" &&
                overlaps1D(playerX, playerHalf, o.x, o.width / 2),
        );
        if (hitCar) {
            die();
            return;
        }

        if (a.progress < 1) return;

        if (riverRowSet.has(playerRow)) {
            const onLog = sameRow.find(
                (o) =>
                    o.type === "log" &&
                    overlaps1D(playerX, playerHalf, o.x, o.width / 2),
            );
            if (!onLog) {
                die();
                return;
            }

            meshRef.current.position.x += onLog.velocityX || 0;
            anim.current.startX = meshRef.current.position.x;
            anim.current.targetX = meshRef.current.position.x;
            playerPosRef.current.x = meshRef.current.position.x / tileSize;
            meshRef.current.position.z =
                tilesHeight / 2 + s * LOG_HALF_H + s * 0.45;
        }

        if (
            Math.abs(meshRef.current.position.x) >
            HALF_ROW * tileSize + tileSize * 0.5
        ) {
            die();
        }
    });

    function die() {
        if (isDeadRef.current) return;
        isDeadRef.current = true;
        onDie(playerPosRef.current.rowIndex);
    }

    return (
        <group
            ref={meshRef}
            position={[0, 0, tilesHeight / 2 + s * 0.45]}
            rotation={[0, 0, Math.PI]}
        >
            <PlayerModel s={s} />
        </group>
    );
}

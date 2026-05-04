import {
    tileSize,
    tilesHeight,
    tilesPerRow,
    MOVE_DURATION,
    LOG_HALF_H,
    CAMERA_START_ROW,
} from "../metadata/constants.js";
import {useRef, useEffect, useState} from "react";
import {useFrame} from "@react-three/fiber";
import PlayerModel from "../model/PlayerModel.jsx";
import DeathExplosion from "./DeathAnimation.jsx";

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
    onScoreChange,
    minAllowedRowRef,
}) {
    const meshRef = useRef();
    const s = tileSize;
    const isDeadRef = useRef(false);
    const maxRowReachedRef = useRef(0);
    const [deathPos, setDeathPos] = useState(null);

    // Offset giữa hệ tọa độ mesh và hệ tọa độ tile-grid.
    // Mesh position = tileIndex * tileSize - WORLD_OFFSET_X
    const WORLD_OFFSET_X = 50;
    const WORLD_OFFSET_Y = 250;

    const anim = useRef({
        startX: 0,
        startY: 0,
        targetX: -WORLD_OFFSET_X,
        targetY: -WORLD_OFFSET_Y,
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
            if (dy > 0 && newRow > maxRowReachedRef.current) {
                maxRowReachedRef.current = newRow;
                if (onScoreChange) onScoreChange(newRow);
                if (newRow > CAMERA_START_ROW && addRow) addRow();
            }

            // Di chuyển ngang: target = vị trí mesh hiện tại + 1 tile
            //   → luôn nhảy đúng 1 ô trong world space, không bị ảnh hưởng log drift.
            // Di chuyển dọc: snap X về grid (vì chuyển sang row khác).
            const currentMeshX = meshRef.current.position.x;
            const targetX =
                dx !== 0
                    ? currentMeshX + dx * tileSize
                    : newX * tileSize - WORLD_OFFSET_X;

            anim.current = {
                startX: currentMeshX,
                startY: meshRef.current.position.y,
                targetX,
                targetY: newRow * tileSize - WORLD_OFFSET_Y,
                progress: 0,
            };
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useFrame((_, delta) => {
        if (!meshRef.current || isDeadRef.current) return;

        const a = anim.current;
        const playerRow = playerPosRef.current.rowIndex;
        const playerHalf = s * 0.3;
        const sameRow = obstaclesRef.current.filter(
            (o) => o.rowIndex === playerRow,
        );

        // ── Step 1: Hop animation ──
        // Khi đang nhảy, player bay trong không trung → KHÔNG chịu ảnh hưởng
        // từ vận tốc gỗ. Điều này đảm bảo:
        //   - Đi ngược chiều gỗ: tốc độ player không bị triệt tiêu
        //   - Đi cùng chiều gỗ: tốc độ player không bị cộng thêm
        if (a.progress < 1) {
            a.progress = Math.min(1, a.progress + delta / MOVE_DURATION);
            const t = a.progress;
            meshRef.current.position.x =
                a.startX + (a.targetX - a.startX) * t;
            meshRef.current.position.y =
                a.startY + (a.targetY - a.startY) * t;
            const baseZ = tilesHeight / 2 + tileSize * 0.45;
            meshRef.current.position.z =
                baseZ + Math.sin(t * Math.PI) * tileSize * 0.6;
        }

        // ── Step 2: Kiểm tra va chạm xe / tàu (từ 70% animation trở đi) ──
        if (a.progress < 0.7) return;

        const playerX = meshRef.current.position.x + WORLD_OFFSET_X;

        const hitCar = sameRow.find(
            (o) =>
                o.type === "car" &&
                overlaps1D(playerX, playerHalf, o.x, o.width / 2),
        );
        if (hitCar) {
            die();
            return;
        }

        const hitTrain = sameRow.find(
            (o) =>
                o.type === "train" &&
                overlaps1D(playerX, playerHalf, o.x, o.width / 2) &&
                o.active,
        );
        if (hitTrain) {
            die();
            return;
        }

        // ── Step 3: Log riding — CHỈ khi đã hạ cánh (progress = 1) ──
        if (a.progress >= 1 && riverRowSet.has(playerRow)) {
            const onLog = sameRow.find(
                (o) =>
                    o.type === "log" &&
                    overlaps1D(playerX, playerHalf, o.x, o.width / 2),
            );

            if (!onLog) {
                die();
                return;
            }

            // Player đứng yên trên gỗ → trôi theo gỗ
            const vx = onLog.velocityX || 0;
            meshRef.current.position.x += vx;
            // Đồng bộ anim để lần nhấn phím tiếp theo lấy đúng vị trí
            a.startX = meshRef.current.position.x;
            a.targetX = meshRef.current.position.x;
            // Cập nhật x logic theo drift để khi nhảy khỏi gỗ,
            // roundedX phản ánh đúng vị trí thực tế của player.
            playerPosRef.current.x =
                (meshRef.current.position.x + WORLD_OFFSET_X) / tileSize;
            // Đặt Z lên trên mặt gỗ
            meshRef.current.position.z =
                tilesHeight / 2 + s * LOG_HALF_H + s * 0.45;
        }

        // ── Step 4: Kiểm tra biên ──
        if (a.progress >= 1) {
            if (
                Math.abs(meshRef.current.position.x + WORLD_OFFSET_X) >
                HALF_ROW * tileSize + tileSize * 0.5
            ) {
                die();
            }
        }
    });

    function die() {
        if (isDeadRef.current) return;
        isDeadRef.current = true;
        const pos = meshRef.current.position;
        setDeathPos([pos.x, pos.y, pos.z]);
        meshRef.current.visible = false;
    }

    function handleExplosionDone() {
        onDie(playerPosRef.current.rowIndex);
    }

    return (
        <>
            <group
                ref={meshRef}
                position={[-50, -250, tilesHeight / 2 + s * 0.45]}
                rotation={[0, 0, Math.PI]}
            >
                <PlayerModel s={s} />
            </group>
            {/* Render vụ nổ khi chết */}
            {deathPos && (
                <DeathExplosion
                    position={deathPos}
                    s={s}
                    onDone={handleExplosionDone}
                />
            )}
        </>
    );
}

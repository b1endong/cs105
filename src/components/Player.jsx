import {
    tileSize,
    tilesHeight,
    tilesPerRow,
    MOVE_DURATION,
    LOG_HALF_H,
    CAMERA_START_ROW,
    ITEM_DURATIONS,
} from "../metadata/constants.js";
import {useRef, useEffect, useState} from "react";
import {useFrame} from "@react-three/fiber";
import {CHARACTERS} from "../metadata/characters.js";
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
    onRowChange,
    minAllowedRowRef,
    activeEffect,
    setActiveEffect,
    characterId,
    // ─── NEW: ref trỏ đến outer group, để CameraManager đọc world position ───
    playerRef,
}) {
    const meshRef = useRef();
    const s = tileSize;
    const isDeadRef = useRef(false);
    const iFrameRef = useRef(false);
    const maxRowReachedRef = useRef(0);
    const [deathData, setDeathData] = useState(null);

    // Lấy Model từ CHARACTERS
    const charDef =
        CHARACTERS.find((c) => c.id === characterId) ?? CHARACTERS[0];
    const CharModel = charDef.Model;

    const activeEffectRef = useRef(activeEffect);
    activeEffectRef.current = activeEffect;

    const riverRowSetRef = useRef(riverRowSet);
    riverRowSetRef.current = riverRowSet;

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

            const currentEffect = activeEffectRef.current;

            if (currentEffect?.type === "randomDeath" && Math.random() < 0.1) {
                die("explosion");
                return;
            }

            let actualKey = e.key;
            if (currentEffect?.type === "reverseControl") {
                if (e.key === "ArrowUp" || e.key === "w")
                    actualKey = "ArrowDown";
                else if (e.key === "ArrowDown" || e.key === "s")
                    actualKey = "ArrowUp";
                else if (e.key === "ArrowLeft" || e.key === "a")
                    actualKey = "ArrowRight";
                else if (e.key === "ArrowRight" || e.key === "d")
                    actualKey = "ArrowLeft";
            }

            if (actualKey === "ArrowUp" || actualKey === "w") {
                dy = 1;
                meshRef.current.rotation.z = Math.PI;
            } else if (actualKey === "ArrowDown" || actualKey === "s") {
                dy = -1;
                meshRef.current.rotation.z = 0;
            } else if (actualKey === "ArrowLeft" || actualKey === "a") {
                dx = -1;
                meshRef.current.rotation.z = -Math.PI / 2;
            } else if (actualKey === "ArrowRight" || actualKey === "d") {
                dx = 1;
                meshRef.current.rotation.z = Math.PI / 2;
            } else return;

            // Update randomDeath moves
            if (
                currentEffect?.type === "randomDeath" &&
                currentEffect.movesLeft !== -1
            ) {
                const nextMoves = currentEffect.movesLeft - 1;
                if (nextMoves <= 0) {
                    setActiveEffect(null);
                } else {
                    setActiveEffect({...currentEffect, movesLeft: nextMoves});
                }
            }

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
            if (hitTree && currentEffect?.type !== "fly") return;

            playerPosRef.current = {x: newX, rowIndex: newRow};
            if (onRowChange) onRowChange(newRow);

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

        const playerX = meshRef.current.position.x + WORLD_OFFSET_X;

        const hitItem = sameRow.find(
            (o) =>
                o.type === "item" &&
                o.active &&
                overlaps1D(playerX, playerHalf, o.x, o.width / 2),
        );
        if (hitItem && activeEffect?.type !== "fly") {
            hitItem.active = false;
            const effectData = {...hitItem.itemEffect, startRow: playerRow};
            const duration = ITEM_DURATIONS[effectData.type] || 10;

            if (effectData.type === "randomDeath") {
                effectData.movesLeft = duration;
            } else {
                effectData.timeLeft = duration;
            }
            setActiveEffect(effectData);
        }

        let targetZ = tilesHeight / 2 + tileSize * 0.45;
        if (activeEffect?.type === "fly") {
            targetZ += tileSize * 1.5;
        }

        if (a.progress < 1) {
            a.progress = Math.min(1, a.progress + delta / MOVE_DURATION);
            const t = a.progress;
            meshRef.current.position.x = a.startX + (a.targetX - a.startX) * t;
            meshRef.current.position.y = a.startY + (a.targetY - a.startY) * t;
            meshRef.current.position.z =
                targetZ + Math.sin(t * Math.PI) * tileSize * 0.6;
        } else {
            meshRef.current.position.z = targetZ;
        }

        // ── Step 2: Kiểm tra va chạm xe / tàu (từ 70% animation trở đi) ──
        if (a.progress < 0.7) return;

        if (activeEffect?.type === "fly") return;

        const hitCar = sameRow.find(
            (o) =>
                o.type === "car" &&
                overlaps1D(playerX, playerHalf, o.x, o.width / 2),
        );
        const hitTrain = sameRow.find(
            (o) =>
                o.type === "train" &&
                o.active &&
                overlaps1D(playerX, playerHalf, o.x, o.width / 2),
        );

        if (hitCar || hitTrain) {
            if (activeEffect?.type !== "invincible" && !iFrameRef.current) {
                die(hitCar ? "car" : "train");
                return;
            }
        }

        // ── Step 3: Log riding — CHỈ khi đã hạ cánh (progress = 1) ──
        if (a.progress >= 1 && riverRowSet.has(playerRow)) {
            const onLog = sameRow.find(
                (o) =>
                    o.type === "log" &&
                    overlaps1D(playerX, playerHalf, o.x, o.width / 2),
            );

            if (!onLog) {
                if (activeEffect?.type !== "walkOnWater") {
                    if (!iFrameRef.current) die("water");
                    return;
                }
            } else {
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
        }

        // ── Step 4: Kiểm tra biên ──
        if (a.progress >= 1) {
            if (
                Math.abs(meshRef.current.position.x + WORLD_OFFSET_X) >
                HALF_ROW * tileSize + tileSize * 0.5
            ) {
                die("explosion");
            }
        }
    });

    function die(cause = "explosion") {
        if (isDeadRef.current) return;
        isDeadRef.current = true;
        const pos = meshRef.current.position;
        const rotZ = meshRef.current.rotation.z;
        setDeathData({ position: [pos.x, pos.y, pos.z], rotation: [0, 0, rotZ], cause });
        
        // Always hide the player except for "car" (where it will be flattened in the logic if we want to handle it there, but here we can hide and let the animation show the flattened model).
        meshRef.current.visible = false;
    }

    function handleExplosionDone() {
        onDie(playerPosRef.current.rowIndex, deathData?.cause || "explosion");
    }

    return (
        <>
            {/*
             * ─── Callback ref: gán cùng lúc cho meshRef (nội bộ) và playerRef (camera) ───
             * playerRef được truyền từ Game.jsx → Scene → CameraManager dùng getWorldPosition()
             */}
            <group
                ref={(el) => {
                    meshRef.current = el;
                    if (playerRef) playerRef.current = el;
                }}
                position={[-50, -250, tilesHeight / 2 + s * 0.45]}
                rotation={[0, 0, Math.PI]}
            >
                <CharModel s={s} activeEffect={activeEffect} />
            </group>

            {/* Render vụ nổ khi chết */}
            {deathData && (
                <DeathExplosion
                    position={deathData.position}
                    rotation={deathData.rotation}
                    s={s}
                    cause={deathData.cause}
                    CharModel={CharModel}
                    activeEffect={activeEffect}
                    onDone={handleExplosionDone}
                />
            )}
        </>
    );
}

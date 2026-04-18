import {tileSize, tilesHeight, tilesPerRow} from "../metadata/constants.js";
import {useRef, useEffect} from "react";
import {useFrame} from "@react-three/fiber";
import PlayerModel from "../model/PlayerModel.jsx";
import {rotate} from "three/tsl";

const MOVE_DURATION = 0.12;
const HALF_ROW = Math.floor(tilesPerRow / 2);

const logOffset = 0.125;

function overlaps1D(centerA, halfA, centerB, halfB) {
    return Math.abs(centerA - centerB) < halfA + halfB;
}

export default function Player({
    playerPosRef,
    obstaclesRef,
    riverRowSet,
    addRow,
}) {
    const meshRef = useRef();
    const s = tileSize;

    const isDeadRef = useRef(false);

    const anim = useRef({
        startX: 0,
        startY: 0,
        targetX: 0,
        targetY: 0,
        progress: 1,
    });

    useEffect(() => {
        const onKey = (e) => {
            if (isDeadRef.current) return;

            // Chờ animation hiện tại xong mới nhận input tiếp
            if (anim.current.progress < 1) return;

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

            // Giới hạn biên
            if (newX < -HALF_ROW || newX > HALF_ROW) return;
            if (newRow < 0) return;

            // Check chướng ngại vật (cây) ở vị trí mới
            const targetWorldX = newX * tileSize;

            const hitTree = obstaclesRef.current.find(
                (o) =>
                    o.rowIndex === newRow &&
                    o.type === "tree" &&
                    o.x === targetWorldX,
            );

            // Nếu ô đích có cây -> Return ngay lập tức, không làm gì cả
            if (hitTree) {
                return;
            }

            // Cập nhật grid position
            playerPosRef.current = {x: newX, rowIndex: newRow};

            // Chỉ thêm row mới khi tiến về phía trước
            if (dy > 0 && addRow) addRow();

            // Bắt đầu animation
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
        if (!meshRef.current) return;

        if (isDeadRef.current) return;

        const a = anim.current;

        if (a.progress < 1) {
            a.progress = Math.min(1, a.progress + delta / MOVE_DURATION);
            const t = a.progress;

            // Di chuyển X và Y (lerp tuyến tính)
            meshRef.current.position.x = a.startX + (a.targetX - a.startX) * t;
            meshRef.current.position.y = a.startY + (a.targetY - a.startY) * t;

            // Hop arc trên Z: sin(0→π) tạo hình vòm
            const baseZ = tilesHeight / 2 + tileSize * 0.45;
            meshRef.current.position.z =
                baseZ + Math.sin(t * Math.PI) * tileSize * 0.6;
        }

        if (a.progress < 0.7) return;
        // Cập nhật playerPosRef để kiểm tra va chạm chính xác khi đang di chuyển
        const playerX = meshRef.current.position.x;
        const playerRow = playerPosRef.current.rowIndex;
        const playerHalfSize = tileSize * 0.3;

        const sameRow = obstaclesRef.current.filter(
            (o) => o.rowIndex == playerRow,
        );
        // Kiểm tra va chạm với xe
        const hitCar = sameRow.find((o) => {
            if (o.type != "car") return false;
            return overlaps1D(playerX, playerHalfSize, o.x, o.width / 2);
        });

        if (hitCar) {
            die();
            return;
        }

        if (a.progress < 1) return; // Chỉ kiểm tra khi đã di chuyển xong

        if (riverRowSet.has(playerRow)) {
            // Nếu đang ở trên sông, kiểm tra có đứng trên khúc gỗ nào không
            const onLog = sameRow.find(
                (o) =>
                    o.type === "log" &&
                    overlaps1D(playerX, playerHalfSize, o.x, o.width / 2),
            );

            if (!onLog) {
                die();
                return; // Nếu không đứng trên khúc gỗ nào -> chết
            }

            meshRef.current.position.x += onLog.velocityX || 0;
            anim.current.startX = meshRef.current.position.x;
            anim.current.targetX = meshRef.current.position.x;
            playerPosRef.current.x = meshRef.current.position.x / tileSize;
            meshRef.current.position.z =
                tilesHeight / 2 + s * logOffset + s * 0.45;
        }

        if (
            Math.abs(meshRef.current.position.x) >
            HALF_ROW * tileSize + tileSize * 0.5
        ) {
            die();
            return; // Nếu trôi ra ngoài biên -> chết
        }
    });

    function die() {
        if (isDeadRef.current) return;
        isDeadRef.current = true;
        // Reset về vị trí ban đầu
        try {
            alert("u stupid 💀");
            console.log("Player died. Resetting position.");
        } finally {
            window.location.reload();
        }
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

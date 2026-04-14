import {tileSize, tilesHeight, tilesPerRow} from "../metadata/constants.js";
import {useRef, useEffect} from "react";
import {useFrame} from "@react-three/fiber";

const MOVE_DURATION = 0.12;
const HALF_ROW = Math.floor(tilesPerRow / 2);

export default function Player({playerPosRef}) {
    const meshRef = useRef();
    const s = tileSize;

    const anim = useRef({
        startX: 0,
        startY: 0,
        targetX: 0,
        targetY: 0,
        progress: 1,
    });

    useEffect(() => {
        const onKey = (e) => {
            // Chờ animation hiện tại xong mới nhận input tiếp
            if (anim.current.progress < 1) return;

            const {x, rowIndex} = playerPosRef.current;
            let dx = 0,
                dy = 0;

            if (e.key === "ArrowUp" || e.key === "w") dy = 1;
            else if (e.key === "ArrowDown" || e.key === "s") dy = -1;
            else if (e.key === "ArrowLeft" || e.key === "a") dx = -1;
            else if (e.key === "ArrowRight" || e.key === "d") dx = 1;
            else return;

            const newX = x + dx;
            const newRow = rowIndex + dy;

            // Giới hạn biên
            if (newX < -HALF_ROW || newX > HALF_ROW) return;
            if (newRow < 0) return;

            // Cập nhật grid position
            playerPosRef.current = {x: newX, rowIndex: newRow};

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
        const a = anim.current;
        if (a.progress >= 1) return;

        a.progress = Math.min(1, a.progress + delta / MOVE_DURATION);
        const t = a.progress;

        // Di chuyển X và Y (lerp tuyến tính)
        meshRef.current.position.x = a.startX + (a.targetX - a.startX) * t;
        meshRef.current.position.y = a.startY + (a.targetY - a.startY) * t;

        // Hop arc trên Z: sin(0→π) tạo hình vòm
        const baseZ = tilesHeight / 2 + tileSize * 0.45;
        meshRef.current.position.z =
            baseZ + Math.sin(t * Math.PI) * tileSize * 0.6;
    });

    return (
        <mesh ref={meshRef} position={[0, 0, tilesHeight / 2 + s * 0.45]}>
            <boxGeometry args={[s * 0.6, s * 0.6, s * 0.9]} />
            <meshPhongMaterial color={0xfffff8} />
        </mesh>
    );
}

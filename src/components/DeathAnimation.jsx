import {useRef, useMemo} from "react";
import {useFrame} from "@react-three/fiber";

const GRAVITY = -800;
const LIFETIME = 1.2; // giây trước khi unmount

// Màu mảnh vỡ — lấy từ màu con gà
const PIECE_COLORS = [
    "#FAFAF5",
    "#FFF8E1",
    "#E8E8E0",
    "#D0D0C8",
    "#FF8F00",
    "#FFA000",
    "#E53935",
    "#EF5350",
    "#FFFFFF",
    "#ECECE4",
];

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

// Sinh ngẫu nhiên các mảnh vỡ
function generatePieces(s, count) {
    return Array.from({length: count}, (_, i) => ({
        // Vị trí ban đầu quanh trung tâm nhân vật
        px: randomBetween(-s * 0.3, s * 0.3),
        py: randomBetween(-s * 0.3, s * 0.3),
        pz: randomBetween(0, s * 0.8),
        // Vận tốc ban đầu — văng ra xung quanh
        vx: randomBetween(-s * 6, s * 6),
        vy: randomBetween(-s * 6, s * 6),
        vz: randomBetween(s * 2, s * 10),
        // Vận tốc quay
        rx: randomBetween(-8, 8),
        ry: randomBetween(-8, 8),
        rz: randomBetween(-8, 8),
        // Kích thước mảnh
        size: randomBetween(s * 0.08, s * 0.28),
        color: PIECE_COLORS[i % PIECE_COLORS.length],
    }));
}

const WATER_COLORS = [
    "#4DD0E1",
    "#00BCD4",
    "#00ACC1",
    "#0097A7",
    "#80DEEA",
    "#B2EBF2",
    "#FFFFFF"
];

// Sinh ngẫu nhiên các vệt nước
function generateWaterDrops(s, count) {
    return Array.from({length: count}, (_, i) => ({
        px: randomBetween(-s * 0.2, s * 0.2),
        py: randomBetween(-s * 0.2, s * 0.2),
        pz: -s * 0.45, // Bắt đầu ở mặt nước
        vx: randomBetween(-s * 3, s * 3),
        vy: randomBetween(-s * 3, s * 3),
        vz: randomBetween(s * 4, s * 8),
        size: randomBetween(s * 0.02, s * 0.08),
        color: WATER_COLORS[i % WATER_COLORS.length],
    }));
}

// Component 1 mảnh vỡ hoặc giọt nước
function Particle({piece, s, progressRef, isWater}) {
    const meshRef = useRef();

    const state = useRef({
        px: piece.px,
        py: piece.py,
        pz: piece.pz,
        rx: 0,
        ry: 0,
        rz: 0,
    });

    useFrame((_, delta) => {
        if (!meshRef.current) return;
        const p = progressRef.current;
        if (p >= LIFETIME) return;

        const st = state.current;

        piece.vz += GRAVITY * delta; 
        st.px += piece.vx * delta;
        st.py += piece.vy * delta;
        st.pz += piece.vz * delta;

        // Nảy lại khi chạm đất (tương đối so với group gốc là -s * 0.45)
        const groundZ = -s * 0.45;
        if (st.pz < groundZ) {
            st.pz = groundZ;
            if (!isWater) {
                piece.vz = Math.abs(piece.vz) * 0.35; 
                piece.vx *= 0.6;
                piece.vy *= 0.6;
            } else {
                piece.vz = 0;
                piece.vx = 0;
                piece.vy = 0;
            }
        }

        if (!isWater) {
            st.rx += piece.rx * delta;
            st.ry += piece.ry * delta;
            st.rz += piece.rz * delta;
        }

        const fadeStart = LIFETIME * 0.6;
        if (p > fadeStart) {
            const opacity = 1 - (p - fadeStart) / (LIFETIME - fadeStart);
            meshRef.current.material.opacity = opacity;
            meshRef.current.material.transparent = true;
        }

        meshRef.current.position.set(st.px, st.py, st.pz);
        if (!isWater) {
            meshRef.current.rotation.set(st.rx, st.ry, st.rz);
        }
    });

    return (
        <mesh ref={meshRef} position={[piece.px, piece.py, piece.pz]}>
            <boxGeometry args={[piece.size, piece.size, piece.size]} />
            <meshPhongMaterial color={piece.color} flatShading={!isWater} />
        </mesh>
    );
}

export default function DeathExplosion({position, rotation, s, onDone, cause = "explosion", CharModel, activeEffect}) {
    const progressRef = useRef(0);
    const doneRef = useRef(false);
    const modelRef = useRef();

    const isExplosion = cause === "explosion" || cause === "train";
    const isWater = cause === "water";
    const isCar = cause === "car";

    // Sinh particles
    const particles = useMemo(() => {
        if (isExplosion) return generatePieces(s, 28);
        if (isWater) return generateWaterDrops(s, 15);
        return []; // car không có văng mảnh
    }, [isExplosion, isWater, s]);

    useFrame((_, delta) => {
        progressRef.current += delta;
        
        if (isCar && modelRef.current && progressRef.current < 0.05) {
            // Flatten animation (mất ~0.05s để bẹp dí)
            const t = progressRef.current / 0.05;
            modelRef.current.scale.set(1 + t * 0.2, 1 + t * 0.2, 1 - t * 0.9);
            modelRef.current.position.z = -s * 0.4 * t; // Hạ thấp trọng tâm
        }

        if (isWater && modelRef.current) {
            // Submerge animation, clamped so it doesn't go below the map
            modelRef.current.position.z = Math.max(-s * 1.3, modelRef.current.position.z - s * delta * 4);
        }

        if (!doneRef.current && progressRef.current >= LIFETIME) {
            doneRef.current = true;
            if (onDone) onDone();
        }
    });

    return (
        <group position={position}>
            {/* Nếu bị vụ nổ, chỉ hiện mảnh vỡ, không hiện model */}
            {(isWater || isCar) && CharModel && (
                <group ref={modelRef} rotation={rotation || [0, 0, Math.PI]}>
                    <CharModel s={s} activeEffect={activeEffect} />
                </group>
            )}

            {particles.map((piece, i) => (
                <Particle key={i} piece={piece} s={s} progressRef={progressRef} isWater={isWater} />
            ))}
        </group>
    );
}

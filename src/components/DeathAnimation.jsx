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

// Component 1 mảnh vỡ
function Piece({piece, s, progressRef}) {
    const meshRef = useRef();

    // Lưu vị trí + góc quay tích lũy trong ref (không trigger re-render)
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

        // Cập nhật vị trí
        piece.vz += GRAVITY * delta; // trọng lực
        st.px += piece.vx * delta;
        st.py += piece.vy * delta;
        st.pz += piece.vz * delta;

        // Nảy lại khi chạm đất (z < 0)
        if (st.pz < 0) {
            st.pz = 0;
            piece.vz = Math.abs(piece.vz) * 0.35; // bounce
            piece.vx *= 0.6;
            piece.vy *= 0.6;
        }

        // Cập nhật rotation
        st.rx += piece.rx * delta;
        st.ry += piece.ry * delta;
        st.rz += piece.rz * delta;

        // Fade out ở cuối đời
        const fadeStart = LIFETIME * 0.6;
        if (p > fadeStart) {
            const opacity = 1 - (p - fadeStart) / (LIFETIME - fadeStart);
            meshRef.current.material.opacity = opacity;
            meshRef.current.material.transparent = true;
        }

        meshRef.current.position.set(st.px, st.py, st.pz);
        meshRef.current.rotation.set(st.rx, st.ry, st.rz);
    });

    return (
        <mesh ref={meshRef} position={[piece.px, piece.py, piece.pz]}>
            <boxGeometry args={[piece.size, piece.size, piece.size]} />
            <meshPhongMaterial color={piece.color} />
        </mesh>
    );
}

// Component vụ nổ chính
// Props:
//   position — [x, y, z] vị trí nhân vật lúc chết
//   s        — tileSize
//   onDone   — callback khi animation xong
export default function DeathExplosion({position, s, onDone}) {
    const progressRef = useRef(0);
    const doneRef = useRef(false);

    // Sinh mảnh vỡ 1 lần duy nhất
    const pieces = useMemo(() => generatePieces(s, 28), []);

    useFrame((_, delta) => {
        progressRef.current += delta;
        if (!doneRef.current && progressRef.current >= LIFETIME) {
            doneRef.current = true;
            if (onDone) onDone();
        }
    });

    return (
        <group position={position}>
            {pieces.map((piece, i) => (
                <Piece key={i} piece={piece} s={s} progressRef={progressRef} />
            ))}
        </group>
    );
}

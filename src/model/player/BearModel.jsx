export default function BearModel({s}) {
    const fur = "#5D4037";
    const dark = "#3E2723";
    const belly = "#8D6E63";
    const nose = "#212121";
    const ear = "#4E342E";

    return (
        <>
            {/* Chân trái */}
            <mesh position={[-s * 0.18, s * 0.08, -s * 0.38]}>
                <boxGeometry args={[s * 0.2, s * 0.22, s * 0.16]} />
                <meshPhongMaterial color={fur} />
            </mesh>
            <mesh position={[-s * 0.2, -s * 0.04, -s * 0.46]}>
                <boxGeometry args={[s * 0.24, s * 0.1, s * 0.08]} />
                <meshPhongMaterial color={dark} />
            </mesh>
            {/* Chân phải */}
            <mesh position={[s * 0.18, s * 0.08, -s * 0.38]}>
                <boxGeometry args={[s * 0.2, s * 0.22, s * 0.16]} />
                <meshPhongMaterial color={fur} />
            </mesh>
            <mesh position={[s * 0.2, -s * 0.04, -s * 0.46]}>
                <boxGeometry args={[s * 0.24, s * 0.1, s * 0.08]} />
                <meshPhongMaterial color={dark} />
            </mesh>

            {/* Thân tròn */}
            <mesh position={[0, 0, -s * 0.04]}>
                <boxGeometry args={[s * 0.62, s * 0.54, s * 0.56]} />
                <meshPhongMaterial color={fur} />
            </mesh>
            {/* Bụng */}
            <mesh position={[0, -s * 0.08, -s * 0.02]}>
                <boxGeometry args={[s * 0.36, s * 0.28, s * 0.42]} />
                <meshPhongMaterial color={belly} />
            </mesh>

            {/* Tay trái */}
            <mesh position={[-s * 0.36, s * 0.08, -s * 0.02]}>
                <boxGeometry args={[s * 0.12, s * 0.36, s * 0.22]} />
                <meshPhongMaterial color={fur} />
            </mesh>
            {/* Tay phải */}
            <mesh position={[s * 0.36, s * 0.08, -s * 0.02]}>
                <boxGeometry args={[s * 0.12, s * 0.36, s * 0.22]} />
                <meshPhongMaterial color={fur} />
            </mesh>

            {/* Đầu */}
            <mesh position={[0, -s * 0.04, s * 0.28]}>
                <boxGeometry args={[s * 0.54, s * 0.48, s * 0.46]} />
                <meshPhongMaterial color={fur} />
            </mesh>

            {/* Mõm */}
            <mesh position={[0, -s * 0.24, s * 0.22]}>
                <boxGeometry args={[s * 0.26, s * 0.1, s * 0.18]} />
                <meshPhongMaterial color={belly} />
            </mesh>
            {/* Mũi */}
            <mesh position={[0, -s * 0.28, s * 0.32]}>
                <boxGeometry args={[s * 0.14, s * 0.06, s * 0.08]} />
                <meshPhongMaterial color={nose} />
            </mesh>

            {/* Mắt trái */}
            <mesh position={[-s * 0.14, -s * 0.2, s * 0.4]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.1]} />
                <meshPhongMaterial color={nose} />
            </mesh>
            <mesh position={[-s * 0.11, -s * 0.21, s * 0.42]}>
                <boxGeometry args={[s * 0.04, s * 0.02, s * 0.04]} />
                <meshPhongMaterial color="#FFFFFF" />
            </mesh>
            {/* Mắt phải */}
            <mesh position={[s * 0.14, -s * 0.2, s * 0.4]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.1]} />
                <meshPhongMaterial color={nose} />
            </mesh>
            <mesh position={[s * 0.11, -s * 0.21, s * 0.42]}>
                <boxGeometry args={[s * 0.04, s * 0.02, s * 0.04]} />
                <meshPhongMaterial color="#FFFFFF" />
            </mesh>

            {/* Tai trái */}
            <mesh position={[-s * 0.22, -s * 0.1, s * 0.52]}>
                <boxGeometry args={[s * 0.16, s * 0.14, s * 0.16]} />
                <meshPhongMaterial color={fur} />
            </mesh>
            <mesh position={[-s * 0.22, -s * 0.11, s * 0.54]}>
                <boxGeometry args={[s * 0.08, s * 0.08, s * 0.08]} />
                <meshPhongMaterial color={ear} />
            </mesh>
            {/* Tai phải */}
            <mesh position={[s * 0.22, -s * 0.1, s * 0.52]}>
                <boxGeometry args={[s * 0.16, s * 0.14, s * 0.16]} />
                <meshPhongMaterial color={fur} />
            </mesh>
            <mesh position={[s * 0.22, -s * 0.11, s * 0.54]}>
                <boxGeometry args={[s * 0.08, s * 0.08, s * 0.08]} />
                <meshPhongMaterial color={ear} />
            </mesh>
        </>
    );
}

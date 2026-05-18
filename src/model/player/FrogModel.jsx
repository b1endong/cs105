export default function FrogModel({s}) {
    return (
        <>
            {/* Chân sau trái */}
            <mesh position={[-s * 0.22, s * 0.1, -s * 0.38]}>
                <boxGeometry args={[s * 0.18, s * 0.28, s * 0.12]} />
                <meshPhongMaterial color="#2E7D32" />
            </mesh>
            <mesh position={[-s * 0.3, -s * 0.06, -s * 0.44]}>
                <boxGeometry args={[s * 0.24, s * 0.1, s * 0.08]} />
                <meshPhongMaterial color="#388E3C" />
            </mesh>
            {/* Chân sau phải */}
            <mesh position={[s * 0.22, s * 0.1, -s * 0.38]}>
                <boxGeometry args={[s * 0.18, s * 0.28, s * 0.12]} />
                <meshPhongMaterial color="#2E7D32" />
            </mesh>
            <mesh position={[s * 0.3, -s * 0.06, -s * 0.44]}>
                <boxGeometry args={[s * 0.24, s * 0.1, s * 0.08]} />
                <meshPhongMaterial color="#388E3C" />
            </mesh>

            {/* Thân */}
            <mesh position={[0, 0, -s * 0.04]}>
                <boxGeometry args={[s * 0.58, s * 0.5, s * 0.48]} />
                <meshPhongMaterial color="#43A047" />
            </mesh>
            {/* Bụng sáng */}
            <mesh position={[0, -s * 0.1, -s * 0.06]}>
                <boxGeometry args={[s * 0.38, s * 0.3, s * 0.36]} />
                <meshPhongMaterial color="#A5D6A7" />
            </mesh>

            {/* Tay trái */}
            <mesh position={[-s * 0.36, s * 0.06, -s * 0.08]}>
                <boxGeometry args={[s * 0.14, s * 0.32, s * 0.14]} />
                <meshPhongMaterial color="#388E3C" />
            </mesh>
            {/* Tay phải */}
            <mesh position={[s * 0.36, s * 0.06, -s * 0.08]}>
                <boxGeometry args={[s * 0.14, s * 0.32, s * 0.14]} />
                <meshPhongMaterial color="#388E3C" />
            </mesh>

            {/* Đầu — rộng và dẹt */}
            <mesh position={[0, -s * 0.02, s * 0.26]}>
                <boxGeometry args={[s * 0.62, s * 0.52, s * 0.34]} />
                <meshPhongMaterial color="#43A047" />
            </mesh>

            {/* Miệng rộng */}
            <mesh position={[0, -s * 0.27, s * 0.14]}>
                <boxGeometry args={[s * 0.46, s * 0.06, s * 0.08]} />
                <meshPhongMaterial color="#1B5E20" />
            </mesh>

            {/* Mắt lồi trái */}
            <mesh position={[-s * 0.2, -s * 0.18, s * 0.38]}>
                <boxGeometry args={[s * 0.18, s * 0.12, s * 0.18]} />
                <meshPhongMaterial color="#C8E6C9" />
            </mesh>
            <mesh position={[-s * 0.2, -s * 0.21, s * 0.4]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.1]} />
                <meshPhongMaterial color="#111111" />
            </mesh>
            {/* Highlight mắt trái */}
            <mesh position={[-s * 0.16, -s * 0.22, s * 0.42]}>
                <boxGeometry args={[s * 0.04, s * 0.02, s * 0.04]} />
                <meshPhongMaterial color="#FFFFFF" />
            </mesh>

            {/* Mắt lồi phải */}
            <mesh position={[s * 0.2, -s * 0.18, s * 0.38]}>
                <boxGeometry args={[s * 0.18, s * 0.12, s * 0.18]} />
                <meshPhongMaterial color="#C8E6C9" />
            </mesh>
            <mesh position={[s * 0.2, -s * 0.21, s * 0.4]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.1]} />
                <meshPhongMaterial color="#111111" />
            </mesh>
            <mesh position={[s * 0.16, -s * 0.22, s * 0.42]}>
                <boxGeometry args={[s * 0.04, s * 0.02, s * 0.04]} />
                <meshPhongMaterial color="#FFFFFF" />
            </mesh>

            {/* Đốm lưng */}
            {[
                [-s * 0.12, s * 0.26],
                [s * 0.08, s * 0.18],
                [-s * 0.06, s * 0.1],
            ].map(([x, y], i) => (
                <mesh key={i} position={[x, y, s * 0.22]}>
                    <boxGeometry args={[s * 0.08, s * 0.08, s * 0.02]} />
                    <meshPhongMaterial color="#1B5E20" />
                </mesh>
            ))}
        </>
    );
}

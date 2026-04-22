export default function RailModel({s, W}) {
    const sleeperCount = Math.ceil(W / (s * 0.7));

    return (
        <group>
            {/* Nền đất đường ray */}
            <mesh position={[0, 0, s * 0.0625]}>
                <boxGeometry args={[W, s, s * 0.125]} />
                <meshPhongMaterial color="#5D4037" />
            </mesh>

            {/* Đá sỏi ballast */}
            <mesh position={[0, 0, s * 0.09]}>
                <boxGeometry args={[W, s * 0.74, s * 0.06]} />
                <meshPhongMaterial color="#9E9E9E" />
            </mesh>

            {/* Tà vẹt (sleepers) */}
            {Array.from({length: sleeperCount}, (_, i) => (
                <mesh
                    key={i}
                    position={[-W / 2 + i * s * 0.7 + s * 0.35, 0, s * 0.1]}
                >
                    <boxGeometry args={[s * 0.14, s * 0.7, s * 0.08]} />
                    <meshPhongMaterial color="#4E342E" />
                </mesh>
            ))}

            {/* Ray trái */}
            <mesh position={[0, -s * 0.22, s * 0.145]}>
                <boxGeometry args={[W, s * 0.08, s * 0.06]} />
                <meshPhongMaterial color="#B0BEC5" />
            </mesh>
            {/* Ray phải */}
            <mesh position={[0, s * 0.22, s * 0.145]}>
                <boxGeometry args={[W, s * 0.08, s * 0.06]} />
                <meshPhongMaterial color="#B0BEC5" />
            </mesh>

            {/* Viền cỏ 2 mép */}
            <mesh position={[0, s * 0.46, s * 0.068]}>
                <boxGeometry args={[W, s * 0.08, s * 0.015]} />
                <meshPhongMaterial color="#558B2F" />
            </mesh>
            <mesh position={[0, -s * 0.46, s * 0.068]}>
                <boxGeometry args={[W, s * 0.08, s * 0.015]} />
                <meshPhongMaterial color="#558B2F" />
            </mesh>
        </group>
    );
}

// MoonModel — khối mặt trăng voxel với hố va chạm
export default function MoonModel({s = 64}) {
    const moonColor = "#F5F5DC";
    const craterColor = "#BDBDBD";
    const glowColor = "#E8EAF6";

    const craters = [
        {x: -s * 0.28, y: s * 0.22, r: s * 0.26},
        {x: s * 0.3, y: -s * 0.18, r: s * 0.2},
        {x: -s * 0.1, y: -s * 0.3, r: s * 0.14},
        {x: s * 0.14, y: s * 0.34, r: s * 0.12},
    ];

    return (
        <group>
            {/* Thân mặt trăng */}
            <mesh>
                <boxGeometry args={[s * 1.2, s * 1.2, s * 1.2]} />
                <meshPhongMaterial
                    color={moonColor}
                    emissive={moonColor}
                    emissiveIntensity={0.3}
                />
            </mesh>
            {/* Glow nhẹ */}
            <mesh>
                <boxGeometry args={[s * 1.5, s * 1.5, s * 0.3]} />
                <meshPhongMaterial
                    color={glowColor}
                    emissive={glowColor}
                    emissiveIntensity={0.15}
                    transparent
                    opacity={0.35}
                />
            </mesh>

            {/* Hố va chạm (crater) */}
            {craters.map((c, i) => (
                <mesh key={i} position={[c.x, c.y, s * 0.62]}>
                    <boxGeometry args={[c.r, c.r, s * 0.08]} />
                    <meshPhongMaterial color={craterColor} />
                </mesh>
            ))}

            {/* Viền tối 1 bên (bóng) */}
            <mesh position={[s * 0.38, 0, 0]}>
                <boxGeometry args={[s * 0.44, s * 1.18, s * 1.18]} />
                <meshPhongMaterial color="#9E9E9E" transparent opacity={0.4} />
            </mesh>
        </group>
    );
}

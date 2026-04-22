// SunModel — khối mặt trời voxel với tia sáng
export default function SunModel({s = 64}) {
    const rayColor = "#FFF176";
    const coreColor = "#FFD600";
    const glowColor = "#FFEE58";

    return (
        <group>
            {/* Lõi mặt trời */}
            <mesh>
                <boxGeometry args={[s * 1.4, s * 1.4, s * 1.4]} />
                <meshPhongMaterial
                    color={coreColor}
                    emissive={coreColor}
                    emissiveIntensity={0.8}
                />
            </mesh>
            {/* Lớp glow ngoài */}
            <mesh>
                <boxGeometry args={[s * 1.8, s * 1.8, s * 0.4]} />
                <meshPhongMaterial
                    color={glowColor}
                    emissive={glowColor}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.6}
                />
            </mesh>

            {/* Tia — 4 hướng ngang */}
            {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
                <group key={i} rotation={[0, 0, rot]}>
                    <mesh position={[s * 1.6, 0, 0]}>
                        <boxGeometry args={[s * 0.8, s * 0.28, s * 0.28]} />
                        <meshPhongMaterial
                            color={rayColor}
                            emissive={rayColor}
                            emissiveIntensity={0.6}
                        />
                    </mesh>
                    <mesh position={[s * 2.2, 0, 0]}>
                        <boxGeometry args={[s * 0.4, s * 0.16, s * 0.16]} />
                        <meshPhongMaterial
                            color={rayColor}
                            emissive={rayColor}
                            emissiveIntensity={0.4}
                        />
                    </mesh>
                </group>
            ))}

            {/* Tia — 4 hướng chéo */}
            {[
                Math.PI / 4,
                (Math.PI * 3) / 4,
                (Math.PI * 5) / 4,
                (Math.PI * 7) / 4,
            ].map((rot, i) => (
                <group key={i} rotation={[0, 0, rot]}>
                    <mesh position={[s * 1.4, 0, 0]}>
                        <boxGeometry args={[s * 0.55, s * 0.2, s * 0.2]} />
                        <meshPhongMaterial
                            color={rayColor}
                            emissive={rayColor}
                            emissiveIntensity={0.5}
                        />
                    </mesh>
                </group>
            ))}
        </group>
    );
}

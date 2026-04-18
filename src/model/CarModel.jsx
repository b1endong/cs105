export default function CarModel({s, color}) {
    return (
        <>
            {/* Chassis */}
            <mesh position={[0, 0, s * 0.06]}>
                <boxGeometry args={[s * 1.52, s * 0.64, s * 0.12]} />
                <meshPhongMaterial color="#212121" />
            </mesh>

            {/* Body */}
            <mesh position={[0, 0, s * 0.2]}>
                <boxGeometry args={[s * 1.5, s * 0.62, s * 0.3]} />
                <meshPhongMaterial color={color} />
            </mesh>
            <mesh position={[0, -s * 0.28, s * 0.2]}>
                <boxGeometry args={[s * 1.48, s * 0.06, s * 0.22]} />
                <meshPhongMaterial color={color} />
            </mesh>
            <mesh position={[0, s * 0.28, s * 0.2]}>
                <boxGeometry args={[s * 1.48, s * 0.06, s * 0.22]} />
                <meshPhongMaterial color={color} />
            </mesh>

            {/* Cabin */}
            <mesh position={[s * 0.06, 0, s * 0.44]}>
                <boxGeometry args={[s * 0.84, s * 0.58, s * 0.28]} />
                <meshPhongMaterial color={color} />
            </mesh>
            <mesh position={[s * 0.06, 0, s * 0.6]}>
                <boxGeometry args={[s * 0.64, s * 0.48, s * 0.06]} />
                <meshPhongMaterial color={color} />
            </mesh>

            {/* Windshields */}
            <mesh position={[-s * 0.46, 0, s * 0.46]}>
                <boxGeometry args={[s * 0.06, s * 0.52, s * 0.22]} />
                <meshPhongMaterial color="#90CAF9" transparent opacity={0.85} />
            </mesh>
            <mesh position={[s * 0.5, 0, s * 0.44]}>
                <boxGeometry args={[s * 0.06, s * 0.5, s * 0.2]} />
                <meshPhongMaterial color="#90CAF9" transparent opacity={0.85} />
            </mesh>
            <mesh position={[s * 0.06, -s * 0.3, s * 0.46]}>
                <boxGeometry args={[s * 0.62, s * 0.06, s * 0.17]} />
                <meshPhongMaterial color="#90CAF9" transparent opacity={0.85} />
            </mesh>
            <mesh position={[s * 0.06, s * 0.3, s * 0.46]}>
                <boxGeometry args={[s * 0.62, s * 0.06, s * 0.17]} />
                <meshPhongMaterial color="#90CAF9" transparent opacity={0.85} />
            </mesh>

            {/* Headlights */}
            <mesh position={[-s * 0.78, -s * 0.18, s * 0.24]}>
                <boxGeometry args={[s * 0.04, s * 0.14, s * 0.1]} />
                <meshPhongMaterial
                    color="#FFFDE7"
                    emissive="#FFF9C4"
                    emissiveIntensity={0.7}
                />
            </mesh>
            <mesh position={[-s * 0.78, s * 0.18, s * 0.24]}>
                <boxGeometry args={[s * 0.04, s * 0.14, s * 0.1]} />
                <meshPhongMaterial
                    color="#FFFDE7"
                    emissive="#FFF9C4"
                    emissiveIntensity={0.7}
                />
            </mesh>

            {/* Taillights */}
            <mesh position={[s * 0.78, -s * 0.18, s * 0.24]}>
                <boxGeometry args={[s * 0.04, s * 0.14, s * 0.1]} />
                <meshPhongMaterial
                    color="#FF3D00"
                    emissive="#FF3D00"
                    emissiveIntensity={0.4}
                />
            </mesh>
            <mesh position={[s * 0.78, s * 0.18, s * 0.24]}>
                <boxGeometry args={[s * 0.04, s * 0.14, s * 0.1]} />
                <meshPhongMaterial
                    color="#FF3D00"
                    emissive="#FF3D00"
                    emissiveIntensity={0.4}
                />
            </mesh>

            {/* Bumpers */}
            <mesh position={[-s * 0.76, 0, s * 0.12]}>
                <boxGeometry args={[s * 0.04, s * 0.54, s * 0.1]} />
                <meshPhongMaterial color="#BDBDBD" />
            </mesh>
            <mesh position={[s * 0.76, 0, s * 0.12]}>
                <boxGeometry args={[s * 0.04, s * 0.54, s * 0.1]} />
                <meshPhongMaterial color="#BDBDBD" />
            </mesh>

            {/* Wheels */}
            {[
                [-s * 0.44, -s * 0.37],
                [-s * 0.44, s * 0.37],
                [s * 0.44, -s * 0.37],
                [s * 0.44, s * 0.37],
            ].map(([x, y], i) => (
                <group key={i} position={[x, y, s * 0.1]}>
                    <mesh>
                        <boxGeometry args={[s * 0.26, s * 0.16, s * 0.24]} />
                        <meshPhongMaterial color="#1A1A1A" />
                    </mesh>
                    <mesh position={[0, y > 0 ? s * 0.06 : -s * 0.06, 0]}>
                        <boxGeometry args={[s * 0.18, s * 0.04, s * 0.16]} />
                        <meshPhongMaterial color="#9E9E9E" />
                    </mesh>
                    <mesh position={[0, y > 0 ? s * 0.065 : -s * 0.065, 0]}>
                        <boxGeometry args={[s * 0.08, s * 0.03, s * 0.08]} />
                        <meshPhongMaterial color="#E0E0E0" />
                    </mesh>
                </group>
            ))}
        </>
    );
}

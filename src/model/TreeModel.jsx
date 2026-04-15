export default function TreeModel({x, h, s, color}) {
    return (
        <group position={[x, 0, h / 2]}>
            {/* === TRUNK === */}
            <mesh position={[0, 0, s * 0.19]}>
                <boxGeometry args={[s * 0.2, s * 0.2, s * 0.38]} />
                <meshPhongMaterial color="#5D4037" />
            </mesh>
            {/* Trunk highlight */}
            <mesh position={[-s * 0.04, -s * 0.04, s * 0.22]}>
                <boxGeometry args={[s * 0.06, s * 0.05, s * 0.26]} />
                <meshPhongMaterial color="#795548" />
            </mesh>
            {/* Roots */}
            <mesh position={[-s * 0.14, 0, s * 0.04]}>
                <boxGeometry args={[s * 0.09, s * 0.14, s * 0.08]} />
                <meshPhongMaterial color="#4E342E" />
            </mesh>
            <mesh position={[s * 0.14, 0, s * 0.04]}>
                <boxGeometry args={[s * 0.09, s * 0.14, s * 0.08]} />
                <meshPhongMaterial color="#4E342E" />
            </mesh>

            {/* === FOLIAGE — 5 tiers, pyramid shape === */}
            {/* Tier 1 — widest, darkest */}
            <mesh position={[0, 0, s * 0.52]}>
                <boxGeometry args={[s * 0.86, s * 0.86, s * 0.24]} />
                <meshPhongMaterial color={dark} />
            </mesh>
            {/* Tier 1 shadow underside */}
            <mesh position={[0, 0, s * 0.43]}>
                <boxGeometry args={[s * 0.7, s * 0.7, s * 0.08]} />
                <meshPhongMaterial color={shadeHex(dark, -20)} />
            </mesh>

            {/* Tier 2 */}
            <mesh position={[0, 0, s * 0.72]}>
                <boxGeometry args={[s * 0.68, s * 0.68, s * 0.22]} />
                <meshPhongMaterial color={mid} />
            </mesh>

            {/* Tier 3 */}
            <mesh position={[0, 0, s * 0.9]}>
                <boxGeometry args={[s * 0.52, s * 0.52, s * 0.2]} />
                <meshPhongMaterial color={color} />
            </mesh>

            {/* Tier 4 */}
            <mesh position={[0, 0, s * 1.06]}>
                <boxGeometry args={[s * 0.36, s * 0.36, s * 0.18]} />
                <meshPhongMaterial color={light} />
            </mesh>

            {/* Tip */}
            <mesh position={[0, 0, s * 1.2]}>
                <boxGeometry args={[s * 0.18, s * 0.18, s * 0.16]} />
                <meshPhongMaterial color={light} />
            </mesh>
            <mesh position={[0, 0, s * 1.31]}>
                <boxGeometry args={[s * 0.09, s * 0.09, s * 0.1]} />
                <meshPhongMaterial color={shadeHex(light, 15)} />
            </mesh>
        </group>
    );
}

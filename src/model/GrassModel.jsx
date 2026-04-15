export default function GrassModel({x, y, s, h, color}) {
    return (
        <mesh position={[x, y, h / 2 + 1.5]}>
            <boxGeometry args={[s * 0.07, s * 0.07, s * 0.06]} />
            <meshPhongMaterial color={color} />
        </mesh>
    );
}

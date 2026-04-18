export default function ForestModel({s, W, rowIndex}) {
    const tufts = [];
    for (let i = -6; i <= 6; i++) {
        for (let j = 0; j < 2; j++) {
            const seed = (rowIndex * 17 + i * 7 + j * 3) % 10;
            if (seed > 3) {
                const randomOffset = Math.sin(rowIndex * i * j + i) * 0.5;
                const offsetY = randomOffset * s * 0.7;
                const colors = ["#81C784", "#A5D6A7", "#FFD54F", "#FF8A65"];

                tufts.push({
                    x: i * s + ((rowIndex + i + j) % 3) * s * 0.25,
                    y: offsetY,
                    color: colors[(rowIndex + i * 3 + j) % colors.length],
                });
            }
        }
    }

    return (
        <>
            {/* Ground base */}
            <mesh>
                <boxGeometry args={[W, s, s * 0.125]} />
                <meshPhongMaterial color="#558B2F" />
            </mesh>

            {/* Surface highlight */}
            <mesh position={[0, 0, s * 0.072]}>
                <boxGeometry args={[W, s * 0.7, s * 0.018]} />
                <meshPhongMaterial color="#689F38" />
            </mesh>

            {/* Front edge strip */}
            <mesh position={[0, s * 0.44, s * 0.075]}>
                <boxGeometry args={[W, s * 0.1, s * 0.025]} />
                <meshPhongMaterial color="#33691E" />
            </mesh>
            {/* Back edge strip */}
            <mesh position={[0, -s * 0.44, s * 0.075]}>
                <boxGeometry args={[W, s * 0.1, s * 0.025]} />
                <meshPhongMaterial color="#33691E" />
            </mesh>

            {/* Grass tufts */}
            {tufts.map((t, i) => (
                <mesh key={i} position={[t.x, t.y, s * 0.078]}>
                    <boxGeometry args={[s * 0.07, s * 0.07, s * 0.06]} />
                    <meshPhongMaterial color={t.color} />
                </mesh>
            ))}
        </>
    );
}

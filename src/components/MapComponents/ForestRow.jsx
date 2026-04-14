export default function ForestRow({rowIndex, trees, metadata, obstaclesRef}) {
    const TILE_SIZE = metadata.tileSize;
    const TILE_HEIGHT = metadata.tilesHeight;
    const TILE_PER_ROW = metadata.tilesPerRow;
    const Y = rowIndex * TILE_SIZE;

    return (
        <group position={[0, Y, 0]}>
            {/* Nền cỏ */}
            <mesh>
                <boxGeometry
                    args={[TILE_SIZE * TILE_PER_ROW, TILE_SIZE, TILE_HEIGHT]}
                />
                <meshPhongMaterial color="#5a8a30" />
            </mesh>

            {trees.map((tree, i) => (
                <Tree
                    key={i}
                    x={tree.x * TILE_SIZE}
                    color={tree.color}
                    TILE_SIZE={TILE_SIZE}
                    TILE_HEIGHT={TILE_HEIGHT}
                    rowIndex={rowIndex}
                    obstaclesRef={obstaclesRef}
                    obstacleId={`tree-${rowIndex}-${i}`}
                />
            ))}
        </group>
    );
}

function Tree({
    x,
    color,
    TILE_SIZE,
    TILE_HEIGHT,
    rowIndex,
    obstaclesRef,
    obstacleId,
}) {
    useLayoutEffect(() => {
        const entry = {
            id: obstacleId,
            type: "tree",
            rowIndex: rowIndex,
            x: x,
        };

        obstaclesRef.current.push(entry);

        return () => {
            if (obstaclesRef && obstaclesRef.current) {
                obstaclesRef.current = obstaclesRef.current.filter(
                    (o) => o.id !== id,
                );
            }
        };
    }, []);

    const s = TILE_SIZE;
    return (
        <group position={[x, 0, TILE_HEIGHT / 2]}>
            {/* Thân */}
            <mesh position={[0, 0, s * 0.25]}>
                <boxGeometry args={[s * 0.25, s * 0.25, s * 0.5]} />
                <meshPhongMaterial color="#8B5E3C" />
            </mesh>
            {/* Tán lá tầng 1 */}
            <mesh position={[0, 0, s * 0.7]}>
                <boxGeometry args={[s * 0.7, s * 0.7, s * 0.5]} />
                <meshPhongMaterial color={color} />
            </mesh>
            {/* Tán lá tầng 2 */}
            <mesh position={[0, 0, s * 1.05]}>
                <boxGeometry args={[s * 0.5, s * 0.5, s * 0.4]} />
                <meshPhongMaterial color={color} />
            </mesh>
        </group>
    );
}

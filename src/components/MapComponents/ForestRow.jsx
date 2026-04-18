import {useLayoutEffect} from "react";
import TreeModel from "../../model/TreeModel";
import ForestModel from "../../model/ForestModel";

const GROUND_OFFSET = 20;

export default function ForestRow({rowIndex, trees, metadata, obstaclesRef}) {
    const TILE_SIZE = metadata.tileSize;
    const TILE_HEIGHT = metadata.tilesHeight;
    const TILE_PER_ROW = metadata.tilesPerRow;
    const Y = rowIndex * TILE_SIZE;

    return (
        <group position={[0, Y, 0]}>
            {/* Nền cỏ */}
            <ForestModel
                s={TILE_SIZE}
                W={TILE_SIZE * TILE_PER_ROW}
                rowIndex={rowIndex}
            />

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
        <group position={[x, 0, TILE_HEIGHT]}>
            <TreeModel s={s} color={color} />
        </group>
    );
}

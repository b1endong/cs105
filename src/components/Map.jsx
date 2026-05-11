import ForestRow from "./MapComponents/ForestRow";
import RoadRow from "./MapComponents/RoadRow";
import RiverRow from "./MapComponents/RiverRow";
import TrainRow from "./MapComponents/TrainRow";
import {tilesPerRow, tileSize, tilesHeight} from "../metadata/constants";

export default function Map({obstaclesRef, rows, activeEffect}) {
    const metadata = {tilesPerRow, tileSize, tilesHeight};
    const speedMultiplier = activeEffect?.type === 'fastForward' ? 2 : 1;

    return (
        <group position={[-50, -250, 0]}>
            {rows.map((row) => {
                switch (row.type) {
                    case "forest":
                        return (
                            <ForestRow
                                key={row.rowIndex}
                                rowIndex={row.rowIndex}
                                trees={row.trees}
                                metadata={metadata}
                                obstaclesRef={obstaclesRef}
                            />
                        );
                    case "car":
                        return (
                            <RoadRow
                                key={row.rowIndex}
                                rowIndex={row.rowIndex}
                                speed={row.speed * speedMultiplier}
                                cars={row.cars}
                                items={row.items}
                                metadata={metadata}
                                obstaclesRef={obstaclesRef}
                            />
                        );
                    case "river":
                        return (
                            <RiverRow
                                key={row.rowIndex}
                                rowIndex={row.rowIndex}
                                speed={row.speed * speedMultiplier}
                                logs={row.logs}
                                metadata={metadata}
                                obstaclesRef={obstaclesRef}
                            />
                        );
                    case "train":
                        return (
                            <TrainRow
                                key={row.rowIndex}
                                rowIndex={row.rowIndex}
                                metadata={metadata}
                                obstaclesRef={obstaclesRef}
                            />
                        );
                }
            })}
        </group>
    );
}

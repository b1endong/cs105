import ForestRow from "./MapComponents/ForestRow";
import RoadRow from "./MapComponents/RoadRow";
import RiverRow from "./MapComponents/RiverRow";
import {tilesPerRow, tileSize, tilesHeight} from "../metadata/constants";

export default function Map({obstaclesRef, rows}) {
    const metadata = {tilesPerRow, tileSize, tilesHeight};

    return (
        <group position={[0, 0, 0]}>
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
                                speed={row.speed}
                                cars={row.cars}
                                metadata={metadata}
                                obstaclesRef={obstaclesRef}
                            />
                        );
                    case "river":
                        return (
                            <RiverRow
                                key={row.rowIndex}
                                rowIndex={row.rowIndex}
                                speed={row.speed}
                                logs={row.logs}
                                metadata={metadata}
                                obstaclesRef={obstaclesRef}
                            />
                        );
                }
            })}
        </group>
    );
}

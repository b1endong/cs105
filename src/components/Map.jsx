import ForestRow from "./MapComponents/ForestRow";
import RoadRow from "./MapComponents/RoadRow";
import RiverRow from "./MapComponents/RiverRow";
import {tilesPerRow, tileSize, tilesHeight} from "../metadata/constants";
import mapData from "../metadata/mapData.json";

export default function Map({obstaclesRef}) {
    const metadata = {tilesPerRow, tileSize, tilesHeight};

    // Row 0→192, trung tâm ≈ z=96 → dịch ngược -96 để map vào giữa màn hình

    return (
        <group position={[0, 0, 0]}>
            {mapData.map((row, index) => {
                switch (row.type) {
                    case "forest":
                        return (
                            <ForestRow
                                key={index}
                                rowIndex={index}
                                trees={row.trees}
                                metadata={metadata}
                                obstaclesRef={obstaclesRef}
                            />
                        );
                    case "road":
                        return (
                            <RoadRow
                                key={index}
                                rowIndex={index}
                                speed={row.speed}
                                cars={row.cars}
                                metadata={metadata}
                                obstaclesRef={obstaclesRef}
                            />
                        );
                    case "river":
                        return (
                            <RiverRow
                                key={index}
                                rowIndex={index}
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

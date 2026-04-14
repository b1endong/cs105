import ForestRow from "./MapComponents/ForestRow";
import RoadRow from "./MapComponents/RoadRow";
import RiverRow from "./MapComponents/RiverRow";
import {tilesPerRow, tileSize, tilesHeight} from "../metadata/constants";

export default function Map({obstaclesRef}) {
    const metadata = {tilesPerRow, tileSize, tilesHeight};

    // Row 0→192, trung tâm ≈ z=96 → dịch ngược -96 để map vào giữa màn hình

    return (
        <group position={[0, 0, 0]}>
            <ForestRow
                rowIndex={0}
                trees={[
                    {x: -3, color: "#2E8B57"},
                    {x: 2, color: "#3CB371"},
                ]}
                metadata={metadata}
                obstaclesRef={obstaclesRef}
            />

            <RoadRow
                rowIndex={1}
                speed={2}
                cars={[
                    {initialX: -5, color: "#d9534f"},
                    {initialX: 1, color: "#f0ad4e"},
                ]}
                metadata={metadata}
                obstaclesRef={obstaclesRef}
            />

            <ForestRow
                rowIndex={2}
                trees={[
                    {x: -5, color: "#2E8B57"},
                    {x: 4, color: "#3CB371"},
                ]}
                metadata={metadata}
                obstaclesRef={obstaclesRef}
            />

            <RoadRow
                rowIndex={3}
                speed={-2.5}
                cars={[
                    {initialX: -2, color: "#5bc0de"},
                    {initialX: 5, color: "#5cb85c"},
                ]}
                metadata={metadata}
                obstaclesRef={obstaclesRef}
            />

            <ForestRow
                rowIndex={4}
                trees={[
                    {x: -7, color: "#2E8B57"},
                    {x: 3, color: "#3CB371"},
                ]}
                metadata={metadata}
                obstaclesRef={obstaclesRef}
            />

            <RiverRow
                rowIndex={5}
                speed={1.5}
                logs={[
                    {initialX: -4, length: 2},
                    {initialX: 3, length: 3},
                ]}
                metadata={metadata}
                obstaclesRef={obstaclesRef}
            />
        </group>
    );
}

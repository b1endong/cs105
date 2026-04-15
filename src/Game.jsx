import {useRef} from "react";
import Scene from "./components/Scene.jsx";
import Player from "./components/Player.jsx";
import Map from "./components/Map.jsx";
import mapData from "./metadata/mapData.json";

export default function Game() {
    const playerPosRef = useRef({x: 0, rowIndex: 0});
    const obstaclesRef = useRef([]);

    const riverRowIndices = mapData
        .map((row, index) => (row.type === "river" ? index : -1))
        .filter((index) => index !== -1);

    const riverRowsSet = new Set(riverRowIndices);

    return (
        <Scene playerPosRef={playerPosRef}>
            <Map obstaclesRef={obstaclesRef} />
            <Player
                playerPosRef={playerPosRef}
                obstaclesRef={obstaclesRef}
                riverRowSet={riverRowsSet}
            />
        </Scene>
    );
}

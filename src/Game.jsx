import {useRef, useMemo} from "react";
import Scene from "./components/Scene.jsx";
import Player from "./components/Player.jsx";
import Map from "./components/Map.jsx";
import {useMap} from "./ultis/useMap.js";

export default function Game() {
    const playerPosRef = useRef({x: 0, rowIndex: 0, rotateAngle: 0});
    const obstaclesRef = useRef([]);
    const {rows, addRow} = useMap();

    const riverRowsSet = useMemo(
        () =>
            new Set(
                rows.filter((r) => r.type === "river").map((r) => r.rowIndex),
            ),
        [rows],
    );

    return (
        <Scene playerPosRef={playerPosRef}>
            <Map obstaclesRef={obstaclesRef} rows={rows} />
            <Player
                playerPosRef={playerPosRef}
                obstaclesRef={obstaclesRef}
                riverRowSet={riverRowsSet}
                addRow={addRow}
            />
        </Scene>
    );
}

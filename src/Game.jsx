import {useRef} from "react";
import Scene from "./components/Scene.jsx";
import Player from "./components/Player.jsx";
import Map from "./components/Map.jsx";

export default function Game() {
    const playerPosRef = useRef({x: 0, rowIndex: 0});
    const obstaclesRef = useRef([]);

    return (
        <Scene playerPosRef={playerPosRef}>
            <Map obstaclesRef={obstaclesRef} />
            <Player playerPosRef={playerPosRef} obstaclesRef={obstaclesRef} />
        </Scene>
    );
}

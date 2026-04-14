import {useRef} from "react";
import Scene from "./components/Scene.jsx";
import Player from "./components/Player.jsx";
import Map from "./components/Map.jsx";

export default function Game() {
    const playerPosRef = useRef({x: 0, rowIndex: 0});

    return (
        <Scene playerPosRef={playerPosRef}>
            <Map />
            <Player playerPosRef={playerPosRef} />
        </Scene>
    );
}

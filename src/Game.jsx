import Scene from "./components/Scene.jsx";
import Player from "./components/Player.jsx";
import Map from "./components/Map.jsx";

export default function Game() {
    return (
        <Scene>
            <Map />
            <Player />
        </Scene>
    );
}

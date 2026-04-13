import {tileSize, tilesHeight} from "../metadata/constants.js";

export default function Player() {
    const s = tileSize;
    return (
        <mesh position={[0, 0, tilesHeight / 2 + s * 0.45]}>
            <boxGeometry args={[s * 0.6, s * 0.6, s * 0.9]} />
            <meshPhongMaterial color={0xfffff8} />
        </mesh>
    );
}

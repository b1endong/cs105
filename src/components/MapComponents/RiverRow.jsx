import {useRef} from "react";
import {useFrame} from "@react-three/fiber";

export default function RiverRow({rowIndex, speed, logs, metadata}) {
    const TILE_SIZE = metadata.tileSize;
    const TILE_HEIGHT = metadata.tilesHeight;
    const TILE_PER_ROW = metadata.tilesPerRow;

    const Y = rowIndex * TILE_SIZE; // ← đổi từ Z sang Y

    return (
        <group position={[0, Y, 0]}>
            <mesh>
                <boxGeometry
                    args={[TILE_SIZE * TILE_PER_ROW, TILE_SIZE, TILE_HEIGHT]}
                />
                <meshPhongMaterial color="#1a6b9a" />
            </mesh>
            {logs.map((log, i) => (
                <Log
                    key={i}
                    initialX={log.initialX * TILE_SIZE}
                    length={log.length}
                    speed={speed}
                    TILE_SIZE={TILE_SIZE}
                    TILE_HEIGHT={TILE_HEIGHT}
                    TILE_PER_ROW={TILE_PER_ROW}
                />
            ))}
        </group>
    );
}

function Log({initialX, length, speed, TILE_SIZE, TILE_HEIGHT, TILE_PER_ROW}) {
    const ref = useRef();
    const BOUNDARY = (TILE_SIZE * TILE_PER_ROW) / 2 + TILE_SIZE;
    const s = TILE_SIZE;

    useFrame((_, delta) => {
        ref.current.position.x += speed * s * delta;
        if (speed > 0 && ref.current.position.x > BOUNDARY)
            ref.current.position.x = -BOUNDARY;
        if (speed < 0 && ref.current.position.x < -BOUNDARY)
            ref.current.position.x = BOUNDARY;
    });

    return (
        <group ref={ref} position={[initialX, 0, TILE_HEIGHT / 2]}>
            <mesh>
                <boxGeometry args={[s * length, s * 0.6, s * 0.25]} />
                <meshPhongMaterial color="#8B5E3C" />
            </mesh>
        </group>
    );
}

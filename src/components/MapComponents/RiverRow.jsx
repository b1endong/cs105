import {useRef, useLayoutEffect} from "react";
import {useFrame} from "@react-three/fiber";

export default function RiverRow({
    rowIndex,
    speed,
    logs,
    metadata,
    obstaclesRef,
}) {
    const TILE_SIZE = metadata.tileSize;
    const TILE_HEIGHT = metadata.tilesHeight;
    const TILE_PER_ROW = metadata.tilesPerRow;

    const Y = rowIndex * TILE_SIZE;

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
                    rowIndex={rowIndex}
                    obstaclesRef={obstaclesRef}
                    obstacleId={`log-${rowIndex}-${i}`}
                />
            ))}
        </group>
    );
}

function Log({
    initialX,
    length,
    speed,
    TILE_SIZE,
    TILE_HEIGHT,
    TILE_PER_ROW,
    rowIndex,
    obstaclesRef,
    obstacleId,
}) {
    const ref = useRef();
    const BOUNDARY = (TILE_SIZE * TILE_PER_ROW) / 2 + TILE_SIZE;
    const s = TILE_SIZE;

    useLayoutEffect(() => {
        const entry = {
            id: obstacleId,
            type: "log",
            rowIndex,
            x: initialX,
            width: s * length,
            depth: s * 0.6,
            velocityX: 0,
        };
        obstaclesRef.current = [...obstaclesRef.current, entry];
        return () => {
            obstaclesRef.current = obstaclesRef.current.filter(
                (o) => o.id !== obstacleId,
            );
        };
    }, []);

    useFrame((_, delta) => {
        const dx = speed * s * delta;
        ref.current.position.x += dx;

        if (speed > 0 && ref.current.position.x > BOUNDARY)
            ref.current.position.x = -BOUNDARY;
        if (speed < 0 && ref.current.position.x < -BOUNDARY)
            ref.current.position.x = BOUNDARY;

        const entry = obstaclesRef.current.find((o) => o.id === obstacleId);
        if (entry) {
            entry.x = ref.current.position.x;
            entry.velocityX = dx;
        }
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

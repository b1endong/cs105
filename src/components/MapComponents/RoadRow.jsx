import {useRef, useLayoutEffect} from "react";
import {useFrame} from "@react-three/fiber";
import CarModel from "../../model/CarModel";

export default function RoadRow({
    rowIndex,
    speed,
    cars,
    metadata,
    obstaclesRef,
}) {
    const TILE_SIZE = metadata.tileSize;
    const TILE_HEIGHT = metadata.tilesHeight;
    const TILE_PER_ROW = metadata.tilesPerRow;

    const Y = rowIndex * TILE_SIZE;

    const stripeSpacing = 3; // Khoảng cách giữa các vạch kẻ đường
    const stripes = [];
    for (
        let i = -(TILE_PER_ROW - 1) / 2;
        i < TILE_PER_ROW / 2 + 1;
        i += stripeSpacing
    ) {
        stripes.push(i);
    }

    return (
        <group position={[0, Y, 0]}>
            {/* Mặt đường */}
            <mesh>
                <boxGeometry
                    args={[TILE_SIZE * TILE_PER_ROW, TILE_SIZE, TILE_HEIGHT]}
                />
                <meshPhongMaterial color="#3a3a3a" />
            </mesh>
            {/* Vạch kẻ đường */}
            {stripes.map((i) => (
                <mesh
                    key={i}
                    position={[i * TILE_SIZE, 0, TILE_HEIGHT / 2 + 1]}
                >
                    <boxGeometry args={[TILE_SIZE * 0.5, TILE_SIZE * 0.1, 2]} />
                    <meshPhongMaterial color="#f5f5a0" />
                </mesh>
            ))}

            {cars.map((car, i) => (
                <Car
                    key={i}
                    initialX={car.initialX * TILE_SIZE}
                    speed={speed}
                    color={car.color}
                    TILE_SIZE={TILE_SIZE}
                    TILE_HEIGHT={TILE_HEIGHT}
                    TILE_PER_ROW={TILE_PER_ROW}
                    rowIndex={rowIndex}
                    obstaclesRef={obstaclesRef}
                    obstacleId={`car-${rowIndex}-${i}`}
                />
            ))}
        </group>
    );
}

function Car({
    initialX,
    speed,
    color,
    TILE_SIZE,
    TILE_HEIGHT,
    TILE_PER_ROW,
    rowIndex,
    obstaclesRef,
    obstacleId,
}) {
    const ref = useRef();
    const BOUNDARY = (TILE_SIZE * TILE_PER_ROW) / 2 + TILE_SIZE; // Giới hạn để reset vị trí xe
    const s = TILE_SIZE;
    let carRotation = 0;
    if (speed > 0) carRotation = Math.PI; // Xe đi từ trái sang phải

    useLayoutEffect(() => {
        const entry = {
            id: obstacleId,
            type: "car",
            rowIndex,
            x: initialX,
            width: s * 1.4,
            depth: s * 0.6,
        };
        obstaclesRef.current = [...obstaclesRef.current, entry];
        return () => {
            obstaclesRef.current = obstaclesRef.current.filter(
                (o) => o.id !== obstacleId,
            );
        };
    }, []);

    useFrame((_, delta) => {
        ref.current.position.x += speed * s * delta;
        if (speed > 0 && ref.current.position.x > BOUNDARY)
            ref.current.position.x = -BOUNDARY;
        if (speed < 0 && ref.current.position.x < -BOUNDARY)
            ref.current.position.x = BOUNDARY;

        // Cập nhật vị trí xe trong obstaclesRef mỗi frame
        const entry = obstaclesRef.current.find((o) => o.id === obstacleId);
        if (entry) entry.x = ref.current.position.x;
    });

    return (
        <group
            ref={ref}
            position={[initialX, 0, TILE_HEIGHT / 2]}
            rotation={[0, 0, carRotation]}
        >
            <CarModel s={s} color={color} />
        </group>
    );
}

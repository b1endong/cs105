import {useRef} from "react";
import {useFrame} from "@react-three/fiber";

export default function RoadRow({rowIndex, speed, cars, metadata}) {
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
                />
            ))}
        </group>
    );
}

function Car({initialX, speed, color, TILE_SIZE, TILE_HEIGHT}) {
    const ref = useRef();
    const BOUNDARY = TILE_SIZE * 6;
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
            {/* Thân xe */}
            <mesh position={[0, 0, s * 0.2]}>
                <boxGeometry args={[s * 1.4, s * 0.6, s * 0.35]} />
                <meshPhongMaterial color={color} />
            </mesh>
            {/* Mui xe */}
            <mesh position={[0, 0, s * 0.48]}>
                <boxGeometry args={[s * 0.8, s * 0.55, s * 0.28]} />
                <meshPhongMaterial color={color} />
            </mesh>
        </group>
    );
}

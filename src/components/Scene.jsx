import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {
    tileSize,
    CAMERA_START_ROW,
    BASE_CAMERA_Y,
} from "../metadata/constants.js";

function CameraFollow({playerPosRef}) {
    const {camera} = useThree();

    useFrame(() => {
        const playerRow = playerPosRef.current.rowIndex;
        const scrolledRows = Math.max(0, playerRow - CAMERA_START_ROW);
        const targetY = BASE_CAMERA_Y + scrolledRows * tileSize;
        camera.position.y += (targetY - camera.position.y) * 0.1;
    });

    return null;
}

export default function Scene({children, playerPosRef}) {
    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                top: 0,
                left: 0,
                overflow: "hidden",
            }}
        >
            <Canvas
                orthographic={true}
                camera={{
                    up: [0, 0, 1],
                    position: [300, BASE_CAMERA_Y, 300],
                    far: 5000,
                    
                }}
                style={{width: "100%", height: "100%"}}
            >
                <CameraFollow playerPosRef={playerPosRef} />
                <ambientLight />
                <directionalLight position={[-200, -200, 300]} />
                {children}
            </Canvas>
        </div>
    );
}

import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {
    tileSize,
    CAMERA_START_ROW,
    BASE_CAMERA_Y,
} from "../metadata/constants.js";
import {OrbitControls} from "@react-three/drei";
import DayNightCycle from "../components/DayNightCycle.jsx";

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
                    near: -5000,
                    far: 7000,
                }}
                style={{width: "100%", height: "100%"}}
            >
                {/* <CameraFollow playerPosRef={playerPosRef} /> */}
                <OrbitControls makeDefault={true} />
                <DayNightCycle startTime={0.35} />
                {children}
            </Canvas>
        </div>
    );
}

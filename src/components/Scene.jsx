import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {OrbitControls} from "@react-three/drei";
import {tileSize, tilesPerRow} from "../metadata/constants.js";

function CameraFollow({playerPosRef}) {
    const {camera} = useThree();

    useFrame(() => {
        // Camera Y = -300 (offset gốc) + số row player đã đi
        // rowIndex=0 → targetY=-300 (không đổi)
        // rowIndex=1 → targetY=-236 (camera đi lên 64 units)
        const targetY = playerPosRef.current.rowIndex * tileSize;

        // Lerp mượt để camera không giật
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
                    position: [300, -300, 300],
                    far: 5000,
                }}
            >
                <CameraFollow playerPosRef={playerPosRef} />
                {/* <OrbitControls makeDefault /> */}
                <axesHelper args={[500]} />
                <ambientLight />
                <directionalLight position={[-100, -100, 200]} />
                {children}
            </Canvas>
        </div>
    );
}

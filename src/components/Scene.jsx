import {Canvas} from "@react-three/fiber";

export default function Scene({children}) {
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
                <ambientLight />
                <directionalLight position={[-100, -100, 200]} />
                {children}
            </Canvas>
        </div>
    );
}

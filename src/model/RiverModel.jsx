import {useRef} from "react";
import {useFrame} from "@react-three/fiber";

export default function RiverModel({s, W}) {
    const waveRef1 = useRef();
    const waveRef2 = useRef();
    const waveRef3 = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        // Cập nhật opacity trực tiếp vào material
        if (waveRef1.current) {
            waveRef1.current.opacity = 0.25 + Math.sin(t * 1.8) * 0.1;
        }
        if (waveRef2.current) {
            waveRef2.current.opacity = 0.2 + Math.sin(t * 2.2 + 1.2) * 0.08;
        }
        if (waveRef3.current) {
            waveRef3.current.opacity = 0.18 + Math.sin(t * 1.5 + 2.4) * 0.07;
        }
    });

    return (
        <>
            {/* Deep water base */}
            <mesh>
                <boxGeometry args={[W, s, s * 0.125]} />
                <meshPhongMaterial color="#1565C0" />
            </mesh>

            {/* Surface */}
            <mesh position={[0, 0, s * 0.065]}>
                <boxGeometry args={[W, s * 0.88, s * 0.012]} />
                <meshPhongMaterial color="#1976D2" />
            </mesh>

            {/* Static wave highlights */}
            {[-s * 0.28, -s * 0.06, s * 0.16].map((yOff, i) => (
                <mesh key={i} position={[0, yOff, s * 0.075]}>
                    <boxGeometry args={[W * 0.85, s * 0.05, s * 0.015]} />
                    <meshPhongMaterial
                        color="#42A5F5"
                        transparent={true} // Sửa thành true rõ ràng
                        opacity={0.3}
                    />
                </mesh>
            ))}

            {/* Animated shimmer */}
            {/* Đặt ref trực tiếp vào meshPhongMaterial thay vì mesh */}
            <mesh position={[0, -s * 0.15, s * 0.078]}>
                <boxGeometry args={[W * 0.6, s * 0.04, s * 0.01]} />
                <meshPhongMaterial
                    ref={waveRef1}
                    color="#90CAF9"
                    transparent={true}
                    opacity={0.25}
                />
            </mesh>

            <mesh position={[s * 0.8, s * 0.1, s * 0.078]}>
                <boxGeometry args={[W * 0.3, s * 0.03, s * 0.01]} />
                <meshPhongMaterial
                    ref={waveRef2}
                    color="#BBDEFB"
                    transparent={true}
                    opacity={0.2}
                />
            </mesh>

            <mesh position={[-s * 1.0, s * 0.22, s * 0.078]}>
                <boxGeometry args={[W * 0.4, s * 0.03, s * 0.01]} />
                <meshPhongMaterial
                    ref={waveRef3}
                    color="#BBDEFB"
                    transparent={true}
                    opacity={0.18}
                />
            </mesh>
        </>
    );
}

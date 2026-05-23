import {useRef} from "react";
import {useFrame} from "@react-three/fiber";

// isWarningRef — React ref (useRef) từ TrainRow truyền xuống
export default function TrainSignModel({s, isWarningRef}) {
    const lightL = useRef();
    const lightR = useRef();

    useFrame(() => {
        if (!lightL.current || !lightR.current) return;
        if (isWarningRef.current) {
            const t = performance.now() / 1000;
            const blink = Math.sin(t * 8) > 0;
            // Tăng intensity để dễ nhìn hơn ban đêm
            lightL.current.material.emissiveIntensity = blink ? 5.0 : 0.05;
            lightR.current.material.emissiveIntensity = blink ? 0.05 : 5.0;
        } else {
            lightL.current.material.emissiveIntensity = 0.05;
            lightR.current.material.emissiveIntensity = 0.05;
        }
    });

    return (
        <group>
            {/* Cột */}
            <mesh position={[0, 0, s * 0.44]}>
                <boxGeometry args={[s * 0.09, s * 0.09, s * 0.88]} />
                <meshPhongMaterial color="#424242" />
            </mesh>
            {/* Hộp đèn */}
            <mesh position={[0, 0, s * 0.94]}>
                <boxGeometry args={[s * 0.36, s * 0.16, s * 0.26]} />
                <meshPhongMaterial color="#212121" />
            </mesh>
            {/* Đèn trái */}
            <mesh ref={lightL} position={[-s * 0.1, -s * 0.09, s * 0.94]}>
                <boxGeometry args={[s * 0.14, s * 0.04, s * 0.14]} />
                <meshPhongMaterial
                    color="#FF1744"
                    emissive="#FF1744"
                    emissiveIntensity={0.05}
                />
            </mesh>
            {/* Đèn phải */}
            <mesh ref={lightR} position={[s * 0.1, -s * 0.09, s * 0.94]}>
                <boxGeometry args={[s * 0.14, s * 0.04, s * 0.14]} />
                <meshPhongMaterial
                    color="#FF1744"
                    emissive="#FF1744"
                    emissiveIntensity={0.05}
                />
            </mesh>
            {/* Biển X */}
            <mesh
                position={[0, -s * 0.1, s * 0.66]}
                rotation={[0, Math.PI / 4, 0]}
            >
                <boxGeometry args={[s * 0.28, s * 0.04, s * 0.06]} />
                <meshPhongMaterial color="#FFFF00" />
            </mesh>
            <group
                position={[0, -s * 0.1, s * 0.66]}
                rotation={[0, -Math.PI / 4, 0]}
            >
                <mesh>
                    <boxGeometry args={[s * 0.05, s * 0.04, s * 0.3]} />
                    <meshPhongMaterial color="#FFFF00" />
                </mesh>
            </group>
            <group
                position={[0, -s * 0.1, s * 0.66]}
                rotation={[0, Math.PI / 4, 0]}
            >
                <mesh>
                    <boxGeometry args={[s * 0.05, s * 0.04, s * 0.3]} />
                    <meshPhongMaterial color="#FFFF00" />
                </mesh>
            </group>
        </group>
    );
}

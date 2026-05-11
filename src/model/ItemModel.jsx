import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ItemModel({ s, isBuff }) {
    const meshRef = useRef();

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 2;
            meshRef.current.rotation.z += delta;
        }
    });

    const color = "#9c27b0";
    const emissive = "#9c27b0";

    return (
        <mesh ref={meshRef} position={[0, 0, s * 0.3]}>
            <octahedronGeometry args={[s * 0.25, 0]} />
            <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.8} />
        </mesh>
    );
}

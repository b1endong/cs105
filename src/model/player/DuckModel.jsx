export default function DuckModel({s}) {
    const yellow = "#FDD835";
    const orange = "#FF8F00";
    const dark = "#212121";
    const white = "#FFFFFF";
    const blue = "#1565C0"; // mũ

    return (
        <>
            {/* Chân cam */}
            <mesh position={[-s * 0.12, s * 0.06, -s * 0.42]}>
                <boxGeometry args={[s * 0.1, s * 0.16, s * 0.1]} />
                <meshPhongMaterial color={orange} />
            </mesh>
            <mesh position={[-s * 0.16, -s * 0.04, -s * 0.48]}>
                <boxGeometry args={[s * 0.18, s * 0.08, s * 0.06]} />
                <meshPhongMaterial color={orange} />
            </mesh>
            <mesh position={[s * 0.12, s * 0.06, -s * 0.42]}>
                <boxGeometry args={[s * 0.1, s * 0.16, s * 0.1]} />
                <meshPhongMaterial color={orange} />
            </mesh>
            <mesh position={[s * 0.16, -s * 0.04, -s * 0.48]}>
                <boxGeometry args={[s * 0.18, s * 0.08, s * 0.06]} />
                <meshPhongMaterial color={orange} />
            </mesh>

            {/* Thân tròn vàng */}
            <mesh position={[0, 0, -s * 0.04]}>
                <boxGeometry args={[s * 0.56, s * 0.48, s * 0.52]} />
                <meshPhongMaterial color={yellow} />
            </mesh>
            {/* Bụng sáng */}
            <mesh position={[0, -s * 0.1, -s * 0.06]}>
                <boxGeometry args={[s * 0.34, s * 0.28, s * 0.36]} />
                <meshPhongMaterial color="#FFF9C4" />
            </mesh>

            {/* Cánh trái */}
            <mesh position={[-s * 0.32, s * 0.06, -s * 0.04]}>
                <boxGeometry args={[s * 0.1, s * 0.36, s * 0.4]} />
                <meshPhongMaterial color="#F9A825" />
            </mesh>
            {/* Cánh phải */}
            <mesh position={[s * 0.32, s * 0.06, -s * 0.04]}>
                <boxGeometry args={[s * 0.1, s * 0.36, s * 0.4]} />
                <meshPhongMaterial color="#F9A825" />
            </mesh>

            {/* Đuôi ngắn */}
            <mesh position={[0, s * 0.26, -s * 0.18]}>
                <boxGeometry args={[s * 0.2, s * 0.12, s * 0.2]} />
                <meshPhongMaterial color={yellow} />
            </mesh>

            {/* Đầu */}
            <mesh position={[0, -s * 0.02, s * 0.26]}>
                <boxGeometry args={[s * 0.44, s * 0.4, s * 0.38]} />
                <meshPhongMaterial color={yellow} />
            </mesh>

            {/* Mỏ vịt phẳng */}
            <mesh position={[0, -s * 0.25, s * 0.22]}>
                <boxGeometry args={[s * 0.24, s * 0.14, s * 0.08]} />
                <meshPhongMaterial color={orange} />
            </mesh>
            <mesh position={[0, -s * 0.3, s * 0.2]}>
                <boxGeometry args={[s * 0.2, s * 0.06, s * 0.06]} />
                <meshPhongMaterial color="#E65100" />
            </mesh>

            {/* Mắt */}
            <mesh position={[-s * 0.14, -s * 0.18, s * 0.36]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.1]} />
                <meshPhongMaterial color={dark} />
            </mesh>
            <mesh position={[-s * 0.11, -s * 0.19, s * 0.38]}>
                <boxGeometry args={[s * 0.04, s * 0.02, s * 0.04]} />
                <meshPhongMaterial color={white} />
            </mesh>
            <mesh position={[s * 0.14, -s * 0.18, s * 0.36]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.1]} />
                <meshPhongMaterial color={dark} />
            </mesh>
            <mesh position={[s * 0.11, -s * 0.19, s * 0.38]}>
                <boxGeometry args={[s * 0.04, s * 0.02, s * 0.04]} />
                <meshPhongMaterial color={white} />
            </mesh>

            {/* Mũ xanh vui nhộn */}
            <mesh position={[0, -s * 0.02, s * 0.48]}>
                <boxGeometry args={[s * 0.42, s * 0.42, s * 0.08]} />
                <meshPhongMaterial color={blue} />
            </mesh>
            <mesh position={[0, -s * 0.02, s * 0.58]}>
                <boxGeometry args={[s * 0.28, s * 0.28, s * 0.2]} />
                <meshPhongMaterial color={blue} />
            </mesh>
            {/* Dải mũ vàng */}
            <mesh position={[0, -s * 0.02, s * 0.5]}>
                <boxGeometry args={[s * 0.44, s * 0.44, s * 0.04]} />
                <meshPhongMaterial color={yellow} />
            </mesh>
        </>
    );
}

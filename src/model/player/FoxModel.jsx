export default function FoxModel({s}) {
    const orange = "#E65100";
    const white = "#FAFAFA";
    const dark = "#212121";
    const rust = "#BF360C";

    return (
        <>
            {/* Chân */}
            {[
                [-s * 0.16, -s * 0.14],
                [-s * 0.16, s * 0.14],
                [s * 0.16, -s * 0.14],
                [s * 0.16, s * 0.14],
            ].map(([x, y], i) => (
                <mesh key={i} position={[x, y, -s * 0.4]}>
                    <boxGeometry args={[s * 0.14, s * 0.14, s * 0.2]} />
                    <meshPhongMaterial color={i < 2 ? dark : dark} />
                </mesh>
            ))}

            {/* Thân */}
            <mesh position={[0, 0, -s * 0.06]}>
                <boxGeometry args={[s * 0.54, s * 0.44, s * 0.52]} />
                <meshPhongMaterial color={orange} />
            </mesh>
            {/* Bụng trắng */}
            <mesh position={[0, -s * 0.08, -s * 0.04]}>
                <boxGeometry args={[s * 0.3, s * 0.22, s * 0.4]} />
                <meshPhongMaterial color={white} />
            </mesh>

            {/* Đuôi lớn */}
            <mesh position={[0, s * 0.28, -s * 0.16]}>
                <boxGeometry args={[s * 0.28, s * 0.18, s * 0.42]} />
                <meshPhongMaterial color={orange} />
            </mesh>
            {/* Đầu đuôi trắng */}
            <mesh position={[0, s * 0.36, -s * 0.3]}>
                <boxGeometry args={[s * 0.2, s * 0.12, s * 0.16]} />
                <meshPhongMaterial color={white} />
            </mesh>

            {/* Tay */}
            <mesh position={[-s * 0.32, s * 0.04, -s * 0.06]}>
                <boxGeometry args={[s * 0.1, s * 0.3, s * 0.18]} />
                <meshPhongMaterial color={orange} />
            </mesh>
            <mesh position={[s * 0.32, s * 0.04, -s * 0.06]}>
                <boxGeometry args={[s * 0.1, s * 0.3, s * 0.18]} />
                <meshPhongMaterial color={orange} />
            </mesh>

            {/* Đầu */}
            <mesh position={[0, -s * 0.03, s * 0.26]}>
                <boxGeometry args={[s * 0.48, s * 0.42, s * 0.42]} />
                <meshPhongMaterial color={orange} />
            </mesh>
            {/* Má trắng */}
            <mesh position={[-s * 0.18, -s * 0.18, s * 0.24]}>
                <boxGeometry args={[s * 0.1, s * 0.06, s * 0.18]} />
                <meshPhongMaterial color={white} />
            </mesh>
            <mesh position={[s * 0.18, -s * 0.18, s * 0.24]}>
                <boxGeometry args={[s * 0.1, s * 0.06, s * 0.18]} />
                <meshPhongMaterial color={white} />
            </mesh>

            {/* Mõm nhọn */}
            <mesh position={[0, -s * 0.25, s * 0.2]}>
                <boxGeometry args={[s * 0.18, s * 0.12, s * 0.14]} />
                <meshPhongMaterial color={rust} />
            </mesh>
            {/* Mũi */}
            <mesh position={[0, -s * 0.29, s * 0.26]}>
                <boxGeometry args={[s * 0.08, s * 0.04, s * 0.06]} />
                <meshPhongMaterial color={dark} />
            </mesh>

            {/* Mắt */}
            <mesh position={[-s * 0.14, -s * 0.2, s * 0.36]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.1]} />
                <meshPhongMaterial color={dark} />
            </mesh>
            <mesh position={[-s * 0.11, -s * 0.21, s * 0.38]}>
                <boxGeometry args={[s * 0.04, s * 0.02, s * 0.04]} />
                <meshPhongMaterial color={white} />
            </mesh>
            <mesh position={[s * 0.14, -s * 0.2, s * 0.36]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.1]} />
                <meshPhongMaterial color={dark} />
            </mesh>
            <mesh position={[s * 0.11, -s * 0.21, s * 0.38]}>
                <boxGeometry args={[s * 0.04, s * 0.02, s * 0.04]} />
                <meshPhongMaterial color={white} />
            </mesh>

            {/* Tai nhọn trái */}
            <mesh position={[-s * 0.16, -s * 0.08, s * 0.5]}>
                <boxGeometry args={[s * 0.1, s * 0.1, s * 0.18]} />
                <meshPhongMaterial color={orange} />
            </mesh>
            <mesh position={[-s * 0.16, -s * 0.09, s * 0.54]}>
                <boxGeometry args={[s * 0.06, s * 0.06, s * 0.08]} />
                <meshPhongMaterial color={dark} />
            </mesh>
            {/* Tai nhọn phải */}
            <mesh position={[s * 0.16, -s * 0.08, s * 0.5]}>
                <boxGeometry args={[s * 0.1, s * 0.1, s * 0.18]} />
                <meshPhongMaterial color={orange} />
            </mesh>
            <mesh position={[s * 0.16, -s * 0.09, s * 0.54]}>
                <boxGeometry args={[s * 0.06, s * 0.06, s * 0.08]} />
                <meshPhongMaterial color={dark} />
            </mesh>
        </>
    );
}

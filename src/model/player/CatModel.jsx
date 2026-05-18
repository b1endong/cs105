export default function CatModel({s}) {
    const coat = "#FF8F00"; // cam vàng
    const stripe = "#E65100"; // vằn tối hơn
    const white = "#FAFAFA";
    const pink = "#F48FB1";
    const dark = "#212121";

    return (
        <>
            {/* Chân */}
            {[
                [-s * 0.16, -s * 0.14],
                [s * 0.16, -s * 0.14],
                [-s * 0.16, s * 0.14],
                [s * 0.16, s * 0.14],
            ].map(([x, y], i) => (
                <group key={i} position={[x, y, -s * 0.38]}>
                    <mesh>
                        <boxGeometry args={[s * 0.16, s * 0.16, s * 0.2]} />
                        <meshPhongMaterial color={coat} />
                    </mesh>
                    {/* Vằn trên chân */}
                    <mesh position={[0, 0, s * 0.02]}>
                        <boxGeometry args={[s * 0.17, s * 0.06, s * 0.06]} />
                        <meshPhongMaterial color={stripe} />
                    </mesh>
                    {/* Móng */}
                    <mesh position={[0, y > 0 ? s * 0.1 : -s * 0.1, -s * 0.08]}>
                        <boxGeometry args={[s * 0.18, s * 0.06, s * 0.06]} />
                        <meshPhongMaterial color={white} />
                    </mesh>
                </group>
            ))}

            {/* Thân */}
            <mesh position={[0, 0, -s * 0.04]}>
                <boxGeometry args={[s * 0.54, s * 0.46, s * 0.52]} />
                <meshPhongMaterial color={coat} />
            </mesh>
            {/* Vằn lưng */}
            {[-s * 0.1, s * 0.06, s * 0.2].map((y, i) => (
                <mesh key={i} position={[0, y, s * 0.22]}>
                    <boxGeometry args={[s * 0.52, s * 0.06, s * 0.04]} />
                    <meshPhongMaterial color={stripe} />
                </mesh>
            ))}
            {/* Bụng trắng */}
            <mesh position={[0, -s * 0.1, -s * 0.04]}>
                <boxGeometry args={[s * 0.3, s * 0.26, s * 0.38]} />
                <meshPhongMaterial color={white} />
            </mesh>

            {/* Đuôi dài cong */}
            <mesh position={[0, s * 0.26, -s * 0.1]}>
                <boxGeometry args={[s * 0.1, s * 0.12, s * 0.38]} />
                <meshPhongMaterial color={coat} />
            </mesh>
            <mesh position={[s * 0.12, s * 0.32, -s * 0.26]}>
                <boxGeometry args={[s * 0.18, s * 0.1, s * 0.1]} />
                <meshPhongMaterial color={coat} />
            </mesh>
            <mesh position={[s * 0.2, s * 0.32, -s * 0.3]}>
                <boxGeometry args={[s * 0.1, s * 0.12, s * 0.08]} />
                <meshPhongMaterial color={white} />
            </mesh>

            {/* Tay */}
            <mesh position={[-s * 0.32, s * 0.04, -s * 0.04]}>
                <boxGeometry args={[s * 0.1, s * 0.3, s * 0.18]} />
                <meshPhongMaterial color={coat} />
            </mesh>
            <mesh position={[s * 0.32, s * 0.04, -s * 0.04]}>
                <boxGeometry args={[s * 0.1, s * 0.3, s * 0.18]} />
                <meshPhongMaterial color={coat} />
            </mesh>

            {/* Đầu */}
            <mesh position={[0, -s * 0.03, s * 0.26]}>
                <boxGeometry args={[s * 0.5, s * 0.44, s * 0.44]} />
                <meshPhongMaterial color={coat} />
            </mesh>
            {/* Má trắng */}
            <mesh position={[-s * 0.18, -s * 0.18, s * 0.26]}>
                <boxGeometry args={[s * 0.12, s * 0.06, s * 0.2]} />
                <meshPhongMaterial color={white} />
            </mesh>
            <mesh position={[s * 0.18, -s * 0.18, s * 0.26]}>
                <boxGeometry args={[s * 0.12, s * 0.06, s * 0.2]} />
                <meshPhongMaterial color={white} />
            </mesh>
            {/* Mũi hồng */}
            <mesh position={[0, -s * 0.25, s * 0.3]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.06]} />
                <meshPhongMaterial color={pink} />
            </mesh>
            {/* Miệng */}
            <mesh position={[0, -s * 0.27, s * 0.24]}>
                <boxGeometry args={[s * 0.14, s * 0.04, s * 0.04]} />
                <meshPhongMaterial color={stripe} />
            </mesh>

            {/* Mắt xanh lá */}
            <mesh position={[-s * 0.14, -s * 0.19, s * 0.38]}>
                <boxGeometry args={[s * 0.12, s * 0.04, s * 0.12]} />
                <meshPhongMaterial color="#00C853" />
            </mesh>
            <mesh position={[-s * 0.14, -s * 0.2, s * 0.4]}>
                <boxGeometry args={[s * 0.06, s * 0.04, s * 0.08]} />
                <meshPhongMaterial color={dark} />
            </mesh>
            <mesh position={[-s * 0.11, -s * 0.21, s * 0.41]}>
                <boxGeometry args={[s * 0.03, s * 0.02, s * 0.03]} />
                <meshPhongMaterial color={white} />
            </mesh>
            <mesh position={[s * 0.14, -s * 0.19, s * 0.38]}>
                <boxGeometry args={[s * 0.12, s * 0.04, s * 0.12]} />
                <meshPhongMaterial color="#00C853" />
            </mesh>
            <mesh position={[s * 0.14, -s * 0.2, s * 0.4]}>
                <boxGeometry args={[s * 0.06, s * 0.04, s * 0.08]} />
                <meshPhongMaterial color={dark} />
            </mesh>
            <mesh position={[s * 0.11, -s * 0.21, s * 0.41]}>
                <boxGeometry args={[s * 0.03, s * 0.02, s * 0.03]} />
                <meshPhongMaterial color={white} />
            </mesh>

            {/* Tai nhọn trái */}
            <mesh position={[-s * 0.18, -s * 0.08, s * 0.52]}>
                <boxGeometry args={[s * 0.14, s * 0.12, s * 0.18]} />
                <meshPhongMaterial color={coat} />
            </mesh>
            <mesh position={[-s * 0.18, -s * 0.09, s * 0.56]}>
                <boxGeometry args={[s * 0.08, s * 0.07, s * 0.08]} />
                <meshPhongMaterial color={pink} />
            </mesh>
            {/* Tai nhọn phải */}
            <mesh position={[s * 0.18, -s * 0.08, s * 0.52]}>
                <boxGeometry args={[s * 0.14, s * 0.12, s * 0.18]} />
                <meshPhongMaterial color={coat} />
            </mesh>
            <mesh position={[s * 0.18, -s * 0.09, s * 0.56]}>
                <boxGeometry args={[s * 0.08, s * 0.07, s * 0.08]} />
                <meshPhongMaterial color={pink} />
            </mesh>
        </>
    );
}

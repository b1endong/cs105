export default function TrainModel({s, wagonCount = 4}) {
    const wagons = Array.from({length: wagonCount});

    return (
        <group>
            {/* ===== ĐẦU MÁY ===== */}
            <group position={[0, 0, 0]}>
                {/* Thân chính */}
                <mesh position={[0, 0, s * 0.36]}>
                    <boxGeometry args={[s * 1.6, s * 0.65, s * 0.72]} />
                    <meshPhongMaterial color="#B71C1C" />
                </mesh>
                {/* Mũi đầu máy vát */}
                <mesh position={[-s * 0.88, 0, s * 0.28]}>
                    <boxGeometry args={[s * 0.22, s * 0.58, s * 0.56]} />
                    <meshPhongMaterial color="#C62828" />
                </mesh>
                {/* Đèn pha trước */}
                <mesh position={[-s * 1.0, 0, s * 0.38]}>
                    <boxGeometry args={[s * 0.04, s * 0.18, s * 0.18]} />
                    <meshPhongMaterial
                        color="#FFF9C4"
                        emissive="#FFEE58"
                        emissiveIntensity={1.0}
                    />
                </mesh>
                {/* Đèn nhỏ phụ */}
                <mesh position={[-s * 1.0, -s * 0.22, s * 0.22]}>
                    <boxGeometry args={[s * 0.04, s * 0.1, s * 0.1]} />
                    <meshPhongMaterial
                        color="#FFF9C4"
                        emissive="#FFEE58"
                        emissiveIntensity={0.8}
                    />
                </mesh>
                <mesh position={[-s * 1.0, s * 0.22, s * 0.22]}>
                    <boxGeometry args={[s * 0.04, s * 0.1, s * 0.1]} />
                    <meshPhongMaterial
                        color="#FFF9C4"
                        emissive="#FFEE58"
                        emissiveIntensity={0.8}
                    />
                </mesh>
                {/* Cabin lái */}
                <mesh position={[s * 0.4, 0, s * 0.76]}>
                    <boxGeometry args={[s * 0.6, s * 0.58, s * 0.44]} />
                    <meshPhongMaterial color="#D32F2F" />
                </mesh>
                {/* Kính cabin */}
                <mesh position={[s * 0.12, 0, s * 0.86]}>
                    <boxGeometry args={[s * 0.06, s * 0.44, s * 0.26]} />
                    <meshPhongMaterial
                        color="#90CAF9"
                        transparent
                        opacity={0.8}
                    />
                </mesh>
                {/* Ống khói */}
                <mesh position={[-s * 0.3, 0, s * 0.92]}>
                    <boxGeometry args={[s * 0.18, s * 0.18, s * 0.32]} />
                    <meshPhongMaterial color="#212121" />
                </mesh>
                <mesh position={[-s * 0.3, 0, s * 1.1]}>
                    <boxGeometry args={[s * 0.24, s * 0.24, s * 0.1]} />
                    <meshPhongMaterial color="#212121" />
                </mesh>
                {/* Bệ dưới */}
                <mesh position={[0, 0, s * 0.1]}>
                    <boxGeometry args={[s * 1.7, s * 0.7, s * 0.18]} />
                    <meshPhongMaterial color="#212121" />
                </mesh>
                {/* Bánh xe đầu máy */}
                {[
                    [-s * 0.55, -s * 0.38],
                    [s * 0.2, -s * 0.38],
                    [-s * 0.55, s * 0.38],
                    [s * 0.2, s * 0.38],
                ].map(([x, y], i) => (
                    <group key={i} position={[x, y, s * 0.16]}>
                        <mesh>
                            <boxGeometry
                                args={[s * 0.28, s * 0.14, s * 0.32]}
                            />
                            <meshPhongMaterial color="#1A1A1A" />
                        </mesh>
                        <mesh position={[0, y > 0 ? s * 0.06 : -s * 0.06, 0]}>
                            <boxGeometry args={[s * 0.2, s * 0.04, s * 0.2]} />
                            <meshPhongMaterial color="#9E9E9E" />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* ===== TOA HÀNG ===== */}
            {wagons.map((_, wi) => {
                const xOff = s * 1.7 + wi * s * 1.5;
                const colors = ["#1565C0", "#2E7D32", "#E65100", "#4A148C"];
                const c = colors[wi % colors.length];
                return (
                    <group key={wi} position={[xOff, 0, 0]}>
                        {/* Thân toa */}
                        <mesh position={[0, 0, s * 0.38]}>
                            <boxGeometry args={[s * 1.4, s * 0.62, s * 0.64]} />
                            <meshPhongMaterial color={c} />
                        </mesh>
                        {/* Mái toa */}
                        <mesh position={[0, 0, s * 0.74]}>
                            <boxGeometry args={[s * 1.38, s * 0.6, s * 0.12]} />
                            <meshPhongMaterial color="#263238" />
                        </mesh>
                        {/* Cửa sổ */}
                        {[-s * 0.32, s * 0.32].map((xW, j) => (
                            <mesh key={j} position={[xW, -s * 0.32, s * 0.44]}>
                                <boxGeometry
                                    args={[s * 0.26, s * 0.04, s * 0.22]}
                                />
                                <meshPhongMaterial
                                    color="#B3E5FC"
                                    transparent
                                    opacity={0.75}
                                />
                            </mesh>
                        ))}
                        {/* Bệ dưới */}
                        <mesh position={[0, 0, s * 0.1]}>
                            <boxGeometry args={[s * 1.5, s * 0.66, s * 0.18]} />
                            <meshPhongMaterial color="#212121" />
                        </mesh>
                        {/* Kết nối toa */}
                        <mesh position={[-s * 0.76, 0, s * 0.28]}>
                            <boxGeometry
                                args={[s * 0.12, s * 0.12, s * 0.12]}
                            />
                            <meshPhongMaterial color="#616161" />
                        </mesh>
                        {/* Bánh xe toa */}
                        {[
                            [-s * 0.44, -s * 0.35],
                            [s * 0.44, -s * 0.35],
                            [-s * 0.44, s * 0.35],
                            [s * 0.44, s * 0.35],
                        ].map(([x, y], i) => (
                            <mesh key={i} position={[x, y, s * 0.18]}>
                                <boxGeometry
                                    args={[s * 0.22, s * 0.12, s * 0.26]}
                                />
                                <meshPhongMaterial color="#1A1A1A" />
                            </mesh>
                        ))}
                    </group>
                );
            })}
        </group>
    );
}

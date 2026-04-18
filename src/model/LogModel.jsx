export default function LogModel({s, length}) {
    // Thu nhỏ chiều dài lại một chút (0.95) để 2 khúc gỗ đi sát nhau không bị dính liền
    const logW = s * length * 0.95;
    const logD = s * 0.6;
    const logH = s * 0.3;
    const ringCount = Math.floor(length) + 1;

    return (
        <group>
            {/* 1. Thân gỗ chính (Màu nâu sẫm) */}
            <mesh position={[0, 0, logH / 2]}>
                <boxGeometry args={[logW, logD, logH]} />
                <meshPhongMaterial color="#5C4033" />
            </mesh>

            {/* 3. Các vòng vân gỗ (Bark rings) quấn quanh thân */}
            {Array.from({length: ringCount}, (_, i) => {
                const xPos = -logW / 2 + (logW / ringCount) * (i + 0.5);
                return (
                    <mesh key={i} position={[xPos, 0, logH / 2]}>
                        {/* To hơn thân gỗ 2% để bọc ra ngoài */}
                        <boxGeometry
                            args={[s * 0.05, logD * 1.04, logH * 1.04]}
                        />
                        <meshPhongMaterial color="#3E2723" />
                    </mesh>
                );
            })}

            {/* 4. Lõi gỗ ở 2 đầu (End caps) */}
            {/* Đầu bên trái */}
            <mesh position={[-logW / 2 - s * 0.01, 0, logH / 2]}>
                {/* Một lớp mỏng áp sát vào đầu */}
                <boxGeometry args={[s * 0.02, logD * 0.7, logH * 0.7]} />
                <meshPhongMaterial color="#A1887F" />
            </mesh>

            {/* Đầu bên phải */}
            <mesh position={[logW / 2 + s * 0.01, 0, logH / 2]}>
                <boxGeometry args={[s * 0.02, logD * 0.7, logH * 0.7]} />
                <meshPhongMaterial color="#A1887F" />
            </mesh>
        </group>
    );
}

import React, {useMemo} from "react";

export default function TreeModel({s, color}) {
    // Tạo một seed ngẫu nhiên dựa trên tọa độ để xác định hình dáng cây
    // Sử dụng useMemo để cây không bị đổi dáng mỗi khi re-render
    const {treeType, trunkHeight} = useMemo(() => {
        const seed = Math.floor(Math.random() * 10);
        let treeType;
        if (seed < 3) treeType = "tall_straight";
        else if (seed < 6) treeType = "branch_left";
        else treeType = "branch_right";
        const trunkHeight = s * (0.4 + Math.floor(Math.random() * 3) / 10);
        return {treeType, trunkHeight};
    }, []);

    return (
        <>
            {/* THÂN CÂY CHÍNH */}
            <mesh position={[0, 0, trunkHeight / 2]}>
                <boxGeometry args={[s * 0.25, s * 0.25, trunkHeight]} />
                <meshPhongMaterial color="#5D4037" />
            </mesh>

            {/* Rễ cây cho đẹp mắt */}
            <mesh position={[-s * 0.1, 0, s * 0.05]}>
                <boxGeometry args={[s * 0.35, s * 0.15, s * 0.1]} />
                <meshPhongMaterial color="#4E342E" />
            </mesh>

            {/* TÁN LÁ TẦNG 1 (Tán chính rộng nhất) */}
            <mesh position={[0, 0, trunkHeight + s * 0.25]}>
                <boxGeometry args={[s * 0.8, s * 0.8, s * 0.5]} />
                <meshPhongMaterial color={color} />
            </mesh>

            {/* TÁN LÁ TẦNG 2 (Tán nhỏ bên trên cho các cây thẳng) */}
            {treeType === "tall_straight" && (
                <mesh position={[0, 0, trunkHeight + s * 0.65]}>
                    <boxGeometry args={[s * 0.5, s * 0.5, s * 0.4]} />
                    <meshPhongMaterial color={color} />
                </mesh>
            )}

            {/* CÂY CÓ NHÁNH RẼ TRÁI */}
            {treeType === "branch_left" && (
                <>
                    {/* Cành cây chỉa sang trái */}
                    <mesh position={[-s * 0.3, 0, trunkHeight * 0.7]}>
                        {/* Xoay cành hơi xiên lên trên */}
                        <boxGeometry args={[s * 0.4, s * 0.15, s * 0.15]} />
                        <meshPhongMaterial color="#5D4037" />
                    </mesh>
                    {/* Tán lá trên cành */}
                    <mesh
                        position={[-s * 0.55, 0, trunkHeight * 0.7 + s * 0.15]}
                    >
                        <boxGeometry args={[s * 0.45, s * 0.45, s * 0.4]} />
                        <meshPhongMaterial color={color} />
                    </mesh>
                </>
            )}

            {/* CÂY CÓ NHÁNH RẼ PHẢI */}
            {treeType === "branch_right" && (
                <>
                    {/* Cành cây chỉa sang phải */}
                    <mesh position={[s * 0.3, 0, trunkHeight * 0.6]}>
                        <boxGeometry args={[s * 0.4, s * 0.15, s * 0.15]} />
                        <meshPhongMaterial color="#5D4037" />
                    </mesh>
                    {/* Tán lá trên cành */}
                    <mesh
                        position={[s * 0.55, 0, trunkHeight * 0.6 + s * 0.15]}
                    >
                        <boxGeometry args={[s * 0.45, s * 0.45, s * 0.4]} />
                        <meshPhongMaterial color={color} />
                    </mesh>
                </>
            )}
        </>
    );
}

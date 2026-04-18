// useMap.js
import {useState, useCallback} from "react";
import {generateRow} from "./generatedRow";

export function useMap(initialRows = 20) {
    const [rows, setRows] = useState(() =>
        Array.from({length: initialRows}, (_, i) =>
            generatedRow.generateRow(getRandomType(), i),
        ),
    );

    const addRows = useCallback((playerZ) => {
        setRows((prev) => {
            const maxZ = Math.max(...prev.map((r) => r.rowIndex));
            if (playerZ > maxZ - 10) {
                // Thêm 5 rows mới phía trước
                const newRows = Array.from({length: 5}, (_, i) =>
                    generatedRow.generateRow(getRandomType(), maxZ + i + 1),
                );
                // Xoá rows quá xa phía sau (tối ưu performance)
                const trimmed = prev.filter((r) => r.rowIndex > playerZ - 15);
                return [...trimmed, ...newRows];
            }
            return prev;
        });
    }, []);

    return {rows, addRows};
}

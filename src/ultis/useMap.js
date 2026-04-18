// useMap.js
import {useState, useCallback, useRef} from "react";
import {generateRow, generateMap, pickRowType} from "./generatedRow";

// Số rows luôn hiển thị — cửa sổ trượt cố định, không batch
const WINDOW_SIZE = 20;

export function useMap() {
    // Lưu trạng thái seed rule giữa các lần gọi addRow
    const consecutiveDangerousRef = useRef(0);

    const [rows, setRows] = useState(() => {
        const initial = generateMap(WINDOW_SIZE);
        // Khởi tạo consecutiveDangerous dựa theo đuôi của map ban đầu
        let count = 0;
        for (let i = initial.length - 1; i >= 0; i--) {
            if (initial[i].type !== "forest") count++;
            else break;
        }
        consecutiveDangerousRef.current = count;
        return initial;
    });

    // Gọi mỗi khi player tiến 1 bước về phía trước.
    // Thêm 1 row mới ở cuối + xóa 1 row cũ nhất ở đầu (sliding window).
    // Không có batch → không lag.
    const addRow = useCallback(() => {
        // Ref luôn là giá trị mới nhất, không bị stale closure
        setRows((prev) => {
            const maxRowIndex = prev[prev.length - 1].rowIndex;
            const type = pickRowType(consecutiveDangerousRef.current);
            consecutiveDangerousRef.current =
                type !== "forest" ? consecutiveDangerousRef.current + 1 : 0;
            const newRow = generateRow(type, maxRowIndex + 1);
            // Xóa row đầu tiên (cũ nhất), thêm row mới vào cuối
            return [...prev.slice(1), newRow];
        });
    }, []);

    return {rows, addRow};
}

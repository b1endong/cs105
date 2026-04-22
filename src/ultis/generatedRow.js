import {
    tilesPerRow,
    tileSize,
    tilesHeight,
    minTilesSize,
    maxTilesSize,
    ROW_TYPES,
    MAX_CONSECUTIVE_DANGEROUS,
} from "../metadata/constants";

function randomGreen() {
    const greens = ["#2E8B57", "#3CB371", "#228B22", "#006400", "#32CD32"];
    return greens[Math.floor(Math.random() * greens.length)];
}

function randomCarColor() {
    const colors = ["#d9534f", "#f0ad4e", "#5bc0de", "#5cb85c", "#428bca"];
    return colors[Math.floor(Math.random() * colors.length)];
}

export function generateRow(type, rowIndex) {
    if (type === "forest") {
        const trees = [];
        for (let i = minTilesSize; i <= maxTilesSize; i++) {
            // Bỏ qua ô x=0 ở row 0 (vị trí spawn của player)
            if (rowIndex === 0 && i === 0) continue;
            // Xác suất 0.35 → rừng thưa hơn, luôn có đường đi
            if (Math.random() < 0.35) {
                const color = randomGreen();
                trees.push({x: i, color});
            }
        }
        return {type, rowIndex, trees};
    }

    if (type === "car") {
        const speed = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 2 : -2);
        // 2-3 xe, vị trí ngẫu nhiên → một số xe tự nhiên bị trùng
        const carCount = Math.random() < 0.5 ? 2 : 3;
        const cars = Array.from({length: carCount}, () => ({
            initialX: Math.random() * 18 - 9,
            color: randomCarColor(),
        }));
        return {type, rowIndex, speed, cars};
    }

    if (type === "river") {
        const speed = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 2 : -2);
        const logs = Array.from({length: 3}, () => ({
            initialX: Math.random() * 20 - 10,
            length: Math.floor(Math.random() * 2) + 2,
        }));
        return {type, rowIndex, speed, logs};
    }

    if (type === "train") {
        return {type, rowIndex};
    }
}

// Picks a random row type, capping consecutive dangerous (non-forest) rows
export function pickRowType(consecutiveDangerous) {
    const available =
        consecutiveDangerous >= MAX_CONSECUTIVE_DANGEROUS
            ? ["forest"]
            : ROW_TYPES;
    return available[Math.floor(Math.random() * available.length)];
}

export function generateMap(rowCount = 20) {
    const rows = [];
    let consecutiveDangerous = 0;

    for (let i = 0; i < rowCount; i++) {
        const type = i === 0 ? "forest" : pickRowType(consecutiveDangerous);
        consecutiveDangerous = type !== "forest" ? consecutiveDangerous + 1 : 0;
        rows.push(generateRow(type, i));
    }
    return rows;
}

export default {generateMap, generateRow};

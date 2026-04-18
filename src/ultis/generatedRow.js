import {
    tilesPerRow,
    tileSize,
    tilesHeight,
    minTilesSize,
    maxTilesSize,
} from "../metadata/constants";
// {
//     type: "forest",
//     trees: [
//         {x: -3, color: "#2E8B57"},
//         {x: 2, color: "#3CB371"},
//         {x: 6, color: "#228B22"},
//     ],
// },
// {
//     type: "road",
//     speed: 2,
//     cars: [
//         {initialX: -5, color: "#d9534f"},
//         {initialX: 1, color: "#f0ad4e"},
//     ],
// },
// {
//     type: "river",
//     speed: 3,
//     logs: [
//         {initialX: -5, length: 2},
//         {initialX: 2, length: 3},
//     ],
// },

function randomGreen() {
    const greens = ["#2E8B57", "#3CB371", "#228B22", "#006400", "#32CD32"];
    return greens[Math.floor(Math.random() * greens.length)];
}

function randomCarColor() {
    const colors = ["#d9534f", "#f0ad4e", "#5bc0de", "#5cb85c", "#428bca"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function generatedRow(type, rowIndex) {
    if (type == "forest") {
        const trees = [];
        for (let i = minTilesSize; i <= maxTilesSize; i++) {
            if (Math.random() > 0.5) {
                const color = randomGreen();
                trees.push({x: i, color});
            }
        }
        return {type, rowIndex, trees};
    }

    if (type === "car") {
        const speed = (Math.random() * 2 + 1) * (Math.random() > 0.5 ? 1 : -1);
        const cars = Array.from({length: 3}, (_, i) => ({
            initialX: Math.random() * 20 - 10,
            color: randomCarColor(),
        }));
        return {type, rowIndex, speed, cars};
    }

    if (type === "river") {
        const speed =
            (Math.random() * 1.5 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
        const logs = Array.from({length: 3}, (_, i) => ({
            initialX: Math.random() * 20 - 10,
            length: Math.floor(Math.random() * 2) + 2,
        }));
        return {type, rowIndex, speed, logs};
    }
}

function generateMap(rowCount = 20) {
    const types = ["forest", "forest", "car", "car", "river"];
    return Array.from({length: rowCount}, (_, i) => {
        const type =
            i === 0
                ? "forest"
                : types[Math.floor(Math.random() * types.length)];
        return generateRow(type, i);
    });
}

export default {generateMap};

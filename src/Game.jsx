import {useRef, useMemo, useState, useCallback, useEffect} from "react";
import Scene from "./components/Scene.jsx";
import Player from "./components/Player.jsx";
import Map from "./components/Map.jsx";
import GameOver from "./components/GameOver.jsx";
import Score from "./components/Score.jsx";
import {useMap} from "./ultis/useMap.js";

export default function Game() {
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);

    const playerPosRef = useRef({x: 0, rowIndex: 0});
    const obstaclesRef = useRef([]);
    const minAllowedRowRef = useRef(0);

    const {rows, addRow} = useMap();

    // ✅ FIX: minAllowedRow = row nhỏ nhất thực sự còn tồn tại trong rows array
    // Cập nhật mỗi khi rows thay đổi (sau khi useMap xóa row cũ)
    useEffect(() => {
        if (rows.length === 0) return;
        const minExistingRow = Math.min(...rows.map((r) => r.rowIndex));
        minAllowedRowRef.current = minExistingRow;
    }, [rows]);

    const riverRowsSet = useMemo(
        () =>
            new Set(
                rows.filter((r) => r.type === "river").map((r) => r.rowIndex),
            ),
        [rows],
    );

    const handleDie = useCallback((finalScore) => {
        setScore(finalScore);
        setGameOver(true);
    }, []);

    const handleRestart = useCallback(() => {
        window.location.reload();
    }, []);

    return (
        <div style={{width: "100vw", height: "100vh", position: "relative"}}>
            <Scene playerPosRef={playerPosRef}>
                <Map obstaclesRef={obstaclesRef} rows={rows} />
                <Player
                    playerPosRef={playerPosRef}
                    obstaclesRef={obstaclesRef}
                    riverRowSet={riverRowsSet}
                    addRow={addRow}
                    onDie={handleDie}
                    onScoreChange={setScore}
                    minAllowedRowRef={minAllowedRowRef}
                />
            </Scene>

            <Score score={score} />

            {gameOver && <GameOver score={score} onRestart={handleRestart} />}
        </div>
    );
}

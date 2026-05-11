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
    const [currentRow, setCurrentRow] = useState(0);
    const [activeEffect, setActiveEffect] = useState(null);

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

    const EffectNotification = () => {
        if (!activeEffect) return null;
        
        const color = activeEffect.isBuff ? "#ffff00" : "#ff4444";
        const typeStr = activeEffect.type.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
        
        let extraText = "";
        if (activeEffect.type === 'fly') {
            const stepsLeft = Math.max(0, 5 - (currentRow - activeEffect.startRow));
            extraText = ` (${stepsLeft})`;
        }
        
        return (
            <div style={{
                position: "absolute",
                top: 20,
                left: 20,
                padding: "10px 20px",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                color: color,
                border: `2px solid ${color}`,
                borderRadius: "8px",
                fontFamily: "monospace",
                fontWeight: "bold",
                fontSize: "1.2rem",
                textShadow: "0 0 5px " + color,
                zIndex: 10
            }}>
                {activeEffect.isBuff ? "BUFF" : "DEBUFF"}: {typeStr}{extraText}
            </div>
        );
    };

    return (
        <div style={{width: "100vw", height: "100vh", position: "relative"}}>
            <EffectNotification />
            <Scene playerPosRef={playerPosRef} activeEffect={activeEffect}>
                <Map obstaclesRef={obstaclesRef} rows={rows} activeEffect={activeEffect} />
                <Player
                    playerPosRef={playerPosRef}
                    obstaclesRef={obstaclesRef}
                    riverRowSet={riverRowsSet}
                    addRow={addRow}
                    onDie={handleDie}
                    onScoreChange={setScore}
                    onRowChange={setCurrentRow}
                    minAllowedRowRef={minAllowedRowRef}
                    activeEffect={activeEffect}
                    setActiveEffect={setActiveEffect}
                />
            </Scene>

            <Score score={score} />

            {gameOver && <GameOver score={score} onRestart={handleRestart} />}
        </div>
    );
}

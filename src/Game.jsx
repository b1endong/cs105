import {useRef, useMemo, useState, useCallback, useEffect} from "react";
import Scene from "./components/Scene.jsx";
import Player from "./components/Player.jsx";
import Map from "./components/Map.jsx";
import GameOver from "./components/GameOver.jsx";
import Score from "./components/Score.jsx";
import CharacterSelect from "./components/CharacterSelect.jsx";
import {useMap} from "./ultis/useMap.js";

// ─── Camera mode constants ────────────────────────────────────────────────────
const CAMERA_MODES = ["ISO", "TOP", "3RD", "1ST"];

const CAMERA_META = {
    ISO: {icon: "⬡", label: "ISO", title: "Isometric"},
    TOP: {icon: "⊕", label: "TOP", title: "Top Down"},
    "3RD": {icon: "⚇", label: "3RD", title: "3rd Person · Mouse Look"},
    "1ST": {icon: "◎", label: "1ST", title: "1st Person · Mouse Look"},
};

// ─── CameraSelector HUD ───────────────────────────────────────────────────────
function CameraSelector({viewMode, onModeChange}) {
    return (
        <div style={hudStyles.wrap}>
            <div style={hudStyles.header}>CAMERA</div>

            <div style={hudStyles.panel}>
                {CAMERA_MODES.map((mode) => {
                    const active = viewMode === mode;
                    const meta = CAMERA_META[mode];
                    const isMouseLook = mode === "3RD" || mode === "1ST";
                    return (
                        <button
                            key={mode}
                            onClick={() => onModeChange(mode)}
                            title={`${meta.title} (V to cycle)`}
                            style={{
                                ...hudStyles.btn,
                                ...(active
                                    ? hudStyles.btnActive
                                    : hudStyles.btnIdle),
                            }}
                        >
                            <span style={hudStyles.btnIcon}>{meta.icon}</span>
                            <span style={hudStyles.btnLabel}>{meta.label}</span>
                            {/* Chấm nhỏ chỉ định mouse-look */}
                            {isMouseLook && (
                                <span
                                    style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: "50%",
                                        background: active
                                            ? "rgba(0,0,0,0.5)"
                                            : "rgba(255,160,20,0.5)",
                                        display: "block",
                                        marginTop: 1,
                                    }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <div style={hudStyles.hint}>V: cycle</div>

            {/* Gợi ý mouse-look khi hover vào 3RD/1ST */}
            {(viewMode === "3RD" || viewMode === "1ST") && (
                <div style={hudStyles.mouseTip}>🖱 drag to look</div>
            )}
        </div>
    );
}

const hudStyles = {
    wrap: {
        position: "fixed",
        left: 14,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 5,
        userSelect: "none",
        pointerEvents: "auto",
    },
    header: {
        fontSize: 9,
        letterSpacing: "0.18em",
        color: "rgba(255,255,255,0.35)",
        fontFamily: "'Courier New', monospace",
        fontWeight: 700,
    },
    panel: {
        display: "flex",
        flexDirection: "column",
        gap: 3,
        background: "rgba(8, 8, 12, 0.72)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "6px 5px",
    },
    btn: {
        width: 46,
        height: 44,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        border: "1px solid transparent",
        borderRadius: 7,
        cursor: "pointer",
        fontFamily: "'Courier New', monospace",
        transition:
            "background 0.15s, border-color 0.15s, box-shadow 0.15s, transform 0.1s",
        outline: "none",
        padding: 0,
    },
    btnActive: {
        background: "rgba(255, 160, 20, 0.92)",
        borderColor: "rgba(255, 200, 80, 0.7)",
        boxShadow:
            "0 0 10px rgba(255,160,20,0.45), inset 0 1px 0 rgba(255,255,255,0.2)",
        transform: "scale(1.06)",
    },
    btnIdle: {
        background: "rgba(255,255,255,0.04)",
        borderColor: "rgba(255,255,255,0.07)",
        boxShadow: "none",
        transform: "scale(1)",
    },
    btnIcon: {
        fontSize: 14,
        lineHeight: 1,
        color: "inherit",
    },
    btnLabel: {
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: "0.08em",
        color: "inherit",
    },
    hint: {
        fontSize: 8,
        color: "rgba(255,255,255,0.2)",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "0.06em",
    },
    mouseTip: {
        fontSize: 9,
        color: "rgba(255,160,20,0.6)",
        fontFamily: "'Courier New', monospace",
        letterSpacing: "0.04em",
        textAlign: "center",
        lineHeight: 1.4,
    },
};

// ─── Game ─────────────────────────────────────────────────────────────────────
export default function Game() {
    const [screen, setScreen] = useState("select");
    const [characterId, setCharacterId] = useState("chicken");
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [currentRow, setCurrentRow] = useState(0);
    const [activeEffect, setActiveEffect] = useState(null);

    const playerPosRef = useRef({x: 0, rowIndex: 0});
    const obstaclesRef = useRef([]);
    const minAllowedRowRef = useRef(0);

    // ── Player group ref — truyền vào cả Scene (camera) và Player (attach) ──
    const playerRef = useRef(null);

    // ── Camera mode ────────────────────────────────────────────────────────────
    // cameraModeRef: đọc trong useFrame (không gây re-render)
    // viewMode state: dùng để render UI và truyền xuống Scene cho overlay
    const cameraModeRef = useRef("ISO");
    const [viewMode, setViewMode] = useState("ISO");

    const handleModeChange = useCallback((mode) => {
        cameraModeRef.current = mode;
        setViewMode(mode);
    }, []);

    // Phím V: cycle qua 4 mode
    useEffect(() => {
        const handleKey = (e) => {
            if (e.code !== "KeyV") return;
            if (screen !== "playing") return;
            setViewMode((prev) => {
                const idx = CAMERA_MODES.indexOf(prev);
                const next = CAMERA_MODES[(idx + 1) % CAMERA_MODES.length];
                cameraModeRef.current = next;
                return next;
            });
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [screen]);

    const {rows, addRow} = useMap();

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

    const handleSelect = useCallback((id) => {
        setCharacterId(id);
        setScreen("playing");
    }, []);

    const handleDie = useCallback((finalScore) => {
        setScore(finalScore);
        setGameOver(true);
        setScreen("gameover");
    }, []);

    const handleRestart = useCallback(() => {
        window.location.reload();
    }, []);

    // Handle timed effects countdown
    useEffect(() => {
        if (activeEffect && activeEffect.timeLeft !== undefined) {
            const interval = setInterval(() => {
                setActiveEffect((prev) => {
                    if (
                        prev &&
                        prev.timeLeft !== undefined &&
                        prev.timeLeft !== -1
                    ) {
                        if (prev.timeLeft <= 1) return null;
                        return {...prev, timeLeft: prev.timeLeft - 1};
                    }
                    return prev;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [activeEffect?.type, activeEffect?.startRow]);

    const EffectNotification = () => {
        if (!activeEffect) return null;

        const color = activeEffect.isBuff ? "#ffff00" : "#ff4444";
        const typeStr = activeEffect.type
            .replace(/([A-Z])/g, " $1")
            .trim()
            .toUpperCase();

        let extraText = "";
        if (
            activeEffect.timeLeft !== undefined &&
            activeEffect.timeLeft !== -1
        ) {
            extraText = ` (${activeEffect.timeLeft}s)`;
        } else if (
            activeEffect.movesLeft !== undefined &&
            activeEffect.movesLeft !== -1
        ) {
            extraText = ` (${activeEffect.movesLeft} moves)`;
        }

        return (
            <div
                style={{
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
                    zIndex: 10,
                }}
            >
                {activeEffect.isBuff ? "BUFF" : "DEBUFF"}: {typeStr}
                {extraText}
            </div>
        );
    };

    return (
        <div style={{width: "100vw", height: "100vh", position: "relative"}}>
            <EffectNotification />

            {screen === "select" && <CharacterSelect onSelect={handleSelect} />}

            <div
                style={{
                    width: "100%",
                    height: "100%",
                    visibility: screen === "select" ? "hidden" : "visible",
                }}
            >
                {/*
                 * Scene nhận thêm:
                 *   playerRef    → CameraManager dùng getWorldPosition()
                 *   cameraModeRef → đọc trong useFrame (không re-render)
                 *   viewMode      → render overlay hint (HTML ngoài Canvas)
                 */}
                <Scene
                    playerPosRef={playerPosRef}
                    playerRef={playerRef}
                    activeEffect={activeEffect}
                    cameraModeRef={cameraModeRef}
                    viewMode={viewMode}
                >
                    <Map
                        obstaclesRef={obstaclesRef}
                        rows={rows}
                        activeEffect={activeEffect}
                    />
                    {screen === "playing" && (
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
                            characterId={characterId}
                            playerRef={playerRef}
                        />
                    )}
                </Scene>
            </div>

            <Score score={score} />

            {/* Camera selector HUD (chỉ hiện khi đang chơi) */}
            {screen === "playing" && (
                <CameraSelector
                    viewMode={viewMode}
                    onModeChange={handleModeChange}
                />
            )}

            {screen === "gameover" && (
                <GameOver score={score} onRestart={handleRestart} />
            )}
        </div>
    );
}

import { useEffect, useState } from "react";

export default function GameOver({score, deathCause, onRestart}) {
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem("crossy_high_score") || "0";
        let max_score = parseInt(stored, 10);
        if (score > max_score) {
            max_score = score;
            localStorage.setItem("crossy_high_score", max_score.toString());
        }
        setHighScore(max_score);
    }, [score]);

    const reasonText = () => {
        switch (deathCause) {
            case "car": return "BE CAREFUL WHEN CROSSING!";
            case "train": return "STAY AWAY FROM THE TRAIN!";
            case "water": return "LEARN TO SWIM NEXT TIME!";
            case "explosion": 
            default:
                return "NOT SO LUCKY!";
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(3px)",
                zIndex: 100,
                fontFamily: "'Press Start 2P', system-ui",
            }}
        >
            {/* Card */}
            <div
                style={{
                    background: "#fff",
                    borderRadius: 20,
                    padding: "40px 56px",
                    textAlign: "center",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.35)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 25,
                }}
            >
                <img
                    src="/skull_icon.jpg"
                    style={{
                        width: 80,
                        height: 80,
                    }}
                    alt="skull"
                />

                {/* Title */}
                <div
                    style={{
                        fontSize: 36,
                        fontWeight: 800,
                        color: "#E53935",
                        letterSpacing: 1,
                        marginTop: 4,
                    }}
                >
                    GAME OVER
                </div>

                {/* Reason */}
                <div
                    style={{
                        fontSize: 14,
                        color: "#555",
                        fontWeight: "bold",
                        marginTop: -10,
                        marginBottom: 10,
                    }}
                >
                    {reasonText()}
                </div>

                {/* Score */}
                <div
                    style={{
                        fontSize: 16,
                        color: "#888",
                        fontWeight: 500,
                        marginTop: -4,
                    }}
                >
                    Score
                </div>
                <div
                    style={{
                        fontSize: 72,
                        fontWeight: 900,
                        color: "#212121",
                        lineHeight: 1,
                    }}
                >
                    {score}
                </div>

                {/* High Score */}
                <div
                    style={{
                        fontSize: 12,
                        color: "#ff9800",
                        fontWeight: 600,
                        marginTop: -10,
                    }}
                >
                    BEST: {highScore}
                </div>

                {/* Restart button */}
                <button
                    onClick={onRestart}
                    style={{
                        marginTop: 16,
                        padding: "14px 48px",
                        fontSize: 18,
                        fontWeight: 700,
                        background: "#43A047",
                        color: "#fff",
                        border: "none",
                        borderRadius: 50,
                        cursor: "pointer",
                        letterSpacing: 0.5,
                        boxShadow: "0 4px 12px rgba(67,160,71,0.4)",
                        transition: "transform 0.1s, box-shadow 0.1s",
                        fontFamily: "'Press Start 2P', system-ui",
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.06)";
                        e.target.style.boxShadow =
                            "0 6px 18px rgba(67,160,71,0.5)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow =
                            "0 4px 12px rgba(67,160,71,0.4)";
                    }}
                >
                    Restart
                </button>
            </div>
        </div>
    );
}

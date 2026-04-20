export default function GameOver({score, onRestart}) {
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
                fontFamily: "'Segoe UI', sans-serif",
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
                    gap: 12,
                }}
            >
                {/* Emoji */}
                <div style={{fontSize: 64, lineHeight: 1}}>☠️</div>

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
                    Chơi lại
                </button>
            </div>
        </div>
    );
}

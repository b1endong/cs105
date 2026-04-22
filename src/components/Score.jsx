export default function Score({score}) {
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                padding: 20,
                fontFamily: "'Press Start 2P', system-ui",
                fontSize: 18,
                fontWeight: 700,
                color: "#ffffff",
            }}
        >
            Score: {score}
        </div>
    );
}

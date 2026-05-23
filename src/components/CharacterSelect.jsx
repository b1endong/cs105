import {useState, useRef, useEffect} from "react";
import {Canvas, useFrame} from "@react-three/fiber";
import {CHARACTERS} from "../metadata/characters.js";

// Preview 3D xoay trong Canvas nhỏ
function RotatingPreview({Model, s = 40}) {
    const groupRef = useRef();
    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.z += delta * 0.9;
    });
    return (
        <group ref={groupRef} rotation={[0, 0, 0]}>
            <Model s={s} />
        </group>
    );
}

function PreviewCanvas({Model}) {
    return (
        <Canvas
            orthographic
            camera={{
                position: [60, -80, 100],
                zoom: 1.1,
                up: [0, 0, 1],
                near: 1,
                far: 1000,
            }}
            style={{width: "100%", height: "100%", background: "transparent"}}
            gl={{alpha: true}}
        >
            <ambientLight intensity={0.8} />
            <directionalLight position={[-60, -60, 120]} intensity={1.2} />
            <RotatingPreview Model={Model} />
        </Canvas>
    );
}

export default function CharacterSelect({onSelect}) {
    const [selected, setSelected] = useState("chicken");
    const current = CHARACTERS.find((c) => c.id === selected);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Enter") {
                onSelect(selected);
            } else if (e.key >= "1" && e.key <= "9") {
                const index = parseInt(e.key, 10) - 1;
                if (index >= 0 && index < CHARACTERS.length) {
                    setSelected(CHARACTERS[index].id);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selected, onSelect]);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(160deg, #1a237e 0%, #0d47a1 50%, #006064 100%)",
                zIndex: 200,
                fontFamily: "'Press Start 2P', system-ui",
            }}
        >
            {/* Title */}
            <div
                style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: "#FFF",
                    letterSpacing: 2,
                    marginBottom: 8,
                    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
                }}
            >
                CROSSY ROAD
            </div>
            <div
                style={{
                    fontSize: 15,
                    color: "#B3E5FC",
                    marginBottom: 32,
                    letterSpacing: 1,
                }}
            >
                Choose your character
            </div>

            {/* Preview lớn */}
            <div
                style={{
                    width: 160,
                    height: 160,
                    background: `radial-gradient(circle, ${current.color}33 0%, transparent 70%)`,
                    borderRadius: "50%",
                    marginBottom: 8,
                    position: "relative",
                }}
            >
                <PreviewCanvas Model={current.Model} />
            </div>
            <div
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#FFF",
                    marginBottom: 24,
                }}
            >
                {current.emoji} {current.label}
            </div>

            {/* Grid chọn nhân vật */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 90px)",
                    gap: 12,
                    marginBottom: 32,
                }}
            >
                {CHARACTERS.map((ch) => {
                    const isSelected = ch.id === selected;
                    return (
                        <button
                            key={ch.id}
                            onClick={() => setSelected(ch.id)}
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: 16,
                                border: isSelected
                                    ? `3px solid ${ch.color}`
                                    : "3px solid rgba(255,255,255,0.15)",
                                background: isSelected
                                    ? `${ch.color}30`
                                    : "rgba(255,255,255,0.08)",
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                                transform: isSelected
                                    ? "scale(1.08)"
                                    : "scale(1)",
                                transition: "all 0.15s ease",
                                boxShadow: isSelected
                                    ? `0 0 16px ${ch.color}66`
                                    : "none",
                            }}
                        >
                            <div
                                style={{
                                    width: 54,
                                    height: 54,
                                    pointerEvents: "none",
                                }}
                            >
                                <PreviewCanvas Model={ch.Model} />
                            </div>
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: isSelected ? ch.color : "#B3E5FC",
                                }}
                            >
                                {ch.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Nút Play */}
            <button
                onClick={() => onSelect(selected)}
                style={{
                    padding: "14px 56px",
                    fontSize: 18,
                    fontWeight: 800,
                    background: current.color,
                    color: "#fff",
                    border: "none",
                    borderRadius: 50,
                    cursor: "pointer",
                    letterSpacing: 1,
                    boxShadow: `0 4px 20px ${current.color}88`,
                    transition: "transform 0.1s",
                    fontFamily: "'Press Start 2P', system-ui",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.06)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
                ▶ PLAY
            </button>
        </div>
    );
}

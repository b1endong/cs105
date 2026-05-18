import {Canvas, useFrame, useThree} from "@react-three/fiber";
import {useRef, useEffect, useState} from "react";
import * as THREE from "three";
import {
    tileSize,
    CAMERA_START_ROW,
    BASE_CAMERA_Y,
} from "../metadata/constants.js";
import DayNightCycle from "../components/DayNightCycle.jsx";

// ─── Module-level reusable vectors (tránh GC trong useFrame) ─────────────────
const _wp = new THREE.Vector3();
const _tp = new THREE.Vector3();
const _la = new THREE.Vector3();

const MOUSE_SENSITIVITY = 0.003;

// ─── CameraManager ────────────────────────────────────────────────────────────
function CameraManager({
    playerRef,
    playerPosRef,
    cameraModeRef,
    yawRef,
    pitchRef,
    onLockChange,
}) {
    const {set, size, gl} = useThree();

    const orthoCamRef = useRef(null);
    const perspCamRef = useRef(null);
    const initRef = useRef(false);
    const prevModeRef = useRef("ISO");
    const lastWP = useRef(new THREE.Vector3());
    const isLockedRef = useRef(false);

    // ── Pointer Lock + mouse look ──────────────────────────────────────────────
    useEffect(() => {
        const canvas = gl.domElement;

        const onMouseMove = (e) => {
            const mode = cameraModeRef.current;
            if ((mode !== "3RD" && mode !== "1ST") || !isLockedRef.current)
                return;

            yawRef.current += e.movementX * MOUSE_SENSITIVITY;
            // movementY âm = chuột kéo lên → pitch tăng (nhìn lên) → dùng +=
            pitchRef.current += e.movementY * MOUSE_SENSITIVITY;

            // Clamp pitch tuỳ mode
            if (mode === "3RD") {
                // Không cho camera chui xuống đất hoặc lật ngược
                pitchRef.current = Math.max(
                    -0.15,
                    Math.min(1.3, pitchRef.current),
                );
            } else {
                // 1ST: giới hạn nhìn thẳng đứng ±85°
                pitchRef.current = Math.max(
                    -0.85,
                    Math.min(0.85, pitchRef.current),
                );
            }
        };

        const onClick = () => {
            const mode = cameraModeRef.current;
            if ((mode === "3RD" || mode === "1ST") && !isLockedRef.current) {
                canvas.requestPointerLock();
            }
        };

        const handleLockChange = () => {
            isLockedRef.current = document.pointerLockElement === canvas;
            onLockChange(isLockedRef.current);
        };

        canvas.addEventListener("click", onClick);
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("pointerlockchange", handleLockChange);

        return () => {
            canvas.removeEventListener("click", onClick);
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("pointerlockchange", handleLockChange);
        };
    }, [gl, cameraModeRef, yawRef, pitchRef, onLockChange]);

    useFrame((state, delta) => {
        // ── Khởi tạo cameras: chỉ chạy 1 lần ──────────────────────────────
        if (!initRef.current) {
            orthoCamRef.current = state.camera;

            const persp = new THREE.PerspectiveCamera(
                60,
                size.width / size.height,
                1,
                15000,
            );
            persp.up.set(0, 0, 1);
            perspCamRef.current = persp;
            initRef.current = true;
        }

        const mode = cameraModeRef.current;
        const cam = state.camera;

        // ── Xử lý switch mode (chỉ khi thực sự thay đổi) ──────────────────
        if (mode !== prevModeRef.current) {
            const wasMouseLook =
                prevModeRef.current === "3RD" || prevModeRef.current === "1ST";
            const isMouseLook = mode === "3RD" || mode === "1ST";

            // Thoát pointer lock khi rời khỏi mouse-look mode
            if (wasMouseLook && !isMouseLook && document.pointerLockElement) {
                document.exitPointerLock();
            }

            // Reset góc nhìn khi vào mouse-look mode lần đầu
            if (!wasMouseLook && mode === "3RD") {
                yawRef.current = 0; // phía sau player (−Y world)
                pitchRef.current = 0.35; // nhìn xuống nhẹ
            } else if (!wasMouseLook && mode === "1ST") {
                yawRef.current = 0; // nhìn về phía trước (+Y world)
                pitchRef.current = 0;
            }

            // Switch loại camera (ortho ↔ perspective)
            const isOrtho = mode === "ISO" || mode === "TOP";
            const wasOrtho =
                prevModeRef.current === "ISO" || prevModeRef.current === "TOP";

            if (isOrtho && !wasOrtho) {
                // Perspective → Orthographic
                orthoCamRef.current.position.copy(cam.position);
                orthoCamRef.current.up.set(0, 0, 1);
                orthoCamRef.current.updateProjectionMatrix();
                set({camera: orthoCamRef.current});
            } else if (!isOrtho && wasOrtho) {
                // Orthographic → Perspective
                const fov = mode === "1ST" ? 75 : 60;
                perspCamRef.current.fov = fov;
                perspCamRef.current.aspect = size.width / size.height;
                perspCamRef.current.near = 1;
                perspCamRef.current.far = 15000;
                perspCamRef.current.up.set(0, 0, 1);
                perspCamRef.current.updateProjectionMatrix();
                perspCamRef.current.position.copy(cam.position);
                set({camera: perspCamRef.current});
            } else if (!isOrtho) {
                // Perspective → Perspective: chỉ đổi fov
                cam.fov = mode === "1ST" ? 75 : 60;
                cam.updateProjectionMatrix();
            }

            prevModeRef.current = mode;
        }

        // ── Lấy world position của player ──────────────────────────────────
        if (playerRef?.current) {
            playerRef.current.getWorldPosition(_wp);
            lastWP.current.copy(_wp);
        } else {
            _wp.copy(lastWP.current);
        }

        const lf = Math.min(1, 8 * delta);

        // ── Di chuyển camera theo mode ──────────────────────────────────────
        switch (mode) {
            case "ISO": {
                const playerRow = playerPosRef.current.rowIndex;
                const scrolledRows = Math.max(0, playerRow - CAMERA_START_ROW);
                const targetY = BASE_CAMERA_Y + scrolledRows * tileSize;

                cam.position.x += (300 - cam.position.x) * lf;
                cam.position.y += (targetY - cam.position.y) * 0.1;
                cam.position.z += (300 - cam.position.z) * lf;

                cam.up.set(0, 0, 1);
                cam.lookAt(0, cam.position.y - BASE_CAMERA_Y, 0);
                break;
            }

            case "TOP": {
                _tp.set(_wp.x, _wp.y, 800);
                cam.position.lerp(_tp, lf);
                cam.up.set(0, 1, 0);
                cam.lookAt(_wp.x, _wp.y, 0);
                break;
            }

            case "3RD": {
                // ── Orbital camera: yaw xoay ngang, pitch tilt dọc ──────────
                // yaw=0  → camera phía sau player (−Y offset), nhìn về +Y
                // sin(yaw) → lệch X, -cos(yaw) → lệch Y (default âm = sau player)
                const yaw = yawRef.current;
                const pitch = pitchRef.current;
                const orbitR = 280;

                const targetX =
                    _wp.x + orbitR * Math.sin(yaw) * Math.cos(pitch);
                const targetY =
                    _wp.y - orbitR * Math.cos(yaw) * Math.cos(pitch);
                const targetZ = _wp.z + 40 + orbitR * Math.sin(pitch);

                _tp.set(targetX, targetY, Math.max(_wp.z + 20, targetZ));
                cam.position.lerp(_tp, lf);
                cam.up.set(0, 0, 1);

                // lookAt luôn hướng vào thân player (cao hơn chân một chút)
                _la.set(_wp.x, _wp.y, _wp.z + 40);
                cam.lookAt(_la);
                break;
            }

            case "1ST": {
                // ── First-person: gắn camera tại đầu player, mouse điều hướng ─
                // yaw=0  → forward direction = +Y world
                // pitch > 0 → nhìn xuống, pitch < 0 → nhìn lên
                const yaw = yawRef.current;
                const pitch = pitchRef.current;

                const hx = _wp.x;
                const hy = _wp.y - 20;
                const hz = _wp.z + 80;

                // Không lerp để tránh giật khi bám theo player
                cam.position.set(hx, hy, hz);
                cam.up.set(0, 0, 1);

                // Forward vector từ spherical coords (Z-up)
                const fx = Math.cos(pitch) * Math.sin(yaw);
                const fy = Math.cos(pitch) * Math.cos(yaw);
                const fz = -Math.sin(pitch); // pitch dương = chuột kéo xuống = nhìn xuống

                _la.set(hx + fx * 200, hy + fy * 200, hz + fz * 200);
                cam.lookAt(_la);
                break;
            }

            default:
                break;
        }
    });

    return null;
}

// ─── MouseLookOverlay ─────────────────────────────────────────────────────────
function MouseLookOverlay({viewMode, isLocked}) {
    const needsMouseLook = viewMode === "3RD" || viewMode === "1ST";
    if (!needsMouseLook) return null;

    return (
        <div
            style={{
                position: "absolute",
                bottom: 72,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: 10,
                pointerEvents: "none",
                zIndex: 50,
                transition: "opacity 0.3s",
                opacity: isLocked ? 0 : 1,
            }}
        >
            <div
                style={{
                    background: "rgba(0, 0, 0, 0.75)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 10,
                    padding: "8px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "'Courier New', monospace",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(8px)",
                    letterSpacing: "0.04em",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
                }}
            >
                <span style={{fontSize: 16}}>🖱️</span>
                <span>
                    Click to enable mouse look
                    <span
                        style={{
                            marginLeft: 10,
                            color: "rgba(255,255,255,0.35)",
                        }}
                    >
                        · ESC to release
                    </span>
                </span>
            </div>
        </div>
    );
}

// ─── MouseLockIndicator: hiện khi đã lock (góc phải dưới) ────────────────────
function MouseLockIndicator({viewMode, isLocked}) {
    const needsMouseLook = viewMode === "3RD" || viewMode === "1ST";
    if (!needsMouseLook || !isLocked) return null;

    return (
        <div
            style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255, 160, 20, 0.4)",
                borderRadius: 8,
                padding: "5px 12px",
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                color: "rgba(255, 160, 20, 0.9)",
                letterSpacing: "0.06em",
                pointerEvents: "none",
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                gap: 6,
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "rgba(255,160,20,0.9)",
                    display: "inline-block",
                    boxShadow: "0 0 6px rgba(255,160,20,0.8)",
                    animation: "pulse 1.5s ease-in-out infinite",
                }}
            />
            MOUSE LOOK · ESC to release
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
        </div>
    );
}

// ─── Scene (export default) ───────────────────────────────────────────────────
export default function Scene({
    children,
    playerRef,
    playerPosRef,
    activeEffect,
    cameraModeRef,
    viewMode, // UI state từ Game.jsx — dùng để render overlay (không dùng trong useFrame)
}) {
    // Yaw / pitch sống ở Scene, truyền xuống CameraManager qua ref → không re-render
    const yawRef = useRef(0);
    const pitchRef = useRef(0);

    const [isLocked, setIsLocked] = useState(false);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "absolute",
                top: 0,
                left: 0,
                overflow: "hidden",
            }}
        >
            <Canvas
                orthographic={true}
                camera={{
                    zoom: 1,
                    up: [0, 0, 1],
                    position: [300, BASE_CAMERA_Y, 300],
                    near: -5000,
                    far: 7000,
                }}
                style={{width: "100%", height: "100%"}}
            >
                <CameraManager
                    playerRef={playerRef}
                    playerPosRef={playerPosRef}
                    cameraModeRef={cameraModeRef}
                    yawRef={yawRef}
                    pitchRef={pitchRef}
                    onLockChange={setIsLocked}
                />
                <DayNightCycle startTime={0.35} activeEffect={activeEffect} />
                {children}
            </Canvas>

            {/* Overlays nằm ngoài Canvas (HTML over WebGL) */}
            <MouseLookOverlay viewMode={viewMode} isLocked={isLocked} />
            <MouseLockIndicator viewMode={viewMode} isLocked={isLocked} />
        </div>
    );
}

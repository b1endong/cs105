import {useRef} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import * as THREE from "three";
import SunModel from "../model/SunModel";
import MoonModel from "../model/MoonModel";
import {DAY_DURATION, ORBIT_R, ORBIT_H} from "../metadata/constants";

// Keyframes màu trời — dày hơn ở vùng chuyển tiếp để mượt hơn
const SKY_KEYS = [
    {
        t: 0.0,
        sky: 0x0d1b2a,
        amb: 0x2a4a6a,
        ambI: 0.55,
        dirC: 0xc8d8f0,
        dirI: 0.4,
    },
    {
        t: 0.2,
        sky: 0x0d1b2a,
        amb: 0x2a4a6a,
        ambI: 0.55,
        dirC: 0xc8d8f0,
        dirI: 0.4,
    },
    {
        t: 0.24,
        sky: 0x1a1a40,
        amb: 0x3a3a70,
        ambI: 0.5,
        dirC: 0xb0c0e0,
        dirI: 0.35,
    },
    {
        t: 0.27,
        sky: 0xff6030,
        amb: 0xff8050,
        ambI: 0.5,
        dirC: 0xff9060,
        dirI: 0.7,
    },
    {
        t: 0.32,
        sky: 0x87ceeb,
        amb: 0xfff8e1,
        ambI: 0.7,
        dirC: 0xfff5cc,
        dirI: 1.1,
    },
    {
        t: 0.5,
        sky: 0x4fc3f7,
        amb: 0xfff8e1,
        ambI: 0.9,
        dirC: 0xfffde0,
        dirI: 1.6,
    },
    {
        t: 0.68,
        sky: 0x87ceeb,
        amb: 0xfff8e1,
        ambI: 0.7,
        dirC: 0xfff5cc,
        dirI: 1.1,
    },
    {
        t: 0.73,
        sky: 0xff5020,
        amb: 0xff7040,
        ambI: 0.5,
        dirC: 0xff8050,
        dirI: 0.7,
    },
    {
        t: 0.76,
        sky: 0x1a1a40,
        amb: 0x3a3a70,
        ambI: 0.5,
        dirC: 0xb0c0e0,
        dirI: 0.35,
    },
    {
        t: 0.8,
        sky: 0x0d1b2a,
        amb: 0x2a4a6a,
        ambI: 0.55,
        dirC: 0xc8d8f0,
        dirI: 0.4,
    },
    {
        t: 1.0,
        sky: 0x0d1b2a,
        amb: 0x2a4a6a,
        ambI: 0.55,
        dirC: 0xc8d8f0,
        dirI: 0.4,
    },
];

// Nội suy mượt giữa 2 keyframe
function lerpKeys(t) {
    let a = SKY_KEYS[0],
        b = SKY_KEYS[1];
    for (let i = 0; i < SKY_KEYS.length - 1; i++) {
        if (t >= SKY_KEYS[i].t && t <= SKY_KEYS[i + 1].t) {
            a = SKY_KEYS[i];
            b = SKY_KEYS[i + 1];
            break;
        }
    }
    // smoothstep để chuyển tiếp không giật
    let f = (t - a.t) / (b.t - a.t);
    f = f * f * (3 - 2 * f); // smoothstep

    const sky = new THREE.Color(a.sky).lerp(new THREE.Color(b.sky), f);
    const amb = new THREE.Color(a.amb).lerp(new THREE.Color(b.amb), f);
    const ambI = a.ambI + (b.ambI - a.ambI) * f;
    const dirC = new THREE.Color(a.dirC).lerp(new THREE.Color(b.dirC), f);
    const dirI = a.dirI + (b.dirI - a.dirI) * f;
    return {sky, amb, ambI, dirC, dirI};
}

// Vectors dùng lại mỗi frame — tránh tạo rác GC
const _right = new THREE.Vector3();
const _screenUp = new THREE.Vector3();
const _sunPos = new THREE.Vector3();
const _moonPos = new THREE.Vector3();

export default function DayNightCycle({startTime = 0.35, activeEffect}) {
    const {scene, camera, controls} = useThree();

    const timeRef = useRef(startTime);
    const sunGroupRef = useRef();
    const moonGroupRef = useRef();
    const dirLightRef = useRef();
    const ambLightRef = useRef();
    const hemiLightRef = useRef();

    useFrame((_, delta) => {
        timeRef.current = (timeRef.current + delta / DAY_DURATION) % 1;
        let t = timeRef.current;
        if (activeEffect?.type === 'foreverNight') {
            t = 0.0;
        }

        // ── Quỹ đạo quanh trục Y ──
        // angle = 0 → phía trước (Z+), tăng → quay quanh Y
        // Mặt trời: đi từ t=0.25 (mọc) đến t=0.75 (lặn)
        // Dùng góc: t=0 → phía sau, t=0.5 → đỉnh đầu → ánh sáng chiếu thẳng xuống
        // -π/2 offset: t=0 → đáy (nửa đêm), t=0.5 → đỉnh (giữa trưa)
        // khớp với SKY_KEYS: bình minh t≈0.27, hoàng hôn t≈0.73
        const sunAngle = t * Math.PI * 2 - Math.PI / 2;

        // Quỹ đạo trong mặt phẳng XZ của world (Z-up):
        // X = ngang qua map, Z = chiều cao — giống đường cung mặt trời thực tế
        // Tâm orbit = điểm camera nhìn vào (OrbitControls target)
        // fallback: camera.position - [300,-300,300] (offset isometric ban đầu)
        const cx = controls ? controls.target.x : camera.position.x - 300;
        const cy = controls ? controls.target.y : camera.position.y + 300;

        const cs = Math.cos(sunAngle);
        const ss = Math.sin(sunAngle);

        _sunPos.set(
            cx + cs * ORBIT_R, // X: ngang qua map
            cy, // Y: bám camera
            ss * ORBIT_H, // Z: chiều cao
        );
        _moonPos.set(cx - cs * ORBIT_R, cy, -ss * ORBIT_H);

        // Đặt vị trí
        if (sunGroupRef.current) sunGroupRef.current.position.copy(_sunPos);
        if (moonGroupRef.current) moonGroupRef.current.position.copy(_moonPos);

        // Xoay mặt về phía camera
        if (sunGroupRef.current)
            sunGroupRef.current.lookAt(
                camera.position.x,
                camera.position.y,
                camera.position.z,
            );
        if (moonGroupRef.current)
            moonGroupRef.current.lookAt(
                camera.position.x,
                camera.position.y,
                camera.position.z,
            );

        // Ẩn khi dưới đường chân trời (Z < 0 = dưới đất)
        if (sunGroupRef.current)
            sunGroupRef.current.visible = _sunPos.z > -ORBIT_R * 0.1;
        if (moonGroupRef.current)
            moonGroupRef.current.visible = _moonPos.z > -ORBIT_R * 0.1;

        // ── Nội suy ánh sáng ──
        const k = lerpKeys(t);
        scene.background = k.sky;

        if (ambLightRef.current) {
            ambLightRef.current.color.copy(k.amb);
            let ambI = k.ambI;
            if (activeEffect?.type === 'nightVision' && _sunPos.z <= 0) {
                ambLightRef.current.color.setHex(0xfff8e1);
                ambI = 0.9;
            }
            ambLightRef.current.intensity = ambI;
        }

        const isDay = _sunPos.z > 0;
        if (dirLightRef.current) {
            const star = isDay ? _sunPos : _moonPos;
            dirLightRef.current.position.copy(star);
            if (activeEffect?.type === 'nightVision' && !isDay) {
                dirLightRef.current.color.setHex(0xfffde0);
                dirLightRef.current.intensity = 1.6;
            } else {
                dirLightRef.current.color.copy(k.dirC);
                dirLightRef.current.intensity = k.dirI;
            }
        }

        if (hemiLightRef.current) {
            if (isDay) {
                hemiLightRef.current.color.copy(k.sky);
                hemiLightRef.current.groundColor.set(0x4a7c3f);
                hemiLightRef.current.intensity = 0.5 + k.ambI * 0.4;
            } else {
                if (activeEffect?.type === 'nightVision') {
                    hemiLightRef.current.color.setHex(0x4fc3f7);
                    hemiLightRef.current.groundColor.set(0x4a7c3f);
                    hemiLightRef.current.intensity = 0.86;
                } else {
                    hemiLightRef.current.color.set(0x1a2a4a);
                    hemiLightRef.current.groundColor.set(0x0a1020);
                    hemiLightRef.current.intensity = 0.25;
                }
            }
        }
    });

    return (
        <>
            {/* Ánh sáng môi trường — ban đêm đủ sáng để thấy đường */}
            <ambientLight ref={ambLightRef} intensity={0.55} color={0x2a4a6a} />

            {/* Ánh sáng định hướng theo mặt trời/trăng */}
            <directionalLight
                ref={dirLightRef}
                position={[0, ORBIT_H, ORBIT_R]}
                intensity={1.6}
                color={0xfffde0}
                castShadow={false}
            />

            {/* Đèn fill từ góc đối diện để chiếu sáng mặt bên khuất — giúp thấy rõ khối 3D */}
            <directionalLight
                position={[-ORBIT_R * 0.6, -ORBIT_H * 0.3, ORBIT_R * 0.5]}
                intensity={0.35}
                color={0xa0b8d0}
                castShadow={false}
            />

            <hemisphereLight
                ref={hemiLightRef}
                skyColor={0x87ceeb} // ánh sáng từ trên xuống (trời)
                groundColor={0x4a7c3f} // ánh sáng phản chiếu từ dưới lên (đất)
                intensity={0.6}
            />

            {/* Mặt trời */}
            <group ref={sunGroupRef}>
                <SunModel s={32} />
            </group>

            {/* Mặt trăng */}
            <group ref={moonGroupRef}>
                <MoonModel s={32} />
            </group>
        </>
    );
}

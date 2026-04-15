export default function PlayerModel({s}) {
    return (
        <>
            {/* === FEET === */}
            <mesh position={[-s * 0.12, s * 0.04, -s * 0.4]}>
                <boxGeometry args={[s * 0.09, s * 0.17, s * 0.09]} />
                <meshPhongMaterial color="#FF8F00" />
            </mesh>
            <mesh position={[s * 0.12, s * 0.04, -s * 0.4]}>
                <boxGeometry args={[s * 0.09, s * 0.17, s * 0.09]} />
                <meshPhongMaterial color="#FF8F00" />
            </mesh>
            {/* Toe left */}
            <mesh position={[-s * 0.12, -s * 0.06, -s * 0.44]}>
                <boxGeometry args={[s * 0.07, s * 0.08, s * 0.05]} />
                <meshPhongMaterial color="#FF8F00" />
            </mesh>
            {/* Toe right */}
            <mesh position={[s * 0.12, -s * 0.06, -s * 0.44]}>
                <boxGeometry args={[s * 0.07, s * 0.08, s * 0.05]} />
                <meshPhongMaterial color="#FF8F00" />
            </mesh>

            {/* === BODY === */}
            <mesh position={[0, 0, -s * 0.06]}>
                <boxGeometry args={[s * 0.52, s * 0.44, s * 0.54]} />
                <meshPhongMaterial color="#FAFAF5" />
            </mesh>
            {/* Belly (slightly warm white) */}
            <mesh position={[0, -s * 0.08, -s * 0.1]}>
                <boxGeometry args={[s * 0.34, s * 0.28, s * 0.38]} />
                <meshPhongMaterial color="#FFF8E1" />
            </mesh>
            {/* Tail feather */}
            <mesh position={[0, s * 0.25, -s * 0.14]}>
                <boxGeometry args={[s * 0.22, s * 0.12, s * 0.26]} />
                <meshPhongMaterial color="#ECECE4" />
            </mesh>
            <mesh position={[0, s * 0.3, -s * 0.06]}>
                <boxGeometry args={[s * 0.14, s * 0.08, s * 0.16]} />
                <meshPhongMaterial color="#DDDDD5" />
            </mesh>

            {/* === WINGS === */}
            <mesh position={[-s * 0.3, s * 0.02, -s * 0.06]}>
                <boxGeometry args={[s * 0.08, s * 0.38, s * 0.44]} />
                <meshPhongMaterial color="#E8E8E0" />
            </mesh>
            <mesh position={[s * 0.3, s * 0.02, -s * 0.06]}>
                <boxGeometry args={[s * 0.08, s * 0.38, s * 0.44]} />
                <meshPhongMaterial color="#E8E8E0" />
            </mesh>
            {/* Wing tips (darker) */}
            <mesh position={[-s * 0.3, s * 0.22, -s * 0.14]}>
                <boxGeometry args={[s * 0.07, s * 0.1, s * 0.16]} />
                <meshPhongMaterial color="#D0D0C8" />
            </mesh>
            <mesh position={[s * 0.3, s * 0.22, -s * 0.14]}>
                <boxGeometry args={[s * 0.07, s * 0.1, s * 0.16]} />
                <meshPhongMaterial color="#D0D0C8" />
            </mesh>

            {/* === HEAD === */}
            <mesh position={[0, -s * 0.04, s * 0.24]}>
                <boxGeometry args={[s * 0.42, s * 0.38, s * 0.36]} />
                <meshPhongMaterial color="#FAFAF5" />
            </mesh>
            {/* Cheek puff left */}
            <mesh position={[-s * 0.22, -s * 0.16, s * 0.22]}>
                <boxGeometry args={[s * 0.06, s * 0.06, s * 0.14]} />
                <meshPhongMaterial color="#FFF8F8" />
            </mesh>
            {/* Cheek puff right */}
            <mesh position={[s * 0.22, -s * 0.16, s * 0.22]}>
                <boxGeometry args={[s * 0.06, s * 0.06, s * 0.14]} />
                <meshPhongMaterial color="#FFF8F8" />
            </mesh>

            {/* === BEAK === */}
            <mesh position={[0, -s * 0.24, s * 0.24]}>
                <boxGeometry args={[s * 0.14, s * 0.1, s * 0.07]} />
                <meshPhongMaterial color="#FFA000" />
            </mesh>
            {/* Lower beak */}
            <mesh position={[0, -s * 0.25, s * 0.2]}>
                <boxGeometry args={[s * 0.12, s * 0.08, s * 0.05]} />
                <meshPhongMaterial color="#FF8F00" />
            </mesh>
            {/* Wattle */}
            <mesh position={[0, -s * 0.22, s * 0.14]}>
                <boxGeometry args={[s * 0.08, s * 0.06, s * 0.1]} />
                <meshPhongMaterial color="#E53935" />
            </mesh>

            {/* === EYES === */}
            {/* Eye whites left */}
            <mesh position={[-s * 0.17, -s * 0.2, s * 0.29]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.1]} />
                <meshPhongMaterial color="#FFFFFF" />
            </mesh>
            {/* Pupil left */}
            <mesh position={[-s * 0.17, -s * 0.21, s * 0.29]}>
                <boxGeometry args={[s * 0.06, s * 0.04, s * 0.06]} />
                <meshPhongMaterial color="#111111" />
            </mesh>
            {/* Eye whites right */}
            <mesh position={[s * 0.17, -s * 0.2, s * 0.29]}>
                <boxGeometry args={[s * 0.1, s * 0.04, s * 0.1]} />
                <meshPhongMaterial color="#FFFFFF" />
            </mesh>
            {/* Pupil right */}
            <mesh position={[s * 0.17, -s * 0.21, s * 0.29]}>
                <boxGeometry args={[s * 0.06, s * 0.04, s * 0.06]} />
                <meshPhongMaterial color="#111111" />
            </mesh>
            {/* Eye highlight left */}
            <mesh position={[-s * 0.14, -s * 0.22, s * 0.31]}>
                <boxGeometry args={[s * 0.025, s * 0.02, s * 0.025]} />
                <meshPhongMaterial color="#FFFFFF" />
            </mesh>
            {/* Eye highlight right */}
            <mesh position={[s * 0.14, -s * 0.22, s * 0.31]}>
                <boxGeometry args={[s * 0.025, s * 0.02, s * 0.025]} />
                <meshPhongMaterial color="#FFFFFF" />
            </mesh>

            {/* === COMB === */}
            <mesh position={[0, -s * 0.02, s * 0.46]}>
                <boxGeometry args={[s * 0.1, s * 0.09, s * 0.12]} />
                <meshPhongMaterial color="#E53935" />
            </mesh>
            <mesh position={[s * 0.09, -s * 0.02, s * 0.43]}>
                <boxGeometry args={[s * 0.08, s * 0.08, s * 0.08]} />
                <meshPhongMaterial color="#EF5350" />
            </mesh>
            <mesh position={[-s * 0.09, -s * 0.02, s * 0.43]}>
                <boxGeometry args={[s * 0.08, s * 0.08, s * 0.08]} />
                <meshPhongMaterial color="#EF5350" />
            </mesh>
        </>
    );
}

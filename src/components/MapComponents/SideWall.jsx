import MountainModel from "../../model/MountainModel";
import WaterfallModel from "../../model/WaterfallModel";
import TunnelModel from "../../model/TunnelModel";

export default function SideWall({type, s, W, rowH, side}) {
    if (!s || !W) return null;

    const halfW = W / 2;
    const sign = side === "left" ? -1 : 1;
    // Đặt gốc group ngay sát mép map
    const xBase = sign * halfW;

    const props = {s, rowH: rowH ?? s * 0.125, side};

    return (
        <group position={[xBase, 0, 0]}>
            {type === "forest" && <MountainModel {...props} />}
            {type === "road" && <TunnelModel {...props} />}
            {type === "river" && <WaterfallModel {...props} />}
        </group>
    );
}

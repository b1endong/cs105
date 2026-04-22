const minTilesSize = -8;
const maxTilesSize = 8;
const tilesPerRow = maxTilesSize - minTilesSize + 1;
const tilesHeight = 1.5;
const tileSize = 64;

// Player
const MOVE_DURATION = 0.12;
const LOG_HALF_H = 0.125;

// Camera / Scene
const CAMERA_START_ROW = 2;
const BASE_CAMERA_Y = -300;

// Map generation
const WINDOW_SIZE = 20;
const MAX_CONSECUTIVE_DANGEROUS = 10;
const ROW_TYPES = ["forest", "car", "car", "car", "river", "river", "train"];

// ForestRow
const GROUND_OFFSET = 20;

// RoadRow
const STRIPE_SPACING = 3;

// SideWall
const EXTEND = 1200;

// TrainRow
const TRAIN_SPEED = 80;
const WARN_BEFORE = 2.5;
const COOLDOWN = 8;
const WAGON_COUNT = 20;

// Light
const DAY_DURATION = 120; // giây
const ORBIT_R = 800; // bán kính ngang của ellipse (screen X)
const ORBIT_H = 250; // bán kính dọc của ellipse (screen Y) — thấp hơn để gần map hơn

export {
    tilesPerRow,
    tileSize,
    tilesHeight,
    minTilesSize,
    maxTilesSize,
    MOVE_DURATION,
    LOG_HALF_H,
    CAMERA_START_ROW,
    BASE_CAMERA_Y,
    WINDOW_SIZE,
    MAX_CONSECUTIVE_DANGEROUS,
    ROW_TYPES,
    GROUND_OFFSET,
    STRIPE_SPACING,
    EXTEND,
    TRAIN_SPEED,
    WARN_BEFORE,
    WAGON_COUNT,
    COOLDOWN,
    DAY_DURATION,
    ORBIT_R,
    ORBIT_H,
};

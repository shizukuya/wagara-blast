import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid sizing
export const GRID_SIZE_STANDARD = 8;
export const GRID_SIZE_SMALL = 6;
export const GRID_SIZE_LARGE = 10;

// Calculate grid cell size based on screen width
const GRID_PADDING = 16;
const GRID_BORDER = 8;
export const getGridCellSize = (gridSize: number = GRID_SIZE_STANDARD): number => {
  const availableWidth = SCREEN_WIDTH - (GRID_PADDING * 2) - (GRID_BORDER * 2);
  return Math.floor(availableWidth / gridSize);
};

export const CELL_SIZE = getGridCellSize(GRID_SIZE_STANDARD);
export const CELL_GAP = 1; // Minimal gap for "kachitto" feel
export const CELL_RADIUS = 2; // Slight rounding for elegance
export const TILE_INNER_SHADOW = 1; // Inner shadow for "embedded" feel

// Block tray
export const BLOCK_TRAY_HEIGHT = 120;
export const BLOCK_PREVIEW_SCALE = 0.6;

// Booster bar
export const BOOSTER_BAR_HEIGHT = 56;

// Layout
export const HEADER_HEIGHT = 56;
export const SCORE_DISPLAY_HEIGHT = 48;
export const STATUS_BAR_HEIGHT = StatusBar.currentHeight ?? (Platform.OS === 'ios' ? 44 : 0);

export const Dimensions_ = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  gridPadding: GRID_PADDING,
  gridBorder: GRID_BORDER,
  cellSize: CELL_SIZE,
  cellGap: CELL_GAP,
  cellRadius: CELL_RADIUS,
  blockTrayHeight: BLOCK_TRAY_HEIGHT,
  boosterBarHeight: BOOSTER_BAR_HEIGHT,
  headerHeight: HEADER_HEIGHT,
  scoreDisplayHeight: SCORE_DISPLAY_HEIGHT,
  statusBarHeight: STATUS_BAR_HEIGHT,
} as const;

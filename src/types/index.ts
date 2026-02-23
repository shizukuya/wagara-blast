// =============================================================================
// Wagara Blast - Core Type Definitions
// =============================================================================

// ---------------------------------------------------------------------------
// Grid & Position
// ---------------------------------------------------------------------------

/** Row/column coordinate within the game grid. */
export interface Position {
  row: number;
  col: number;
}

/** Visual / logical state of a single grid cell. */
export type CellState = 'empty' | 'filled' | 'obstacle';

/** The seven traditional wagara (Japanese pattern) tile types. */
export type WagaraType =
  | 'ichimatsu'
  | 'asanoha'
  | 'seigaiha'
  | 'shippou'
  | 'yagasuri'
  | 'kikkou'
  | 'uroko';

/** Obstacle varieties that can occupy grid cells. */
export type ObstacleType =
  | 'stone'
  | 'kintsugi'
  | 'frozen'
  | 'chain'
  | 'fog'
  | 'rotate';

/** A single cell on the game grid. */
export interface GridCell {
  state: CellState;
  /** Present when state is 'filled'. */
  wagaraType?: WagaraType;
  /** Present when state is 'obstacle'. */
  obstacleType?: ObstacleType;
  /** Number of turns the cell remains frozen (frozen obstacle). */
  frozenTurns?: number;
  /** Remaining hit points for chained cells. */
  chainHP?: number;
  /** Whether this cell is hidden by fog-of-war. */
  hasFog?: boolean;
}

/**
 * The 8x8 (standard) game grid.
 * Indexed as grid[row][col].
 */
export type Grid = GridCell[][];

/** Default grid dimensions. */
export const GRID_ROWS = 8;
export const GRID_COLS = 8;

// ---------------------------------------------------------------------------
// Block / Piece
// ---------------------------------------------------------------------------

/** Shape template for a placeable block. */
export interface BlockShape {
  /** Unique identifier, e.g. 'single', 'l_shape'. */
  id: string;
  /** Human-readable display name. */
  name: string;
  /** Relative cell positions that make up the shape. */
  cells: Position[];
  /** Bounding-box width (columns). */
  width: number;
  /** Bounding-box height (rows). */
  height: number;
}

/** A concrete piece the player can drag onto the grid. */
export interface BlockPiece {
  shape: BlockShape;
  wagaraType: WagaraType;
  /** Unique instance identifier (used for tracking in piece tray). */
  id: string;
}

// ---------------------------------------------------------------------------
// Boosters
// ---------------------------------------------------------------------------

/** Available booster power-up types. */
export type BoosterType =
  | 'stoneBreaker'
  | 'shuffle'
  | 'guide'
  | 'lightning'
  | 'wave';

/** Player's current booster inventory. */
export type BoosterInventory = Record<BoosterType, number>;

// ---------------------------------------------------------------------------
// Game Mode & Level
// ---------------------------------------------------------------------------

/** Top-level game mode selector. */
export type GameMode = 'classic' | 'level' | 'daily';

/** How a level is considered "cleared". */
export interface ClearCondition {
  type: 'score' | 'lines' | 'moves';
  target: number;
}

/** Configuration for a pre-placed obstacle in a level. */
export interface ObstacleConfig {
  type: ObstacleType;
  positions: Position[];
  /** Number of turns the cell remains frozen (frozen obstacle). */
  frozenTurns?: number;
  /** Remaining hit points for chained cells. */
  chainHP?: number;
}

/** Full configuration for a single level. */
export interface LevelConfig {
  id: number;
  gridSize: number;
  /** Optional pre-built grid layout. When omitted an empty grid is generated. */
  grid?: Grid;
  clearCondition: ClearCondition;
  obstacles?: ObstacleConfig[];
  /** Maximum number of moves allowed (undefined = unlimited). */
  maxMoves?: number;
  /** Score thresholds for 1, 2, and 3 stars. */
  starThresholds: [number, number, number];
  /** Human-readable description of the level. */
  description?: string;
  /** Wagara type introduced in this level (for collection). */
  newWagara?: WagaraType;
  /** Obstacle type introduced in this level. */
  newObstacle?: ObstacleType;
}

// ---------------------------------------------------------------------------
// Game State
// ---------------------------------------------------------------------------

/** Core runtime game state. */
export interface GameState {
  grid: Grid;
  /** Grid dimension (e.g. 8 for 8x8). */
  gridSize: number;
  score: number;
  /** The current set of pieces available to the player (up to 3). */
  currentPieces: (BlockPiece | null)[];
  /** Current combo streak count. */
  combo: number;
  /** Total moves (piece placements) made so far. */
  moveCount: number;
  /** Total lines (rows + cols) cleared this session. */
  linesCleared: number;
  gameMode: GameMode;
  isGameOver: boolean;
  /** Whether the level has been cleared (level mode). */
  isLevelCleared: boolean;
  /** Present when gameMode is 'level'. */
  levelConfig?: LevelConfig;
  /** Remaining boosters for this session. */
  boosterInventory: BoosterInventory;
  /** Timestamp when the game started (ISO string). */
  startedAt: string;
  /** Best combo achieved in the current session. */
  bestCombo: number;
  /** Number of stars earned (level mode). */
  starsEarned: number;
  /** Set of wagara types the player has discovered during this session. */
  discoveredWagara: Set<WagaraType>;
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

/** Result of clearing rows/columns after a piece placement. */
export interface LineClearResult {
  /** Indices of fully-cleared rows. */
  rows: number[];
  /** Indices of fully-cleared columns. */
  cols: number[];
  /** Total number of lines cleared (rows.length + cols.length). */
  totalLines: number;
  /** Whether this clear is part of a consecutive combo. */
  isCombo: boolean;
  /** The combo multiplier count (1 if no combo). */
  comboCount: number;
  /** Points awarded for this clear. */
  score: number;
}

/** Result returned after attempting to place a piece on the grid. */
export interface PlacementResult {
  success: boolean;
  grid: Grid;
  lineClearResult?: LineClearResult;
  /** Wagara patterns the player encountered for the first time. */
  newDiscoveries?: WagaraType[];
}

// ---------------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------------

/** Union of all sound-effect and BGM identifiers. */
export type SoundId =
  | 'SE01'
  | 'SE02'
  | 'SE03'
  | 'SE04'
  | 'SE05'
  | 'SE06'
  | 'SE07'
  | 'SE08'
  | 'SE09'
  | 'SE10'
  | 'SE11'
  | 'SE12'
  | 'SE13'
  | 'SE14'
  | 'BGM01'
  | 'BGM02'
  | 'BGM03'
  | 'BGM04';

// ---------------------------------------------------------------------------
// Feedback / Haptics
// ---------------------------------------------------------------------------

/** Events that trigger audio + haptic feedback. */
export interface FeedbackEvent {
  type:
    | 'pickup'
    | 'hover'
    | 'place'
    | 'invalidDrop'
    | 'lineClear'
    | 'combo'
    | 'superCombo'
    | 'chain'
    | 'levelClear'
    | 'gameOver';
  /** Haptic intensity multiplier (0..1). */
  intensity?: number;
  /** Combo count for scaling feedback. */
  comboCount?: number;
  /** Rows cleared in this event. */
  clearedRows?: number[];
  /** Columns cleared in this event. */
  clearedCols?: number[];
  /** Score awarded for this event. */
  score?: number;
}

// ---------------------------------------------------------------------------
// User Progress & Settings
// ---------------------------------------------------------------------------

/** Persistent player progress. */
export interface UserProgress {
  classicHighScore: number;
  /** Map from level ID to number of stars earned (1-3). */
  levelProgress: Record<number, number>;
  totalStars: number;
  coins: number;
  dailyStreak: number;
  /** ISO date string of last completed daily challenge. */
  lastDailyDate: string;
  /** Set of wagara types the player has encountered. */
  discoveredWagara: WagaraType[];
}

/** Application-level user settings. */
export interface SettingsState {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  locale: 'ja' | 'en';
}

// ---------------------------------------------------------------------------
// Encyclopedia / Wagara Info
// ---------------------------------------------------------------------------

/** Bilingual information about a single wagara pattern. */
export interface WagaraInfo {
  type: WagaraType;
  nameJa: string;
  nameEn: string;
  meaningJa: string;
  meaningEn: string;
  historyJa: string;
  historyEn: string;
  /** Relative spawn frequency weight. Higher = more common. */
  frequency: number;
}

/** Color pair for rendering a wagara pattern. */
export interface WagaraColorScheme {
  primary: string;
  secondary: string;
}

/** Full wagara definition including visual data. */
export interface WagaraDefinition {
  type: WagaraType;
  nameJa: string;
  nameEn: string;
  colors: WagaraColorScheme;
  frequency: number;
}

// ---------------------------------------------------------------------------
// Obstacle Info
// ---------------------------------------------------------------------------

/** Static definition for an obstacle type. */
export interface ObstacleDefinition {
  type: ObstacleType;
  nameJa: string;
  nameEn: string;
  descriptionJa: string;
  descriptionEn: string;
  /** Whether the obstacle can be destroyed by line clears. */
  destructible: boolean;
  /** Number of adjacent line clears required to destroy (if destructible). */
  hitsRequired: number;
  /** Whether the obstacle blocks piece placement on its cell. */
  blocksPlacement: boolean;
}

// ---------------------------------------------------------------------------
// Booster Info
// ---------------------------------------------------------------------------

/** Static definition for a booster type. */
export interface BoosterDefinition {
  type: BoosterType;
  nameJa: string;
  nameEn: string;
  descriptionJa: string;
  descriptionEn: string;
  /** Cost in coins to purchase one use. */
  coinCost: number;
  /** Icon identifier for UI rendering. */
  icon: string;
}

// ---------------------------------------------------------------------------
// In-App Purchases
// ---------------------------------------------------------------------------

/** IAP product type. */
export type IAPProductType = 'consumable' | 'non_consumable';

/** A single purchasable product. */
export interface IAPProduct {
  id: string;
  nameJa: string;
  nameEn: string;
  priceJPY: number;
  type: IAPProductType;
}

// ---------------------------------------------------------------------------
// Sound Manifest
// ---------------------------------------------------------------------------

/** Mapping entry from a SoundId to its asset path and metadata. */
export interface SoundManifestEntry {
  id: SoundId;
  /** Relative path from the assets/audio directory. */
  path: string;
  /** Human-readable label. */
  label: string;
  /** Whether this is background music (true) or a sound effect (false). */
  isMusic: boolean;
  /** Whether the track should loop. */
  loop: boolean;
  /** Default volume (0..1). */
  volume: number;
}

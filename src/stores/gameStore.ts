// =============================================================================
// Game Store - Non-persistent runtime game state (Zustand)
// =============================================================================
import { create } from 'zustand';
import type {
  Grid,
  GridCell,
  BlockPiece,
  GameMode,
  LevelConfig,
  BoosterType,
} from '../types';
import { GRID_ROWS, GRID_COLS } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a fresh empty grid of the given size. */
function createEmptyGrid(rows: number, cols: number): Grid {
  const grid: Grid = [];
  for (let r = 0; r < rows; r++) {
    const row: GridCell[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({ state: 'empty' });
    }
    grid.push(row);
  }
  return grid;
}

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface GameStoreState {
  // Board
  grid: Grid;
  gridSize: number;

  // Scoring
  score: number;
  combo: number;
  moveCount: number;
  linesCleared: number;

  // Piece tray (3 slots)
  currentPieces: (BlockPiece | null)[];

  // Mode & level
  gameMode: GameMode;
  isGameOver: boolean;
  isLevelCleared: boolean;
  levelConfig: LevelConfig | null;

  // UI state
  isPaused: boolean;

  // Actions
  initGame: (mode: GameMode, levelConfig?: LevelConfig) => void;
  placePiece: (
    pieceIndex: number,
    startRow: number,
    startCol: number,
  ) => boolean;
  setGrid: (grid: Grid) => void;
  setCurrentPieces: (pieces: (BlockPiece | null)[]) => void;
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  incrementMoveCount: () => void;
  addLinesCleared: (count: number) => void;
  setGameOver: (isOver: boolean) => void;
  setLevelCleared: (cleared: boolean) => void;
  useBooster: (type: BoosterType) => void;
  togglePause: () => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useGameStore = create<GameStoreState>()((set, get) => ({
  // ---- Initial state ----
  grid: createEmptyGrid(GRID_ROWS, GRID_COLS),
  gridSize: GRID_ROWS,
  score: 0,
  combo: 0,
  moveCount: 0,
  linesCleared: 0,
  currentPieces: [null, null, null],
  gameMode: 'classic' as GameMode,
  isGameOver: false,
  isLevelCleared: false,
  levelConfig: null,
  isPaused: false,

  // ---- Actions ----

  /**
   * Initialize / restart a game session.
   * Resets score, grid, pieces, and sets mode + optional level config.
   */
  initGame: (mode: GameMode, levelConfig?: LevelConfig) => {
    const size = levelConfig?.gridSize ?? GRID_ROWS;
    const grid = levelConfig?.grid
      ? levelConfig.grid.map((row) => row.map((cell) => ({ ...cell })))
      : createEmptyGrid(size, size);

    set({
      grid,
      gridSize: size,
      score: 0,
      combo: 0,
      moveCount: 0,
      linesCleared: 0,
      currentPieces: [null, null, null],
      gameMode: mode,
      isGameOver: false,
      isLevelCleared: false,
      levelConfig: levelConfig ?? null,
      isPaused: false,
    });
  },

  /**
   * Attempt to place the piece at `pieceIndex` onto the grid at (startRow, startCol).
   * Returns true if placement succeeded.
   *
   * NOTE: Full game-engine validation (collision, line-clear, scoring) should be
   * orchestrated externally via the engine module. This is a low-level state
   * setter that trusts the caller has already validated the move.
   */
  placePiece: (pieceIndex: number, startRow: number, startCol: number) => {
    const { grid, currentPieces, gridSize } = get();
    const piece = currentPieces[pieceIndex];
    if (!piece) return false;

    const { cells } = piece.shape;

    // Bounds & collision check
    for (const cell of cells) {
      const r = startRow + cell.row;
      const c = startCol + cell.col;
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) return false;
      if (grid[r][c].state !== 'empty') return false;
    }

    // Deep-clone grid and place
    const newGrid: Grid = grid.map((row) =>
      row.map((cell) => ({ ...cell })),
    );
    for (const cell of cells) {
      const r = startRow + cell.row;
      const c = startCol + cell.col;
      newGrid[r][c] = {
        state: 'filled',
        wagaraType: piece.wagaraType,
      };
    }

    // Remove piece from tray
    const newPieces = [...currentPieces];
    newPieces[pieceIndex] = null;

    set({
      grid: newGrid,
      currentPieces: newPieces,
      moveCount: get().moveCount + 1,
    });
    return true;
  },

  setGrid: (grid: Grid) => set({ grid }),

  setCurrentPieces: (pieces: (BlockPiece | null)[]) =>
    set({ currentPieces: pieces }),

  setScore: (score: number) => set({ score }),

  addScore: (points: number) => set({ score: get().score + points }),

  incrementCombo: () => set({ combo: get().combo + 1 }),

  resetCombo: () => set({ combo: 0 }),

  incrementMoveCount: () => set({ moveCount: get().moveCount + 1 }),

  addLinesCleared: (count: number) =>
    set({ linesCleared: get().linesCleared + count }),

  setGameOver: (isOver: boolean) => set({ isGameOver: isOver }),

  setLevelCleared: (cleared: boolean) => set({ isLevelCleared: cleared }),

  /**
   * Use a booster. The actual booster effect should be implemented by the
   * game engine; this merely signals the store that a booster was activated.
   * Booster inventory tracking lives in boosterStore.
   */
  useBooster: (_type: BoosterType) => {
    // Booster effects are applied by the engine layer.
    // This hook is provided so UI can react synchronously.
  },

  togglePause: () => set({ isPaused: !get().isPaused }),

  reset: () => {
    const size = get().gridSize;
    set({
      grid: createEmptyGrid(size, size),
      score: 0,
      combo: 0,
      moveCount: 0,
      linesCleared: 0,
      currentPieces: [null, null, null],
      isGameOver: false,
      isLevelCleared: false,
      levelConfig: null,
      isPaused: false,
    });
  },
}));

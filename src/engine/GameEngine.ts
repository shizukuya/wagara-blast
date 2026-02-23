// =============================================================================
// Wagara Blast - Game Engine (Main Orchestrator)
// =============================================================================
//
// Pure logic orchestrator. Ties together grid operations, scoring, obstacles,
// boosters, and piece generation into a single coherent game loop.
//
// All functions are pure: they take a GameState and return a new GameState
// plus an array of FeedbackEvents for the UI layer to consume.
// =============================================================================

import {
  GameState,
  GameMode,
  LevelConfig,
  Grid,
  Position,
  BlockPiece,
  FeedbackEvent,
  BoosterType,
  BoosterInventory,
  WagaraType,
} from '@/types';

import {
  createEmptyGrid,
  createGridFromConfig,
  canPlaceBlock,
  placeBlock,
  findCompletedLines,
  clearLines,
  hasValidPlacement,
} from '@/engine/GridLogic';

import { generatePieces } from '@/engine/PieceGenerator';

import {
  calculatePlacementScore,
  calculateLineClearScore,
  calculateKintsugiBonus,
} from '@/engine/ScoreCalculator';

import { processAllObstacles } from '@/engine/ObstacleLogic';

import {
  applyStoneBreaker,
  applyShuffle,
  applyGuide,
  applyLightning,
  applyWave,
} from '@/engine/BoosterLogic';

import { calculateStars } from '@/engine/LevelLoader';

// ---------------------------------------------------------------------------
// Default Booster Inventory
// ---------------------------------------------------------------------------

const DEFAULT_BOOSTER_INVENTORY: BoosterInventory = {
  stoneBreaker: 3,
  shuffle: 3,
  guide: 3,
  lightning: 1,
  wave: 1,
};

// ---------------------------------------------------------------------------
// Game Initialization
// ---------------------------------------------------------------------------

/**
 * Initialize a new game state for the given mode.
 *
 * @param mode        - The game mode (classic, level, daily).
 * @param levelConfig - Required for 'level' and 'daily' modes.
 * @returns A fresh GameState ready for play.
 */
export function initGame(
  mode: GameMode,
  levelConfig?: LevelConfig,
): GameState {
  let grid: Grid;
  let gridSize: number;

  if (levelConfig) {
    grid = createGridFromConfig(levelConfig);
    gridSize = levelConfig.gridSize;
  } else {
    gridSize = 8; // Default for classic mode
    grid = createEmptyGrid(gridSize);
  }

  const initialPieces = generatePieces(3);

  return {
    grid,
    gridSize,
    score: 0,
    currentPieces: initialPieces,
    combo: 0,
    moveCount: 0,
    linesCleared: 0,
    gameMode: mode,
    isGameOver: false,
    isLevelCleared: false,
    levelConfig,
    boosterInventory: { ...DEFAULT_BOOSTER_INVENTORY },
    startedAt: new Date().toISOString(),
    bestCombo: 0,
    starsEarned: 0,
    discoveredWagara: new Set<WagaraType>(),
  };
}

// ---------------------------------------------------------------------------
// Main Game Action: Place Piece
// ---------------------------------------------------------------------------

/**
 * The core game action: place a piece from the current set onto the grid.
 *
 * This function orchestrates:
 * 1. Validate placement
 * 2. Place block on grid
 * 3. Check for completed lines
 * 4. Calculate score (placement + line clears + combo + kintsugi)
 * 5. Process obstacles (fog, chain, frozen)
 * 6. Track wagara discoveries
 * 7. Generate new pieces if all 3 are placed
 * 8. Check game over / level clear conditions
 * 9. Return feedback events for the UI
 *
 * @param state      - Current game state.
 * @param pieceIndex - Index (0-2) of the piece in currentPieces.
 * @param position   - Grid position (top-left anchor) to place the piece.
 * @returns New state and feedback events, or unchanged state with invalidDrop event.
 */
export function placePiece(
  state: GameState,
  pieceIndex: number,
  position: Position,
): { newState: GameState; events: FeedbackEvent[] } {
  const events: FeedbackEvent[] = [];

  // --- Validation ---
  if (state.isGameOver || state.isLevelCleared) {
    return { newState: state, events: [] };
  }

  const piece = state.currentPieces[pieceIndex];
  if (!piece) {
    events.push({ type: 'invalidDrop', intensity: 0.3 });
    return { newState: state, events };
  }

  if (!canPlaceBlock(state.grid, piece, position)) {
    events.push({ type: 'invalidDrop', intensity: 0.3 });
    return { newState: state, events };
  }

  // --- Place Block ---
  let newGrid = placeBlock(state.grid, piece, position);

  // Compute the absolute positions of all cells in the placed block
  const placedPositions: Position[] = piece.shape.cells.map((offset) => ({
    row: position.row + offset.row,
    col: position.col + offset.col,
  }));

  events.push({
    type: 'place',
    intensity: 0.5,
    score: calculatePlacementScore(piece.shape.cells.length),
  });

  // --- Check for completed lines ---
  const completedLines = findCompletedLines(newGrid);
  const totalLinesCleared =
    completedLines.rows.length + completedLines.cols.length;

  // --- Calculate combo ---
  let newCombo: number;
  if (totalLinesCleared > 0) {
    newCombo = state.combo + 1;
  } else {
    newCombo = 0;
  }

  // --- Process obstacles BEFORE clearing lines (need original grid for kintsugi detection) ---
  const obstacleResult = processAllObstacles(
    newGrid,
    completedLines,
    placedPositions,
  );

  // --- Clear completed lines ---
  if (totalLinesCleared > 0) {
    newGrid = clearLines(obstacleResult.grid, completedLines.rows, completedLines.cols);
  } else {
    newGrid = obstacleResult.grid;
  }

  // --- Calculate score ---
  const placementScore = calculatePlacementScore(piece.shape.cells.length);
  const comboCount = newCombo > 1 ? newCombo - 1 : 0; // combo multiplier starts at 2nd consecutive clear
  const hasKintsugi = obstacleResult.hasKintsugi;

  let moveScore = placementScore;
  if (totalLinesCleared > 0) {
    let lineClearScore = calculateLineClearScore(totalLinesCleared, comboCount);
    if (hasKintsugi) {
      lineClearScore = calculateKintsugiBonus(lineClearScore);
    }
    moveScore += lineClearScore;

    // Emit line clear event
    events.push({
      type: 'lineClear',
      intensity: Math.min(1, 0.3 + totalLinesCleared * 0.2),
      clearedRows: completedLines.rows,
      clearedCols: completedLines.cols,
      score: lineClearScore,
    });

    // Emit combo event
    if (newCombo >= 2) {
      const comboType = newCombo >= 4 ? 'superCombo' : 'combo';
      events.push({
        type: comboType,
        intensity: Math.min(1, 0.4 + newCombo * 0.15),
        comboCount: newCombo,
        score: moveScore,
      });
    }
  }

  // Emit chain break event
  if (obstacleResult.chainsBroken > 0) {
    events.push({
      type: 'chain',
      intensity: 0.7,
    });
  }

  // --- Track wagara discoveries ---
  const newDiscoveredWagara = new Set(state.discoveredWagara);
  const wagaraType = piece.wagaraType;
  if (!newDiscoveredWagara.has(wagaraType)) {
    newDiscoveredWagara.add(wagaraType);
  }

  // --- Update pieces ---
  let newPieces: (BlockPiece | null)[] = [...state.currentPieces];
  newPieces[pieceIndex] = null;

  // Check if all 3 pieces have been used — generate fresh set
  if (newPieces.every((p) => p === null)) {
    newPieces = generatePieces(3);
  }

  // --- Update state ---
  const newScore = state.score + moveScore;
  const newMoveCount = state.moveCount + 1;
  const newTotalLinesCleared = state.linesCleared + totalLinesCleared;
  const newBestCombo = Math.max(state.bestCombo, newCombo);

  let newState: GameState = {
    ...state,
    grid: newGrid,
    score: newScore,
    currentPieces: newPieces,
    combo: newCombo,
    moveCount: newMoveCount,
    linesCleared: newTotalLinesCleared,
    bestCombo: newBestCombo,
    discoveredWagara: newDiscoveredWagara,
  };

  // --- Check level clear ---
  if (isLevelCleared(newState)) {
    const stars = newState.levelConfig
      ? calculateStars(newScore, newState.levelConfig.starThresholds)
      : 0;
    newState = {
      ...newState,
      isLevelCleared: true,
      starsEarned: stars,
    };
    events.push({
      type: 'levelClear',
      intensity: 1.0,
      score: newScore,
    });
  }
  // --- Check game over ---
  else if (isGameOver(newState)) {
    newState = {
      ...newState,
      isGameOver: true,
    };
    events.push({
      type: 'gameOver',
      intensity: 0.8,
      score: newScore,
    });
  }

  return { newState, events };
}

// ---------------------------------------------------------------------------
// Booster Usage
// ---------------------------------------------------------------------------

/**
 * Apply a booster to the current game state.
 *
 * @param state       - Current game state.
 * @param boosterType - Which booster to use.
 * @param target      - For stoneBreaker: Position. For lightning: row number.
 *                       For wave: column number. Others: ignored.
 * @returns New state and feedback events.
 */
export function useBooster(
  state: GameState,
  boosterType: BoosterType,
  target?: Position | number,
): { newState: GameState; events: FeedbackEvent[] } {
  const events: FeedbackEvent[] = [];

  if (state.isGameOver || state.isLevelCleared) {
    return { newState: state, events: [] };
  }

  // Check booster availability
  if (state.boosterInventory[boosterType] <= 0) {
    return { newState: state, events: [] };
  }

  // Decrement booster count
  const newInventory: BoosterInventory = {
    ...state.boosterInventory,
    [boosterType]: state.boosterInventory[boosterType] - 1,
  };

  let newGrid = state.grid;
  let newPieces = state.currentPieces;

  switch (boosterType) {
    case 'stoneBreaker': {
      if (!target || typeof target === 'number') break;
      newGrid = applyStoneBreaker(state.grid, target as Position);
      events.push({ type: 'place', intensity: 0.8 });
      break;
    }
    case 'shuffle': {
      const shuffled = applyShuffle(state.currentPieces);
      newPieces = shuffled;
      events.push({ type: 'place', intensity: 0.4 });
      break;
    }
    case 'guide': {
      const suggestion = applyGuide(state.grid, state.currentPieces);
      if (suggestion) {
        // The guide just suggests -- it doesn't actually place.
        // Return an event with the suggestion data for the UI.
        events.push({
          type: 'hover',
          intensity: 0.3,
        });
      }
      // Guide doesn't consume itself if there's no valid suggestion
      if (!suggestion) {
        return { newState: state, events: [] };
      }
      // Note: the guide booster IS consumed even though placement is manual.
      // The UI will highlight the suggested placement.
      break;
    }
    case 'lightning': {
      if (target === undefined || typeof target !== 'number') break;
      newGrid = applyLightning(state.grid, target as number);
      events.push({
        type: 'lineClear',
        intensity: 0.9,
        clearedRows: [target as number],
      });
      break;
    }
    case 'wave': {
      if (target === undefined || typeof target !== 'number') break;
      newGrid = applyWave(state.grid, target as number);
      events.push({
        type: 'lineClear',
        intensity: 0.9,
        clearedCols: [target as number],
      });
      break;
    }
  }

  let newState: GameState = {
    ...state,
    grid: newGrid,
    currentPieces: newPieces,
    boosterInventory: newInventory,
  };

  // After booster, check game over (in case booster opened up no new moves -- unlikely)
  // Also check level clear (lightning/wave might push score... but boosters don't add score)
  // Actually boosters don't add score, so just check game over
  if (isGameOver(newState)) {
    newState = { ...newState, isGameOver: true };
    events.push({ type: 'gameOver', intensity: 0.8, score: newState.score });
  }

  return { newState, events };
}

// ---------------------------------------------------------------------------
// Game State Checks
// ---------------------------------------------------------------------------

/**
 * Check if the level is cleared.
 *
 * In level/daily mode: checks the clear condition (score/lines/moves).
 * In classic mode: never "clears" -- the game goes on until game over.
 */
export function isLevelCleared(state: GameState): boolean {
  if (state.isLevelCleared) return true;
  if (state.gameMode === 'classic') return false;

  const config = state.levelConfig;
  if (!config) return false;

  const condition = config.clearCondition;
  switch (condition.type) {
    case 'score':
      return state.score >= condition.target;
    case 'lines':
      return state.linesCleared >= condition.target;
    case 'moves':
      // "moves" condition: clear within N moves (always considered cleared
      // if score target met; otherwise game over if moves exhausted)
      return state.score >= (config.starThresholds[0] ?? 0);
    default:
      return false;
  }
}

/**
 * Check if the game is over.
 *
 * Game over conditions:
 * - No valid placement for any remaining piece.
 * - In level mode with maxMoves: all moves exhausted without clearing.
 */
export function isGameOver(state: GameState): boolean {
  if (state.isGameOver) return true;
  if (state.isLevelCleared) return false;

  // Check move limit
  if (state.levelConfig?.maxMoves) {
    if (state.moveCount >= state.levelConfig.maxMoves) {
      return true;
    }
  }

  // Filter out null pieces
  const activePieces = state.currentPieces.filter(
    (p): p is BlockPiece => p !== null,
  );

  if (activePieces.length === 0) {
    // All pieces have been used -- new ones should have been generated.
    // If we somehow have no pieces, it's not game over per se.
    return false;
  }

  return !hasValidPlacement(state.grid, activePieces);
}

// ---------------------------------------------------------------------------
// Available Placements (for UI highlighting)
// ---------------------------------------------------------------------------

/**
 * For each non-null piece in currentPieces, compute all valid positions
 * where it can be placed.
 *
 * Returns a Map from piece index to array of valid positions.
 * This is used by the UI to show placement ghosts and for the guide booster.
 */
export function getAvailablePlacements(
  state: GameState,
): Map<number, Position[]> {
  const result = new Map<number, Position[]>();
  const size = state.gridSize;

  for (let i = 0; i < state.currentPieces.length; i++) {
    const piece = state.currentPieces[i];
    if (!piece) continue;

    const positions: Position[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (canPlaceBlock(state.grid, piece, { row: r, col: c })) {
          positions.push({ row: r, col: c });
        }
      }
    }
    result.set(i, positions);
  }

  return result;
}

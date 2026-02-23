// =============================================================================
// Wagara Blast - Booster Logic (Pure Functions)
// =============================================================================
//
// Handles all 5 booster types:
//   1. Stone Breaker - Remove any single cell (including obstacles).
//   2. Shuffle       - Regenerate 3 new random pieces.
//   3. Guide         - Find the best placement (simple heuristic).
//   4. Lightning     - Clear an entire row.
//   5. Wave          - Clear an entire column.
// =============================================================================

import { Grid, Position, BlockPiece } from '@/types';
import { generatePieces } from '@/engine/PieceGenerator';
import { canPlaceBlock, findCompletedLines } from '@/engine/GridLogic';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deep-clone a grid. */
function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

// ---------------------------------------------------------------------------
// 1. Stone Breaker
// ---------------------------------------------------------------------------

/**
 * Remove any single cell at the given position, regardless of its state.
 * This can destroy stones, frozen cells, chains, or filled cells.
 * Returns a new grid.
 */
export function applyStoneBreaker(grid: Grid, position: Position): Grid {
  const size = grid.length;
  if (
    position.row < 0 ||
    position.row >= size ||
    position.col < 0 ||
    position.col >= size
  ) {
    return grid; // Out of bounds, no-op
  }

  const newGrid = cloneGrid(grid);
  newGrid[position.row][position.col] = { state: 'empty' };
  return newGrid;
}

// ---------------------------------------------------------------------------
// 2. Shuffle
// ---------------------------------------------------------------------------

/**
 * Regenerate 3 new random pieces, replacing the current set.
 * Returns a new array of BlockPiece.
 */
export function applyShuffle(
  _currentPieces: (BlockPiece | null)[],
): BlockPiece[] {
  return generatePieces(3);
}

// ---------------------------------------------------------------------------
// 3. Guide
// ---------------------------------------------------------------------------

/**
 * Find the best placement for any of the available pieces.
 *
 * Heuristic (greedy): For each piece at each valid position, simulate placing
 * the piece and count how many total lines (rows + cols) would be completed.
 * Pick the placement that maximizes lines cleared. If tied, prefer positions
 * closer to the center of the grid for better board control.
 *
 * Returns the piece index and position of the best move, or null if no valid
 * placement exists.
 */
export function applyGuide(
  grid: Grid,
  pieces: (BlockPiece | null)[],
): { pieceIndex: number; position: Position } | null {
  const size = grid.length;
  let bestScore = -1;
  let bestPieceIndex = -1;
  let bestPosition: Position | null = null;

  const center = (size - 1) / 2;

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i];
    if (!piece) continue;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const pos: Position = { row: r, col: c };
        if (!canPlaceBlock(grid, piece, pos)) continue;

        // Simulate placement
        const simGrid = simulatePlacement(grid, piece, pos);
        const completed = findCompletedLines(simGrid);
        const totalLines = completed.rows.length + completed.cols.length;

        // Score: lines cleared * 1000 - distance from center (to break ties)
        const distFromCenter =
          Math.abs(r + piece.shape.height / 2 - center) +
          Math.abs(c + piece.shape.width / 2 - center);
        const score = totalLines * 1000 + (size - distFromCenter);

        if (score > bestScore) {
          bestScore = score;
          bestPieceIndex = i;
          bestPosition = pos;
        }
      }
    }
  }

  if (bestPieceIndex === -1 || !bestPosition) {
    return null;
  }

  return { pieceIndex: bestPieceIndex, position: bestPosition };
}

/**
 * Simulate placing a piece on the grid (for guide heuristic).
 * Lightweight version that just fills cells without full processing.
 */
function simulatePlacement(
  grid: Grid,
  piece: BlockPiece,
  position: Position,
): Grid {
  const newGrid = cloneGrid(grid);
  for (const cellOffset of piece.shape.cells) {
    const row = position.row + cellOffset.row;
    const col = position.col + cellOffset.col;
    newGrid[row][col] = {
      ...newGrid[row][col],
      state: 'filled',
      wagaraType: piece.wagaraType,
    };
  }
  return newGrid;
}

// ---------------------------------------------------------------------------
// 4. Lightning
// ---------------------------------------------------------------------------

/**
 * Clear an entire row on the grid.
 * Obstacle cells (stone, frozen, chain) ARE cleared by lightning.
 * Returns a new grid.
 */
export function applyLightning(grid: Grid, row: number): Grid {
  const size = grid.length;
  if (row < 0 || row >= size) return grid;

  const newGrid = cloneGrid(grid);
  for (let c = 0; c < size; c++) {
    newGrid[row][c] = { state: 'empty' };
  }
  return newGrid;
}

// ---------------------------------------------------------------------------
// 5. Wave
// ---------------------------------------------------------------------------

/**
 * Clear an entire column on the grid.
 * Obstacle cells (stone, frozen, chain) ARE cleared by wave.
 * Returns a new grid.
 */
export function applyWave(grid: Grid, col: number): Grid {
  const size = grid.length;
  if (col < 0 || col >= size) return grid;

  const newGrid = cloneGrid(grid);
  for (let r = 0; r < size; r++) {
    newGrid[r][col] = { state: 'empty' };
  }
  return newGrid;
}

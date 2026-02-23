// =============================================================================
// Wagara Blast - Obstacle Logic (Pure Functions)
// =============================================================================
//
// Handles all 6 obstacle types:
//   1. Stone   - Immovable blocker, cannot be placed on or cleared.
//   2. Kintsugi - Gold crack lines. When cleared, double score bonus.
//   3. Frozen  - Blocks placement for N turns, then thaws.
//   4. Chain   - Has HP. Reduced when adjacent lines are cleared. Removed at 0.
//   5. Fog     - Hides cells. Cleared when a piece is placed within radius 2.
//   6. Rotate  - NOT IMPLEMENTED in first 15 levels. Returns block as-is.
// =============================================================================

import {
  Grid,
  Position,
  BlockPiece,
} from '@/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deep-clone a grid. */
function cloneGrid(grid: Grid): Grid {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

// ---------------------------------------------------------------------------
// 1. Stone
// ---------------------------------------------------------------------------

/**
 * Stone cells are immovable and cannot be placed on.
 * This is a no-op processor -- stones are handled during placement validation
 * in GridLogic. Included here for consistency.
 */
export function processStone(grid: Grid, _position: Position): Grid {
  // Stones are static. No processing needed.
  return grid;
}

// ---------------------------------------------------------------------------
// 2. Kintsugi
// ---------------------------------------------------------------------------

/**
 * Check if any of the cleared rows/columns contain kintsugi-marked cells.
 * Returns { hasKintsugi: boolean, kintsugiPositions: Position[] }.
 */
export function processKintsugi(
  grid: Grid,
  clearedLines: { rows: number[]; cols: number[] },
): { hasKintsugi: boolean; kintsugiPositions: Position[] } {
  const size = grid.length;
  const kintsugiPositions: Position[] = [];

  // Check cleared rows for kintsugi cells
  for (const row of clearedLines.rows) {
    for (let c = 0; c < size; c++) {
      const cell = grid[row][c];
      if (cell.obstacleType === 'kintsugi') {
        kintsugiPositions.push({ row, col: c });
      }
    }
  }

  // Check cleared columns for kintsugi cells
  for (const col of clearedLines.cols) {
    for (let r = 0; r < size; r++) {
      const cell = grid[r][col];
      if (cell.obstacleType === 'kintsugi') {
        // Avoid duplicates if row+col intersection
        const alreadyAdded = kintsugiPositions.some(
          (p) => p.row === r && p.col === col,
        );
        if (!alreadyAdded) {
          kintsugiPositions.push({ row: r, col });
        }
      }
    }
  }

  return {
    hasKintsugi: kintsugiPositions.length > 0,
    kintsugiPositions,
  };
}

// ---------------------------------------------------------------------------
// 3. Frozen
// ---------------------------------------------------------------------------

/**
 * Process frozen cells: decrement frozenTurns by 1.
 * When frozenTurns reaches 0, unfreeze the cell (convert to empty).
 * Returns a new grid.
 */
export function processFrozen(grid: Grid): Grid {
  const newGrid = cloneGrid(grid);
  const size = newGrid.length;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = newGrid[r][c];
      if (cell.state === 'obstacle' && cell.obstacleType === 'frozen') {
        const remaining = (cell.frozenTurns ?? 1) - 1;
        if (remaining <= 0) {
          // Unfreeze: convert to empty cell
          newGrid[r][c] = { state: 'empty' };
        } else {
          newGrid[r][c] = { ...cell, frozenTurns: remaining };
        }
      }
    }
  }

  return newGrid;
}

// ---------------------------------------------------------------------------
// 4. Chain
// ---------------------------------------------------------------------------

/**
 * Process chain cells: reduce chainHP when an adjacent row or column is cleared.
 * A chain cell is "adjacent" to a cleared line if the cleared row/column
 * is within 1 cell of the chain's row/column.
 * When chainHP reaches 0, the chain cell is removed (converted to empty).
 * Returns a new grid.
 */
export function processChain(
  grid: Grid,
  clearedLines: { rows: number[]; cols: number[] },
): Grid {
  const newGrid = cloneGrid(grid);
  const size = newGrid.length;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cell = newGrid[r][c];
      if (cell.state === 'obstacle' && cell.obstacleType === 'chain') {
        let hits = 0;

        // Check if any cleared row is adjacent (within 1) to this chain's row
        for (const clearedRow of clearedLines.rows) {
          if (Math.abs(clearedRow - r) <= 1) {
            hits++;
            break; // Count at most 1 hit from rows
          }
        }

        // Check if any cleared column is adjacent (within 1) to this chain's column
        for (const clearedCol of clearedLines.cols) {
          if (Math.abs(clearedCol - c) <= 1) {
            hits++;
            break; // Count at most 1 hit from columns
          }
        }

        if (hits > 0) {
          const newHP = (cell.chainHP ?? 1) - hits;
          if (newHP <= 0) {
            // Chain broken! Convert to empty
            newGrid[r][c] = { state: 'empty' };
          } else {
            newGrid[r][c] = { ...cell, chainHP: newHP };
          }
        }
      }
    }
  }

  return newGrid;
}

// ---------------------------------------------------------------------------
// 5. Fog
// ---------------------------------------------------------------------------

/**
 * Clear fog around the placed block position within a Chebyshev distance of 2.
 * This reveals cells in a 5x5 area centered on each cell of the placed block.
 * Returns a new grid.
 */
export function processFog(
  grid: Grid,
  placedPositions: Position[],
): Grid {
  const newGrid = cloneGrid(grid);
  const size = newGrid.length;
  const radius = 2;

  for (const pos of placedPositions) {
    for (let r = Math.max(0, pos.row - radius); r <= Math.min(size - 1, pos.row + radius); r++) {
      for (let c = Math.max(0, pos.col - radius); c <= Math.min(size - 1, pos.col + radius); c++) {
        if (newGrid[r][c].hasFog) {
          newGrid[r][c] = { ...newGrid[r][c], hasFog: false };
        }
      }
    }
  }

  return newGrid;
}

// ---------------------------------------------------------------------------
// 6. Rotate (NOT IMPLEMENTED for Lv1-15)
// ---------------------------------------------------------------------------

/**
 * Rotate obstacle processing. NOT IMPLEMENTED in the first 15 levels.
 * Returns the block as-is.
 */
export function processRotate(
  _grid: Grid,
  blockPiece: BlockPiece,
  _position: Position,
): BlockPiece {
  // TODO: Implement rotation for Lv51+
  return blockPiece;
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------

/**
 * Process all obstacle effects after a piece is placed and lines are (potentially) cleared.
 *
 * Order of operations:
 * 1. Fog clearing (around placed cells)
 * 2. Kintsugi detection (before grid mutation)
 * 3. Chain processing (reduce HP from adjacent clears)
 * 4. Frozen decrement (each turn)
 *
 * @param grid            - The grid AFTER line clearing has occurred.
 * @param clearedLines    - Which rows/cols were just cleared.
 * @param placedPositions - The absolute positions of the cells in the placed block.
 * @returns Updated grid and metadata about obstacle events.
 */
export function processAllObstacles(
  grid: Grid,
  clearedLines: { rows: number[]; cols: number[] },
  placedPositions: Position[],
): {
  grid: Grid;
  hasKintsugi: boolean;
  kintsugiPositions: Position[];
  chainsBroken: number;
} {
  let currentGrid = grid;

  // 1. Process fog (reveal around placed positions)
  currentGrid = processFog(currentGrid, placedPositions);

  // 2. Detect kintsugi (we check the ORIGINAL grid before chain processing,
  //    since kintsugi info is read, not mutated)
  const kintsugiResult = processKintsugi(grid, clearedLines);

  // 3. Process chains (reduce HP from adjacent cleared lines)
  const totalLines = clearedLines.rows.length + clearedLines.cols.length;
  let chainsBroken = 0;
  if (totalLines > 0) {
    const beforeChainGrid = currentGrid;
    currentGrid = processChain(currentGrid, clearedLines);

    // Count how many chains were broken
    const size = currentGrid.length;
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const before = beforeChainGrid[r][c];
        const after = currentGrid[r][c];
        if (
          before.state === 'obstacle' &&
          before.obstacleType === 'chain' &&
          after.state === 'empty'
        ) {
          chainsBroken++;
        }
      }
    }
  }

  // 4. Process frozen (decrement turn counters)
  currentGrid = processFrozen(currentGrid);

  return {
    grid: currentGrid,
    hasKintsugi: kintsugiResult.hasKintsugi,
    kintsugiPositions: kintsugiResult.kintsugiPositions,
    chainsBroken,
  };
}

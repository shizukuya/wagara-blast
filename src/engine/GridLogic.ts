// =============================================================================
// Wagara Blast - Grid Logic (Pure Functions)
// =============================================================================
//
// Core grid operations: creation, placement validation, line detection, clearing.
// All functions are pure -- they never mutate their inputs and return new data.
// =============================================================================

import {
  GridCell,
  Grid,
  Position,
  BlockPiece,
  LevelConfig,
} from '@/types';

// ---------------------------------------------------------------------------
// Grid Creation
// ---------------------------------------------------------------------------

/**
 * Create an empty grid of the given size.
 * Every cell starts as { state: 'empty' }.
 */
export function createEmptyGrid(size: number): Grid {
  const grid: Grid = [];
  for (let r = 0; r < size; r++) {
    const row: GridCell[] = [];
    for (let c = 0; c < size; c++) {
      row.push({ state: 'empty' });
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Create a grid from a LevelConfig, placing obstacles as defined.
 * If the config contains a pre-built grid, deep-clone and return it.
 * Otherwise, create an empty grid and apply obstacle configs.
 */
export function createGridFromConfig(config: LevelConfig): Grid {
  // If a pre-built grid is provided, deep-clone it
  if (config.grid) {
    return config.grid.map((row) => row.map((cell) => ({ ...cell })));
  }

  const grid = createEmptyGrid(config.gridSize);

  if (!config.obstacles) {
    return grid;
  }

  for (const obs of config.obstacles) {
    for (const pos of obs.positions) {
      if (pos.row >= 0 && pos.row < config.gridSize && pos.col >= 0 && pos.col < config.gridSize) {
        const cell: GridCell = { state: 'obstacle', obstacleType: obs.type };

        if (obs.type === 'frozen') {
          cell.frozenTurns = obs.frozenTurns ?? 3;
        }
        if (obs.type === 'chain') {
          cell.chainHP = obs.chainHP ?? 2;
        }
        if (obs.type === 'fog') {
          // Fog cells start as empty but hidden
          cell.state = 'empty';
          cell.hasFog = true;
          cell.obstacleType = undefined;
        }
        if (obs.type === 'kintsugi') {
          // Kintsugi cells start as empty but marked for bonus
          cell.state = 'empty';
          cell.obstacleType = 'kintsugi';
        }

        grid[pos.row][pos.col] = cell;
      }
    }
  }

  return grid;
}

// ---------------------------------------------------------------------------
// Cell Access
// ---------------------------------------------------------------------------

/**
 * Safe cell access. Returns null if the position is out of bounds.
 */
export function getCellAt(grid: Grid, pos: Position): GridCell | null {
  if (pos.row < 0 || pos.row >= grid.length) return null;
  if (pos.col < 0 || pos.col >= grid[0].length) return null;
  return grid[pos.row][pos.col];
}

// ---------------------------------------------------------------------------
// Placement
// ---------------------------------------------------------------------------

/**
 * Check whether a block piece can be placed at the given position.
 * Position refers to the top-left anchor of the block's bounding box.
 *
 * Rules:
 * - Every cell of the block must be within grid bounds.
 * - Every target cell must be in 'empty' state.
 * - Obstacle cells (stone, frozen, chain) block placement.
 * - Fog cells that are empty underneath CAN be placed on (fog is visual only).
 */
export function canPlaceBlock(
  grid: Grid,
  block: BlockPiece,
  position: Position,
): boolean {
  const size = grid.length;
  for (const cellOffset of block.shape.cells) {
    const row = position.row + cellOffset.row;
    const col = position.col + cellOffset.col;

    // Bounds check
    if (row < 0 || row >= size || col < 0 || col >= size) {
      return false;
    }

    const targetCell = grid[row][col];

    // Obstacle cells block placement (stone, frozen, chain)
    if (targetCell.state === 'obstacle') {
      return false;
    }

    // Filled cells block placement
    if (targetCell.state === 'filled') {
      return false;
    }

    // Empty cells are OK (even if they have fog -- fog is visual overlay)
  }

  return true;
}

/**
 * Place a block on the grid at the given position.
 * Returns a NEW grid (immutable). Does NOT validate -- call canPlaceBlock first.
 */
export function placeBlock(
  grid: Grid,
  block: BlockPiece,
  position: Position,
): Grid {
  // Deep-clone the grid
  const newGrid: Grid = grid.map((row) => row.map((cell) => ({ ...cell })));

  for (const cellOffset of block.shape.cells) {
    const row = position.row + cellOffset.row;
    const col = position.col + cellOffset.col;

    newGrid[row][col] = {
      ...newGrid[row][col],
      state: 'filled',
      wagaraType: block.wagaraType,
    };
  }

  return newGrid;
}

// ---------------------------------------------------------------------------
// Line Detection & Clearing
// ---------------------------------------------------------------------------

/**
 * Find all completed rows and columns in the grid.
 *
 * A row/column is "complete" when every non-obstacle cell is filled.
 * Stone obstacles count as "blocking" a line -- a row with a stone
 * can still be completed if every other cell is filled.
 * Kintsugi cells (empty with obstacleType 'kintsugi') must also be filled.
 */
export function findCompletedLines(grid: Grid): { rows: number[]; cols: number[] } {
  const size = grid.length;
  const completedRows: number[] = [];
  const completedCols: number[] = [];

  // Check rows
  for (let r = 0; r < size; r++) {
    let complete = true;
    for (let c = 0; c < size; c++) {
      const cell = grid[r][c];
      // Stone/frozen/chain obstacles count as "filled" for line completion
      if (cell.state === 'obstacle') {
        continue;
      }
      if (cell.state !== 'filled') {
        complete = false;
        break;
      }
    }
    if (complete) {
      completedRows.push(r);
    }
  }

  // Check columns
  for (let c = 0; c < size; c++) {
    let complete = true;
    for (let r = 0; r < size; r++) {
      const cell = grid[r][c];
      if (cell.state === 'obstacle') {
        continue;
      }
      if (cell.state !== 'filled') {
        complete = false;
        break;
      }
    }
    if (complete) {
      completedCols.push(c);
    }
  }

  return { rows: completedRows, cols: completedCols };
}

/**
 * Clear all cells in the specified rows and columns.
 * Returns a NEW grid. Obstacle cells (stone, frozen, chain) are NOT cleared.
 * Kintsugi-marked cells are cleared (they become plain empty).
 */
export function clearLines(
  grid: Grid,
  rows: number[],
  cols: number[],
): Grid {
  const newGrid: Grid = grid.map((row) => row.map((cell) => ({ ...cell })));
  const size = newGrid.length;
  const rowSet = new Set(rows);
  const colSet = new Set(cols);

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (rowSet.has(r) || colSet.has(c)) {
        const cell = newGrid[r][c];
        // Don't clear stone/frozen/chain obstacle cells
        if (cell.state === 'obstacle') {
          continue;
        }
        // Clear filled cells back to empty
        newGrid[r][c] = {
          state: 'empty',
          // Preserve fog status if it was there (fog re-covers cleared cells)
          // Actually cleared cells lose fog
          hasFog: false,
          // Preserve kintsugi marking (kintsugi lines persist until explicitly removed)
          obstacleType: cell.obstacleType === 'kintsugi' ? 'kintsugi' : undefined,
        };
      }
    }
  }

  return newGrid;
}

// ---------------------------------------------------------------------------
// Game Over Check
// ---------------------------------------------------------------------------

/**
 * Check if ANY of the given pieces can be placed ANYWHERE on the grid.
 * Returns true if at least one valid placement exists.
 * Returns false if no piece can be placed (game over condition).
 */
export function hasValidPlacement(grid: Grid, pieces: BlockPiece[]): boolean {
  const size = grid.length;

  for (const piece of pieces) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (canPlaceBlock(grid, piece, { row: r, col: c })) {
          return true;
        }
      }
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Grid Statistics
// ---------------------------------------------------------------------------

/**
 * Count the number of filled cells in the grid.
 */
export function countFilledCells(grid: Grid): number {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell.state === 'filled') {
        count++;
      }
    }
  }
  return count;
}

/**
 * Get the fill percentage of the grid (0..1).
 * Only counts non-obstacle cells in the denominator.
 * Used to drive BGM tension levels.
 */
export function getGridFillPercentage(grid: Grid): number {
  let totalPlaceable = 0;
  let filled = 0;

  for (const row of grid) {
    for (const cell of row) {
      if (cell.state !== 'obstacle') {
        totalPlaceable++;
        if (cell.state === 'filled') {
          filled++;
        }
      }
    }
  }

  if (totalPlaceable === 0) return 0;
  return filled / totalPlaceable;
}

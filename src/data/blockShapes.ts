// =============================================================================
// Wagara Blast - Block Shape Definitions (14 shapes)
// =============================================================================

import { BlockShape } from '@/types';

/**
 * Single cell (1x1).
 */
const single: BlockShape = {
  id: 'single',
  name: 'Single',
  cells: [{ row: 0, col: 0 }],
  width: 1,
  height: 1,
};

/**
 * Horizontal domino (2x1).
 */
const domino_h: BlockShape = {
  id: 'domino_h',
  name: 'Domino (H)',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
  ],
  width: 2,
  height: 1,
};

/**
 * Vertical domino (1x2).
 */
const domino_v: BlockShape = {
  id: 'domino_v',
  name: 'Domino (V)',
  cells: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
  ],
  width: 1,
  height: 2,
};

/**
 * Horizontal tromino (3x1).
 */
const tromino_h: BlockShape = {
  id: 'tromino_h',
  name: 'Tromino (H)',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ],
  width: 3,
  height: 1,
};

/**
 * Vertical tromino (1x3).
 */
const tromino_v: BlockShape = {
  id: 'tromino_v',
  name: 'Tromino (V)',
  cells: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
  ],
  width: 1,
  height: 3,
};

/**
 * L-shape: vertical bar going down, then a cell to the right at the bottom.
 *
 *   X .
 *   X .
 *   X X
 */
const l_shape: BlockShape = {
  id: 'l_shape',
  name: 'L-Shape',
  cells: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 2, col: 1 },
  ],
  width: 2,
  height: 3,
};

/**
 * Reversed L-shape (mirror of l_shape).
 *
 *   . X
 *   . X
 *   X X
 */
const l_shape_rev: BlockShape = {
  id: 'l_shape_rev',
  name: 'L-Shape (Rev)',
  cells: [
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 2, col: 0 },
    { row: 2, col: 1 },
  ],
  width: 2,
  height: 3,
};

/**
 * T-shape: horizontal bar on top, single cell below centre.
 *
 *   X X X
 *   . X .
 */
const t_shape: BlockShape = {
  id: 't_shape',
  name: 'T-Shape',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 1, col: 1 },
  ],
  width: 3,
  height: 2,
};

/**
 * 2x2 square.
 *
 *   X X
 *   X X
 */
const square_2x2: BlockShape = {
  id: 'square_2x2',
  name: 'Square 2x2',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ],
  width: 2,
  height: 2,
};

/**
 * Z-shape (skew).
 *
 *   X X .
 *   . X X
 */
const z_shape: BlockShape = {
  id: 'z_shape',
  name: 'Z-Shape',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
  ],
  width: 3,
  height: 2,
};

/**
 * Reversed Z-shape (S-shape / skew mirror).
 *
 *   . X X
 *   X X .
 */
const z_shape_rev: BlockShape = {
  id: 'z_shape_rev',
  name: 'Z-Shape (Rev)',
  cells: [
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
  ],
  width: 3,
  height: 2,
};

/**
 * 3x3 full square (9 cells).
 *
 *   X X X
 *   X X X
 *   X X X
 */
const square_3x3: BlockShape = {
  id: 'square_3x3',
  name: 'Square 3x3',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 1, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 1 },
    { row: 2, col: 2 },
  ],
  width: 3,
  height: 3,
};

/**
 * Vertical I-piece (4x1).
 *
 *   X
 *   X
 *   X
 *   X
 */
const i_shape_4: BlockShape = {
  id: 'i_shape_4',
  name: 'I-Shape (4)',
  cells: [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 3, col: 0 },
  ],
  width: 1,
  height: 4,
};

/**
 * 2x3 rectangle (6 cells).
 *
 *   X X
 *   X X
 *   X X
 */
const rect_2x3: BlockShape = {
  id: 'rect_2x3',
  name: 'Rectangle 2x3',
  cells: [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 1, col: 0 },
    { row: 1, col: 1 },
    { row: 2, col: 0 },
    { row: 2, col: 1 },
  ],
  width: 2,
  height: 3,
};

// ---------------------------------------------------------------------------
// Exported array of all shapes
// ---------------------------------------------------------------------------

export const BLOCK_SHAPES: BlockShape[] = [
  single,
  domino_h,
  domino_v,
  tromino_h,
  tromino_v,
  l_shape,
  l_shape_rev,
  t_shape,
  square_2x2,
  z_shape,
  z_shape_rev,
  square_3x3,
  i_shape_4,
  rect_2x3,
];

/**
 * Look up a shape by its id.
 * Returns undefined if no shape matches.
 */
export function getBlockShapeById(id: string): BlockShape | undefined {
  return BLOCK_SHAPES.find((s) => s.id === id);
}

/**
 * Shapes considered "small" (1-2 cells) -- used for weighting random selection
 * so the game doesn't always hand out tiny pieces.
 */
export const SMALL_SHAPES: BlockShape[] = BLOCK_SHAPES.filter(
  (s) => s.cells.length <= 2,
);

/**
 * Shapes considered "large" (5+ cells).
 */
export const LARGE_SHAPES: BlockShape[] = BLOCK_SHAPES.filter(
  (s) => s.cells.length >= 5,
);

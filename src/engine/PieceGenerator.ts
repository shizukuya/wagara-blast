// =============================================================================
// Wagara Blast - Piece Generator (Pure Functions)
// =============================================================================
//
// Generates random BlockPiece instances with weighted wagara types.
// Supports both seeded PRNG (for daily challenges) and Math.random().
// =============================================================================

import { BlockPiece, BlockShape, WagaraType } from '@/types';
import { BLOCK_SHAPES } from '@/data/blockShapes';
import { buildWeightedWagaraPool } from '@/data/wagaraTypes';
import { SeededRandom } from '@/utils/random';

// ---------------------------------------------------------------------------
// Unique ID counter for piece instances
// ---------------------------------------------------------------------------

let pieceIdCounter = 0;

function nextPieceId(): string {
  pieceIdCounter++;
  return `piece_${pieceIdCounter}_${Date.now()}`;
}

/**
 * Reset the piece ID counter (useful for testing).
 */
export function resetPieceIdCounter(): void {
  pieceIdCounter = 0;
}

// ---------------------------------------------------------------------------
// Weighted Wagara Selection
// ---------------------------------------------------------------------------

// Pre-built weighted pool: [ 'ichimatsu', 'ichimatsu', ...(x5), 'asanoha', ...(x4), ... ]
const WAGARA_POOL: WagaraType[] = buildWeightedWagaraPool();

/**
 * Pick a random wagara type respecting frequency weights.
 * Uses the provided SeededRandom if given, otherwise Math.random().
 */
export function generateWeightedWagara(rng?: SeededRandom): WagaraType {
  if (rng) {
    return rng.pick(WAGARA_POOL);
  }
  return WAGARA_POOL[Math.floor(Math.random() * WAGARA_POOL.length)];
}

// ---------------------------------------------------------------------------
// Random Shape Selection
// ---------------------------------------------------------------------------

/**
 * Pick a random block shape from the 14 available shapes.
 * Uses the provided SeededRandom if given, otherwise Math.random().
 */
export function pickRandomShape(rng?: SeededRandom): BlockShape {
  if (rng) {
    return rng.pick(BLOCK_SHAPES);
  }
  return BLOCK_SHAPES[Math.floor(Math.random() * BLOCK_SHAPES.length)];
}

// ---------------------------------------------------------------------------
// Piece Generation
// ---------------------------------------------------------------------------

/**
 * Generate `count` random pieces, each with a random shape and weighted wagara type.
 * Uses the provided SeededRandom for reproducible generation (daily challenges).
 */
export function generatePieces(count: number, rng?: SeededRandom): BlockPiece[] {
  const pieces: BlockPiece[] = [];
  for (let i = 0; i < count; i++) {
    const shape = pickRandomShape(rng);
    const wagaraType = generateWeightedWagara(rng);
    pieces.push({
      shape,
      wagaraType,
      id: rng
        ? `piece_seeded_${i}_${shape.id}_${wagaraType}`
        : nextPieceId(),
    });
  }
  return pieces;
}

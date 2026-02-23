// =============================================================================
// Wagara Blast - Score Calculator (Pure Functions)
// =============================================================================
//
// Scoring system:
//   - Placement: cells * 10
//   - Line clear: tiered scoring with simultaneous bonuses
//   - Combo: multiplier based on consecutive line clears
//   - Kintsugi: 2x bonus for clearing kintsugi-marked lines
// =============================================================================

// ---------------------------------------------------------------------------
// Base Placement Score
// ---------------------------------------------------------------------------

/**
 * Calculate the base score for placing a block.
 * Score = number of cells in the block * 10.
 */
export function calculatePlacementScore(blockCells: number): number {
  return blockCells * 10;
}

// ---------------------------------------------------------------------------
// Line Clear Score
// ---------------------------------------------------------------------------

/**
 * Calculate the score awarded for clearing lines.
 *
 * Tier system:
 *   1 line  = 100 points
 *   2 lines = 300 points (100 bonus for simultaneous)
 *   3+ lines = 100 * lines * 2 (exponential bonus)
 *
 * Combo multiplier applied on top:
 *   finalScore = baseLineScore * (1 + comboCount * 0.5)
 *
 * @param totalLines - Total number of rows + columns cleared simultaneously.
 * @param comboCount - Number of consecutive moves that cleared lines (0 = first clear, no combo).
 */
export function calculateLineClearScore(
  totalLines: number,
  comboCount: number,
): number {
  if (totalLines <= 0) return 0;

  let baseScore: number;

  if (totalLines === 1) {
    baseScore = 100;
  } else if (totalLines === 2) {
    baseScore = 300;
  } else {
    // 3+ lines: generous bonus
    baseScore = 100 * totalLines * 2;
  }

  // Apply combo multiplier
  const comboMultiplier = 1 + comboCount * 0.5;
  return Math.floor(baseScore * comboMultiplier);
}

// ---------------------------------------------------------------------------
// Kintsugi Bonus
// ---------------------------------------------------------------------------

/**
 * Calculate the kintsugi bonus: doubles the base score.
 * Applied when a line containing kintsugi-marked cells is cleared.
 */
export function calculateKintsugiBonus(baseScore: number): number {
  return baseScore * 2;
}

// ---------------------------------------------------------------------------
// Total Score
// ---------------------------------------------------------------------------

/**
 * Calculate the total score for a single move.
 *
 * @param placementCells - Number of cells in the placed block.
 * @param linesCleared   - Total lines (rows + cols) cleared.
 * @param comboCount     - Consecutive combo count (0 = no combo).
 * @param hasKintsugi    - Whether any cleared line contained kintsugi cells.
 * @returns Total points earned for this move.
 */
export function calculateTotalScore(
  placementCells: number,
  linesCleared: number,
  comboCount: number,
  hasKintsugi: boolean,
): number {
  const placementScore = calculatePlacementScore(placementCells);
  let lineClearScore = calculateLineClearScore(linesCleared, comboCount);

  if (hasKintsugi && linesCleared > 0) {
    lineClearScore = calculateKintsugiBonus(lineClearScore);
  }

  return placementScore + lineClearScore;
}

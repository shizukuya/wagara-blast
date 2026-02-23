// =============================================================================
// Wagara Blast - Level Loader (Pure Functions)
// =============================================================================
//
// Loads level configurations from data/levels/.
// Provides star calculation based on score thresholds.
// =============================================================================

import { LevelConfig } from '@/types';
import { LEVELS, MAX_LEVEL_ID, getLevelById } from '@/data/levels';

// ---------------------------------------------------------------------------
// Level Loading
// ---------------------------------------------------------------------------

/**
 * Load a level by its ID (1-based).
 * Throws an error if the level does not exist.
 */
export function loadLevel(levelId: number): LevelConfig {
  const level = getLevelById(levelId);
  if (!level) {
    throw new Error(`Level ${levelId} not found. Valid range: 1-${MAX_LEVEL_ID}.`);
  }
  // Return a deep-enough copy so callers cannot mutate the master data
  return {
    ...level,
    obstacles: level.obstacles
      ? level.obstacles.map((obs) => ({
          ...obs,
          positions: obs.positions.map((p) => ({ ...p })),
        }))
      : [],
    starThresholds: [...level.starThresholds] as [number, number, number],
  };
}

/**
 * Get all available levels.
 * Returns copies so the master data cannot be mutated.
 */
export function getAllLevels(): LevelConfig[] {
  return LEVELS.map((level) => ({
    ...level,
    obstacles: level.obstacles
      ? level.obstacles.map((obs) => ({
          ...obs,
          positions: obs.positions.map((p) => ({ ...p })),
        }))
      : [],
    starThresholds: [...level.starThresholds] as [number, number, number],
  }));
}

/**
 * Returns the highest level ID currently available.
 * This is designed to be expandable -- just add more levels to the data.
 */
export function getMaxLevelId(): number {
  return MAX_LEVEL_ID;
}

// ---------------------------------------------------------------------------
// Star Calculation
// ---------------------------------------------------------------------------

/**
 * Calculate the number of stars earned (0-3) based on score and thresholds.
 *
 * @param score       - The player's score for the level.
 * @param thresholds  - [1-star threshold, 2-star threshold, 3-star threshold].
 * @returns Number of stars earned (0, 1, 2, or 3).
 */
export function calculateStars(
  score: number,
  thresholds: [number, number, number],
): number {
  if (score >= thresholds[2]) return 3;
  if (score >= thresholds[1]) return 2;
  if (score >= thresholds[0]) return 1;
  return 0;
}

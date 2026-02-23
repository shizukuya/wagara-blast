// =============================================================================
// Wagara Blast - Daily Challenge (Pure Functions)
// =============================================================================
//
// Generates a unique daily challenge based on the current date.
// Uses SeededRandom for reproducible level generation.
// =============================================================================

import { LevelConfig, ObstacleConfig, Position } from '@/types';
import { SeededRandom, dateSeed, getTodayString } from '@/utils/random';

// ---------------------------------------------------------------------------
// Daily Seed
// ---------------------------------------------------------------------------

/**
 * Generate a seed from today's date string (YYYY-MM-DD).
 * Deterministic: same date always produces the same seed.
 */
export function getDailySeed(): number {
  return dateSeed(getTodayString());
}

/**
 * Generate a seed from a specific date string.
 */
export function getSeedForDate(dateStr: string): number {
  return dateSeed(dateStr);
}

// ---------------------------------------------------------------------------
// Daily Challenge Generation
// ---------------------------------------------------------------------------

/**
 * Generate today's daily challenge level.
 *
 * Properties:
 * - Grid: always 8x8
 * - Obstacles vary by day of the week:
 *   Mon(1): no obstacles (relaxing start)
 *   Tue(2): stones
 *   Wed(3): kintsugi
 *   Thu(4): frozen
 *   Fri(5): chains
 *   Sat(6): fog + mixed
 *   Sun(0): all obstacle types (challenge day)
 * - Score target and star thresholds scale with difficulty.
 */
export function generateDailyChallenge(dateStr?: string): LevelConfig {
  const today = dateStr ?? getTodayString();
  const seed = dateSeed(today);
  const rng = new SeededRandom(seed);

  // Parse day of the week (0=Sun, 1=Mon, ..., 6=Sat)
  const date = new Date(today + 'T00:00:00');
  const dayOfWeek = date.getDay();

  const gridSize = 8;
  const obstacles = generateDailyObstacles(rng, gridSize, dayOfWeek);

  // Base target scales with day complexity
  const baseDifficulty = [7, 1, 2, 3, 4, 5, 6][dayOfWeek]; // Sun=7, Mon=1...Sat=6
  const targetScore = 2000 + baseDifficulty * 500 + rng.nextInt(0, 500);
  const star1 = targetScore;
  const star2 = Math.floor(targetScore * 1.5);
  const star3 = Math.floor(targetScore * 2.2);

  return {
    id: -1, // Daily challenges use -1 as a sentinel ID
    gridSize,
    clearCondition: { type: 'score', target: targetScore },
    starThresholds: [star1, star2, star3],
    obstacles,
    description: `Daily Challenge - ${today}`,
  };
}

/**
 * Generate obstacle configurations for the daily challenge.
 */
function generateDailyObstacles(
  rng: SeededRandom,
  gridSize: number,
  dayOfWeek: number,
): ObstacleConfig[] {
  const obstacles: ObstacleConfig[] = [];

  switch (dayOfWeek) {
    case 1: // Monday: no obstacles
      break;

    case 2: // Tuesday: stones
      obstacles.push({
        type: 'stone',
        positions: generateRandomPositions(rng, gridSize, rng.nextInt(2, 5)),
      });
      break;

    case 3: // Wednesday: kintsugi
      {
        const row = rng.nextInt(2, 5);
        const positions: Position[] = [];
        for (let c = 0; c < gridSize; c++) {
          positions.push({ row, col: c });
        }
        obstacles.push({ type: 'kintsugi', positions });
      }
      break;

    case 4: // Thursday: frozen
      obstacles.push({
        type: 'frozen',
        positions: generateRandomPositions(rng, gridSize, rng.nextInt(3, 6)),
        frozenTurns: rng.nextInt(2, 4),
      });
      break;

    case 5: // Friday: chains
      obstacles.push({
        type: 'chain',
        positions: generateRandomPositions(rng, gridSize, rng.nextInt(3, 6)),
        chainHP: rng.nextInt(2, 3),
      });
      break;

    case 6: // Saturday: fog + stones
      obstacles.push({
        type: 'fog',
        positions: generateRandomPositions(rng, gridSize, rng.nextInt(8, 14)),
      });
      obstacles.push({
        type: 'stone',
        positions: generateRandomPositions(rng, gridSize, rng.nextInt(1, 3)),
      });
      break;

    case 0: // Sunday: all obstacle types
      obstacles.push({
        type: 'stone',
        positions: generateRandomPositions(rng, gridSize, rng.nextInt(2, 3)),
      });
      {
        const row = rng.nextInt(2, 5);
        const positions: Position[] = [];
        for (let c = 0; c < gridSize; c++) {
          positions.push({ row, col: c });
        }
        obstacles.push({ type: 'kintsugi', positions });
      }
      obstacles.push({
        type: 'frozen',
        positions: generateRandomPositions(rng, gridSize, rng.nextInt(2, 4)),
        frozenTurns: rng.nextInt(2, 3),
      });
      obstacles.push({
        type: 'chain',
        positions: generateRandomPositions(rng, gridSize, rng.nextInt(2, 4)),
        chainHP: 2,
      });
      break;
  }

  return obstacles;
}

/**
 * Generate N random non-overlapping positions on the grid.
 * Avoids the center 2x2 area to ensure the player can always start placing.
 */
function generateRandomPositions(
  rng: SeededRandom,
  gridSize: number,
  count: number,
): Position[] {
  const positions: Position[] = [];
  const used = new Set<string>();
  const center = Math.floor(gridSize / 2);

  // Reserve center area
  const reservedKeys = new Set<string>();
  for (let r = center - 1; r <= center; r++) {
    for (let c = center - 1; c <= center; c++) {
      reservedKeys.add(`${r},${c}`);
    }
  }

  let attempts = 0;
  while (positions.length < count && attempts < 200) {
    attempts++;
    const r = rng.nextInt(0, gridSize - 1);
    const c = rng.nextInt(0, gridSize - 1);
    const key = `${r},${c}`;

    if (!used.has(key) && !reservedKeys.has(key)) {
      used.add(key);
      positions.push({ row: r, col: c });
    }
  }

  return positions;
}

// ---------------------------------------------------------------------------
// Completion Tracking
// ---------------------------------------------------------------------------

/**
 * Check if the daily challenge for a specific date has been completed.
 *
 * @param dateStr        - The date to check (YYYY-MM-DD format).
 * @param completedDates - Array of previously completed date strings.
 */
export function isDailyChallengeCompleted(
  dateStr: string,
  completedDates: string[],
): boolean {
  return completedDates.includes(dateStr);
}

/**
 * Calculate the current streak of consecutive daily challenge completions.
 *
 * Counts backward from today (or the most recent completed date) to find
 * the longest consecutive run.
 *
 * @param completedDates - Array of completed date strings (YYYY-MM-DD), need not be sorted.
 * @returns The current streak count.
 */
export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  // Sort dates in descending order
  const sorted = [...completedDates].sort().reverse();

  // Start from today
  const today = new Date(getTodayString() + 'T00:00:00');
  let streak = 0;
  let currentDate = today;

  for (let i = 0; i < 365; i++) {
    const dateStr = formatDate(currentDate);
    if (sorted.includes(dateStr)) {
      streak++;
      // Move to previous day
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Format a Date object as YYYY-MM-DD.
 */
function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

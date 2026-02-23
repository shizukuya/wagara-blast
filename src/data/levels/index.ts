// =============================================================================
// Wagara Blast - Level Definitions (Levels 1-15)
// =============================================================================
//
// Progression design:
//   Lv1-3:   Tutorial / pure placement (no obstacles, small grid)
//   Lv4-5:   Introduce stone obstacles
//   Lv6-7:   Introduce kintsugi (gold crack) lines
//   Lv8-9:   Introduce frozen cells
//   Lv10-11:  Introduce chain obstacles
//   Lv12-13:  Introduce fog
//   Lv14-15:  Mix of all obstacles
// =============================================================================

import { LevelConfig } from '@/types';

const level1: LevelConfig = {
  id: 1,
  gridSize: 8,
  clearCondition: { type: 'score', target: 500 },
  starThresholds: [500, 800, 1200],
  obstacles: [],
  description: 'Welcome to Wagara Blast! Clear lines by filling rows or columns.',
  newWagara: 'ichimatsu',
};

const level2: LevelConfig = {
  id: 2,
  gridSize: 8,
  clearCondition: { type: 'score', target: 800 },
  starThresholds: [800, 1200, 1800],
  obstacles: [],
  description: 'Keep placing pieces to build combos!',
  newWagara: 'asanoha',
};

const level3: LevelConfig = {
  id: 3,
  gridSize: 8,
  clearCondition: { type: 'score', target: 1200 },
  starThresholds: [1200, 1800, 2500],
  obstacles: [],
  description: 'Try clearing multiple lines at once for bonus points!',
  newWagara: 'seigaiha',
};

const level4: LevelConfig = {
  id: 4,
  gridSize: 8,
  clearCondition: { type: 'score', target: 1500 },
  starThresholds: [1500, 2200, 3000],
  obstacles: [
    {
      type: 'stone',
      positions: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 4, col: 3 },
        { row: 4, col: 4 },
      ],
    },
  ],
  description: 'Stone blocks cannot be moved or placed on. Work around them!',
  newObstacle: 'stone',
  newWagara: 'shippou',
};

const level5: LevelConfig = {
  id: 5,
  gridSize: 8,
  clearCondition: { type: 'score', target: 2000 },
  starThresholds: [2000, 3000, 4000],
  obstacles: [
    {
      type: 'stone',
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 7 },
        { row: 7, col: 0 },
        { row: 7, col: 7 },
        { row: 3, col: 3 },
        { row: 4, col: 4 },
      ],
    },
  ],
  description: 'More stones! Plan your placements carefully.',
};

const level6: LevelConfig = {
  id: 6,
  gridSize: 8,
  clearCondition: { type: 'score', target: 2500 },
  starThresholds: [2500, 3500, 5000],
  obstacles: [
    {
      type: 'kintsugi',
      positions: [
        { row: 3, col: 0 },
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
      ],
    },
  ],
  description: 'Kintsugi lines glow with gold. Clear them for double score!',
  newObstacle: 'kintsugi',
  newWagara: 'yagasuri',
};

const level7: LevelConfig = {
  id: 7,
  gridSize: 8,
  clearCondition: { type: 'score', target: 3000 },
  starThresholds: [3000, 4500, 6000],
  obstacles: [
    {
      type: 'kintsugi',
      positions: [
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        { row: 2, col: 6 },
        { row: 2, col: 7 },
      ],
    },
    {
      type: 'kintsugi',
      positions: [
        { row: 5, col: 0 },
        { row: 5, col: 1 },
        { row: 5, col: 2 },
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
      ],
    },
    {
      type: 'stone',
      positions: [
        { row: 0, col: 0 },
        { row: 7, col: 7 },
      ],
    },
  ],
  description: 'Two kintsugi lines and stones. Aim for the gold!',
};

const level8: LevelConfig = {
  id: 8,
  gridSize: 8,
  clearCondition: { type: 'score', target: 3500 },
  starThresholds: [3500, 5000, 7000],
  obstacles: [
    {
      type: 'frozen',
      positions: [
        { row: 1, col: 1 },
        { row: 1, col: 6 },
        { row: 6, col: 1 },
        { row: 6, col: 6 },
      ],
      frozenTurns: 3,
    },
  ],
  description: 'Frozen cells thaw after a few turns. Be patient!',
  newObstacle: 'frozen',
  newWagara: 'kikkou',
};

const level9: LevelConfig = {
  id: 9,
  gridSize: 8,
  clearCondition: { type: 'score', target: 4000 },
  starThresholds: [4000, 6000, 8000],
  obstacles: [
    {
      type: 'frozen',
      positions: [
        { row: 2, col: 2 },
        { row: 2, col: 5 },
        { row: 5, col: 2 },
        { row: 5, col: 5 },
        { row: 3, col: 3 },
        { row: 4, col: 4 },
      ],
      frozenTurns: 4,
    },
    {
      type: 'stone',
      positions: [
        { row: 0, col: 3 },
        { row: 0, col: 4 },
      ],
    },
  ],
  description: 'Frozen and stone mixed. Timing is everything!',
};

const level10: LevelConfig = {
  id: 10,
  gridSize: 8,
  clearCondition: { type: 'score', target: 5000 },
  starThresholds: [5000, 7500, 10000],
  obstacles: [
    {
      type: 'chain',
      positions: [
        { row: 3, col: 0 },
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
      ],
      chainHP: 2,
    },
  ],
  description: 'Chain cells break when adjacent lines are cleared. Hit them twice!',
  newObstacle: 'chain',
  newWagara: 'uroko',
};

const level11: LevelConfig = {
  id: 11,
  gridSize: 8,
  clearCondition: { type: 'score', target: 5500 },
  starThresholds: [5500, 8000, 11000],
  obstacles: [
    {
      type: 'chain',
      positions: [
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        { row: 5, col: 2 },
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
      ],
      chainHP: 3,
    },
    {
      type: 'stone',
      positions: [
        { row: 4, col: 0 },
        { row: 4, col: 7 },
      ],
    },
  ],
  description: 'Stronger chains! Clear adjacent lines to weaken them.',
};

const level12: LevelConfig = {
  id: 12,
  gridSize: 8,
  clearCondition: { type: 'score', target: 6000 },
  starThresholds: [6000, 9000, 12000],
  obstacles: [
    {
      type: 'fog',
      positions: [
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        { row: 2, col: 5 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 4, col: 2 },
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 5, col: 2 },
        { row: 5, col: 3 },
        { row: 5, col: 4 },
        { row: 5, col: 5 },
      ],
    },
  ],
  description: 'Fog hides the grid! Place pieces nearby to reveal hidden cells.',
  newObstacle: 'fog',
};

const level13: LevelConfig = {
  id: 13,
  gridSize: 8,
  clearCondition: { type: 'score', target: 7000 },
  starThresholds: [7000, 10000, 14000],
  obstacles: [
    {
      type: 'fog',
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
        { row: 6, col: 5 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
        { row: 7, col: 5 },
        { row: 7, col: 6 },
        { row: 7, col: 7 },
      ],
    },
    {
      type: 'frozen',
      positions: [
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 4, col: 3 },
        { row: 4, col: 4 },
      ],
      frozenTurns: 3,
    },
  ],
  description: 'Fog and ice! Clear the mist and wait for the thaw.',
};

const level14: LevelConfig = {
  id: 14,
  gridSize: 8,
  clearCondition: { type: 'score', target: 8000 },
  starThresholds: [8000, 12000, 16000],
  obstacles: [
    {
      type: 'stone',
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 7 },
        { row: 7, col: 0 },
        { row: 7, col: 7 },
      ],
    },
    {
      type: 'kintsugi',
      positions: [
        { row: 4, col: 0 },
        { row: 4, col: 1 },
        { row: 4, col: 2 },
        { row: 4, col: 3 },
        { row: 4, col: 4 },
        { row: 4, col: 5 },
        { row: 4, col: 6 },
        { row: 4, col: 7 },
      ],
    },
    {
      type: 'chain',
      positions: [
        { row: 2, col: 3 },
        { row: 2, col: 4 },
        { row: 5, col: 3 },
        { row: 5, col: 4 },
      ],
      chainHP: 2,
    },
    {
      type: 'frozen',
      positions: [
        { row: 6, col: 3 },
        { row: 6, col: 4 },
      ],
      frozenTurns: 3,
    },
  ],
  description: 'The gauntlet begins! Multiple obstacle types in one level.',
};

const level15: LevelConfig = {
  id: 15,
  gridSize: 8,
  clearCondition: { type: 'score', target: 10000 },
  starThresholds: [10000, 15000, 20000],
  maxMoves: 30,
  obstacles: [
    {
      type: 'stone',
      positions: [
        { row: 0, col: 0 },
        { row: 0, col: 7 },
        { row: 7, col: 0 },
        { row: 7, col: 7 },
      ],
    },
    {
      type: 'kintsugi',
      positions: [
        { row: 3, col: 0 },
        { row: 3, col: 1 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 3, col: 5 },
        { row: 3, col: 6 },
        { row: 3, col: 7 },
      ],
    },
    {
      type: 'chain',
      positions: [
        { row: 1, col: 3 },
        { row: 1, col: 4 },
        { row: 6, col: 3 },
        { row: 6, col: 4 },
      ],
      chainHP: 3,
    },
    {
      type: 'frozen',
      positions: [
        { row: 5, col: 1 },
        { row: 5, col: 6 },
      ],
      frozenTurns: 4,
    },
    {
      type: 'fog',
      positions: [
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 6 },
        { row: 1, col: 7 },
        { row: 6, col: 0 },
        { row: 6, col: 1 },
        { row: 6, col: 6 },
        { row: 6, col: 7 },
      ],
    },
  ],
  description: 'The ultimate challenge! All obstacles, limited moves. Master the wagara!',
};

// ---------------------------------------------------------------------------
// Exported arrays and helpers
// ---------------------------------------------------------------------------

export const LEVELS: LevelConfig[] = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
  level11,
  level12,
  level13,
  level14,
  level15,
];

export const MAX_LEVEL_ID = 15;

/**
 * Get a level by its ID (1-based).
 * Returns undefined if the level does not exist.
 */
export function getLevelById(id: number): LevelConfig | undefined {
  return LEVELS.find((l) => l.id === id);
}

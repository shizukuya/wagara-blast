// =============================================================================
// Wagara Blast - Obstacle Type Definitions
// =============================================================================

import { ObstacleType, ObstacleDefinition } from '@/types';

// ---------------------------------------------------------------------------
// All six obstacle types with full bilingual descriptions
// ---------------------------------------------------------------------------

export const OBSTACLE_DEFINITIONS: Record<ObstacleType, ObstacleDefinition> = {
  // -------------------------------------------------------------------------
  // 1. Stone -- Immovable rock that blocks placement
  // -------------------------------------------------------------------------
  stone: {
    type: 'stone',
    nameJa: '石',
    nameEn: 'Stone',
    descriptionJa:
      '動かせない岩。ブロックを置くことができず、ライン消去でも破壊できない。ストーンブレーカーブースターでのみ除去可能。',
    descriptionEn:
      'An immovable rock. Blocks cannot be placed on it and it cannot be destroyed by line clears. Can only be removed with the Stone Breaker booster.',
    destructible: false,
    hitsRequired: 0,
    blocksPlacement: true,
  },

  // -------------------------------------------------------------------------
  // 2. Kintsugi -- Cracked stone that breaks after adjacent line clears
  // -------------------------------------------------------------------------
  kintsugi: {
    type: 'kintsugi',
    nameJa: '金継ぎ',
    nameEn: 'Kintsugi',
    descriptionJa:
      'ひび割れた石。隣接するラインを消去すると1段階修復され、2回の隣接ライン消去で美しく砕け散る。金継ぎの精神を体現した障害物。',
    descriptionEn:
      'A cracked stone. Clearing an adjacent line repairs it by one stage, and it shatters beautifully after 2 adjacent line clears. Embodies the spirit of kintsugi (golden repair).',
    destructible: true,
    hitsRequired: 2,
    blocksPlacement: true,
  },

  // -------------------------------------------------------------------------
  // 3. Frozen -- Ice that thaws over turns
  // -------------------------------------------------------------------------
  frozen: {
    type: 'frozen',
    nameJa: '氷結',
    nameEn: 'Frozen',
    descriptionJa:
      '氷に覆われたセル。既に置かれたブロックが凍結され、ライン消去の対象にならない。数ターン経過するか、隣接するライン消去で解凍される。',
    descriptionEn:
      'A cell covered in ice. An already-placed block becomes frozen and cannot be included in line clears. It thaws after a set number of turns or when an adjacent line is cleared.',
    destructible: true,
    hitsRequired: 1,
    blocksPlacement: false,
  },

  // -------------------------------------------------------------------------
  // 4. Chain -- Chained cell requiring multiple hits to free
  // -------------------------------------------------------------------------
  chain: {
    type: 'chain',
    nameJa: '鎖',
    nameEn: 'Chain',
    descriptionJa:
      '鎖で縛られたセル。ブロックを置くことはできるが、鎖が残っている間はライン消去にカウントされない。隣接ライン消去で鎖のHPを1ずつ減らし、HPが0になると解放される。',
    descriptionEn:
      'A cell bound by chains. Blocks can be placed on it, but it does not count toward line clears while chained. Each adjacent line clear reduces the chain HP by 1, and the cell is freed when HP reaches 0.',
    destructible: true,
    hitsRequired: 3,
    blocksPlacement: false,
  },

  // -------------------------------------------------------------------------
  // 5. Fog -- Hidden cell contents
  // -------------------------------------------------------------------------
  fog: {
    type: 'fog',
    nameJa: '霧',
    nameEn: 'Fog',
    descriptionJa:
      '霧に包まれたセル。セルの中身（空きか埋まっているか）が見えない。隣接するラインを消去するか、ブロックを隣に置くと霧が晴れる。',
    descriptionEn:
      'A cell shrouded in fog. The contents of the cell (empty or filled) are hidden. The fog clears when an adjacent line is cleared or a block is placed next to it.',
    destructible: true,
    hitsRequired: 1,
    blocksPlacement: false,
  },

  // -------------------------------------------------------------------------
  // 6. Rotate -- Rotates surrounding blocks
  // -------------------------------------------------------------------------
  rotate: {
    type: 'rotate',
    nameJa: '回転',
    nameEn: 'Rotate',
    descriptionJa:
      '回転する歯車。一定ターンごとに周囲8マスのブロックを時計回りに1マス回転させる。破壊はできないが、戦略的に利用できる。',
    descriptionEn:
      'A rotating gear. Every set number of turns, it rotates the blocks in the 8 surrounding cells clockwise by one position. Cannot be destroyed, but can be used strategically.',
    destructible: false,
    hitsRequired: 0,
    blocksPlacement: true,
  },
};

// ---------------------------------------------------------------------------
// Ordered array of all obstacle definitions
// ---------------------------------------------------------------------------

export const OBSTACLE_DEFINITIONS_LIST: ObstacleDefinition[] = [
  OBSTACLE_DEFINITIONS.stone,
  OBSTACLE_DEFINITIONS.kintsugi,
  OBSTACLE_DEFINITIONS.frozen,
  OBSTACLE_DEFINITIONS.chain,
  OBSTACLE_DEFINITIONS.fog,
  OBSTACLE_DEFINITIONS.rotate,
];

// ---------------------------------------------------------------------------
// All obstacle type keys
// ---------------------------------------------------------------------------

export const ALL_OBSTACLE_TYPES: ObstacleType[] = [
  'stone',
  'kintsugi',
  'frozen',
  'chain',
  'fog',
  'rotate',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get the full definition for an obstacle type.
 */
export function getObstacleDefinition(type: ObstacleType): ObstacleDefinition {
  return OBSTACLE_DEFINITIONS[type];
}

/**
 * Check whether an obstacle blocks piece placement.
 */
export function doesObstacleBlockPlacement(type: ObstacleType): boolean {
  return OBSTACLE_DEFINITIONS[type].blocksPlacement;
}

/**
 * Check whether an obstacle can eventually be destroyed.
 */
export function isObstacleDestructible(type: ObstacleType): boolean {
  return OBSTACLE_DEFINITIONS[type].destructible;
}

/**
 * Get the number of hits required to destroy an obstacle.
 * Returns 0 for indestructible obstacles.
 */
export function getObstacleHitsRequired(type: ObstacleType): number {
  return OBSTACLE_DEFINITIONS[type].hitsRequired;
}

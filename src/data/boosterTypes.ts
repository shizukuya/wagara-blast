// =============================================================================
// Wagara Blast - Booster Type Definitions
// =============================================================================

import { BoosterType, BoosterDefinition, BoosterInventory } from '@/types';

// ---------------------------------------------------------------------------
// All five booster types with full bilingual descriptions
// ---------------------------------------------------------------------------

export const BOOSTER_DEFINITIONS: Record<BoosterType, BoosterDefinition> = {
  // -------------------------------------------------------------------------
  // 1. Stone Breaker -- Destroys a single obstacle cell
  // -------------------------------------------------------------------------
  stoneBreaker: {
    type: 'stoneBreaker',
    nameJa: '石割りの槌',
    nameEn: 'Stone Breaker',
    descriptionJa:
      '選択したセルの障害物を1つ破壊する。石・金継ぎ・氷結・鎖・霧など、あらゆる障害物に有効。',
    descriptionEn:
      'Destroys one obstacle on the selected cell. Effective against all obstacle types including stone, kintsugi, frozen, chain, and fog.',
    coinCost: 50,
    icon: 'hammer',
  },

  // -------------------------------------------------------------------------
  // 2. Shuffle -- Re-randomize the current piece set
  // -------------------------------------------------------------------------
  shuffle: {
    type: 'shuffle',
    nameJa: '手替え',
    nameEn: 'Shuffle',
    descriptionJa:
      '現在の手持ちピースをすべて新しいランダムなピースに入れ替える。手詰まりの打開に有効。',
    descriptionEn:
      'Replaces all current pieces with a new random set. Useful for breaking out of a deadlock situation.',
    coinCost: 30,
    icon: 'shuffle',
  },

  // -------------------------------------------------------------------------
  // 3. Guide -- Shows optimal placement hint
  // -------------------------------------------------------------------------
  guide: {
    type: 'guide',
    nameJa: '導きの光',
    nameEn: 'Guide',
    descriptionJa:
      '最もスコアが高くなる配置を光で示す。ライン消去が可能な位置を優先的にハイライト表示する。',
    descriptionEn:
      'Highlights the placement that yields the highest score with a guiding light. Prioritizes positions where line clears are possible.',
    coinCost: 20,
    icon: 'lightbulb',
  },

  // -------------------------------------------------------------------------
  // 4. Lightning -- Clears an entire row
  // -------------------------------------------------------------------------
  lightning: {
    type: 'lightning',
    nameJa: '雷',
    nameEn: 'Lightning',
    descriptionJa:
      '選択した行を一列まるごと消去する。障害物も含めてすべてのセルをクリアする強力なブースター。',
    descriptionEn:
      'Clears an entire selected row completely. A powerful booster that clears all cells including obstacles.',
    coinCost: 80,
    icon: 'zap',
  },

  // -------------------------------------------------------------------------
  // 5. Wave -- Clears an entire column
  // -------------------------------------------------------------------------
  wave: {
    type: 'wave',
    nameJa: '波',
    nameEn: 'Wave',
    descriptionJa:
      '選択した列を一列まるごと消去する。障害物も含めてすべてのセルをクリアする強力なブースター。',
    descriptionEn:
      'Clears an entire selected column completely. A powerful booster that clears all cells including obstacles.',
    coinCost: 80,
    icon: 'waves',
  },
};

// ---------------------------------------------------------------------------
// Ordered array of all booster definitions
// ---------------------------------------------------------------------------

export const BOOSTER_DEFINITIONS_LIST: BoosterDefinition[] = [
  BOOSTER_DEFINITIONS.stoneBreaker,
  BOOSTER_DEFINITIONS.shuffle,
  BOOSTER_DEFINITIONS.guide,
  BOOSTER_DEFINITIONS.lightning,
  BOOSTER_DEFINITIONS.wave,
];

// ---------------------------------------------------------------------------
// All booster type keys
// ---------------------------------------------------------------------------

export const ALL_BOOSTER_TYPES: BoosterType[] = [
  'stoneBreaker',
  'shuffle',
  'guide',
  'lightning',
  'wave',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create a default (empty) booster inventory with zero of each type.
 */
export function createDefaultBoosterInventory(): BoosterInventory {
  return {
    stoneBreaker: 0,
    shuffle: 0,
    guide: 0,
    lightning: 0,
    wave: 0,
  };
}

/**
 * Create a starter booster inventory given to new players.
 */
export function createStarterBoosterInventory(): BoosterInventory {
  return {
    stoneBreaker: 3,
    shuffle: 3,
    guide: 5,
    lightning: 1,
    wave: 1,
  };
}

/**
 * Get the full definition for a booster type.
 */
export function getBoosterDefinition(type: BoosterType): BoosterDefinition {
  return BOOSTER_DEFINITIONS[type];
}

/**
 * Get the coin cost for using a booster.
 */
export function getBoosterCost(type: BoosterType): number {
  return BOOSTER_DEFINITIONS[type].coinCost;
}

/**
 * Check whether the player has at least one of the given booster.
 */
export function hasBooster(
  inventory: BoosterInventory,
  type: BoosterType,
): boolean {
  return inventory[type] > 0;
}

/**
 * Consume one use of a booster from the inventory.
 * Returns a new inventory object (does not mutate).
 * Throws if the player has none remaining.
 */
export function consumeBooster(
  inventory: BoosterInventory,
  type: BoosterType,
): BoosterInventory {
  if (inventory[type] <= 0) {
    throw new Error(
      `Cannot consume booster "${type}": none remaining in inventory.`,
    );
  }
  return {
    ...inventory,
    [type]: inventory[type] - 1,
  };
}

/**
 * Add boosters to the inventory.
 * Returns a new inventory object (does not mutate).
 */
export function addBoosters(
  inventory: BoosterInventory,
  type: BoosterType,
  count: number,
): BoosterInventory {
  return {
    ...inventory,
    [type]: inventory[type] + count,
  };
}

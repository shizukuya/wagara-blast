// =============================================================================
// Wagara Blast - Wagara Pattern Type Definitions & Color Schemes
// =============================================================================

import { WagaraType, WagaraDefinition, WagaraColorScheme } from '@/types';

// ---------------------------------------------------------------------------
// Color palettes for each wagara pattern
// ---------------------------------------------------------------------------

export const WAGARA_COLORS: Record<WagaraType, WagaraColorScheme> = {
  ichimatsu: { primary: '#2D5A3D', secondary: '#1A1A1A' }, // green x black
  asanoha: { primary: '#E8A0BF', secondary: '#D4789F' },    // pink
  seigaiha: { primary: '#3A6EA5', secondary: '#2A5080' },   // blue
  shippou: { primary: '#7B5EA7', secondary: '#5E3D8A' },    // purple
  yagasuri: { primary: '#C41E3A', secondary: '#9B1830' },   // red
  kikkou: { primary: '#C9A84C', secondary: '#A88B2F' },     // gold
  uroko: { primary: '#E07B3C', secondary: '#C06028' },      // orange
};

// ---------------------------------------------------------------------------
// Frequency weights (higher = more common in random selection)
// ---------------------------------------------------------------------------

export const WAGARA_FREQUENCIES: Record<WagaraType, number> = {
  ichimatsu: 5,
  asanoha: 4,
  seigaiha: 4,
  shippou: 3,
  yagasuri: 3,
  kikkou: 2,
  uroko: 2,
};

// ---------------------------------------------------------------------------
// Full definitions
// ---------------------------------------------------------------------------

export const WAGARA_DEFINITIONS: WagaraDefinition[] = [
  {
    type: 'ichimatsu',
    nameJa: '市松',
    nameEn: 'Ichimatsu',
    colors: WAGARA_COLORS.ichimatsu,
    frequency: WAGARA_FREQUENCIES.ichimatsu,
  },
  {
    type: 'asanoha',
    nameJa: '麻の葉',
    nameEn: 'Asanoha',
    colors: WAGARA_COLORS.asanoha,
    frequency: WAGARA_FREQUENCIES.asanoha,
  },
  {
    type: 'seigaiha',
    nameJa: '青海波',
    nameEn: 'Seigaiha',
    colors: WAGARA_COLORS.seigaiha,
    frequency: WAGARA_FREQUENCIES.seigaiha,
  },
  {
    type: 'shippou',
    nameJa: '七宝',
    nameEn: 'Shippou',
    colors: WAGARA_COLORS.shippou,
    frequency: WAGARA_FREQUENCIES.shippou,
  },
  {
    type: 'yagasuri',
    nameJa: '矢絣',
    nameEn: 'Yagasuri',
    colors: WAGARA_COLORS.yagasuri,
    frequency: WAGARA_FREQUENCIES.yagasuri,
  },
  {
    type: 'kikkou',
    nameJa: '亀甲',
    nameEn: 'Kikkou',
    colors: WAGARA_COLORS.kikkou,
    frequency: WAGARA_FREQUENCIES.kikkou,
  },
  {
    type: 'uroko',
    nameJa: '鱗',
    nameEn: 'Uroko',
    colors: WAGARA_COLORS.uroko,
    frequency: WAGARA_FREQUENCIES.uroko,
  },
];

// ---------------------------------------------------------------------------
// Ordered list of all WagaraType values (convenience)
// ---------------------------------------------------------------------------

export const ALL_WAGARA_TYPES: WagaraType[] = [
  'ichimatsu',
  'asanoha',
  'seigaiha',
  'shippou',
  'yagasuri',
  'kikkou',
  'uroko',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a weighted pool array from which a random wagara type can be selected
 * via a single Math.random() index.
 *
 * Example: ichimatsu (freq 5) appears 5 times in the pool, uroko (freq 2)
 * appears 2 times, etc.
 */
export function buildWeightedWagaraPool(): WagaraType[] {
  const pool: WagaraType[] = [];
  for (const def of WAGARA_DEFINITIONS) {
    for (let i = 0; i < def.frequency; i++) {
      pool.push(def.type);
    }
  }
  return pool;
}

/**
 * Pick a random wagara type respecting frequency weights.
 */
export function randomWagaraType(): WagaraType {
  const pool = buildWeightedWagaraPool();
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get the WagaraDefinition for a given type.
 */
export function getWagaraDefinition(
  type: WagaraType,
): WagaraDefinition | undefined {
  return WAGARA_DEFINITIONS.find((d) => d.type === type);
}

// =============================================================================
// Wagara Blast - Sound Manifest (SE01-SE14, BGM01-BGM04)
// =============================================================================

import { SoundId, SoundManifestEntry } from '@/types';

// ---------------------------------------------------------------------------
// Complete sound manifest -- maps every SoundId to its asset path and metadata
// ---------------------------------------------------------------------------

export const SOUND_MANIFEST: Record<SoundId, SoundManifestEntry> = {
  // =========================================================================
  // Sound Effects (SE01 - SE14)
  // =========================================================================

  /** SE01 -- Piece pickup / drag start */
  SE01: {
    id: 'SE01',
    path: 'audio/se/se01_pickup.mp3',
    label: 'Piece Pickup',
    isMusic: false,
    loop: false,
    volume: 0.8,
  },

  /** SE02 -- Piece hover over valid cell */
  SE02: {
    id: 'SE02',
    path: 'audio/se/se02_hover.mp3',
    label: 'Hover (Valid)',
    isMusic: false,
    loop: false,
    volume: 0.5,
  },

  /** SE03 -- Piece placed successfully */
  SE03: {
    id: 'SE03',
    path: 'audio/se/se03_place.mp3',
    label: 'Place Block',
    isMusic: false,
    loop: false,
    volume: 0.9,
  },

  /** SE04 -- Invalid drop / cannot place */
  SE04: {
    id: 'SE04',
    path: 'audio/se/se04_invalid.mp3',
    label: 'Invalid Drop',
    isMusic: false,
    loop: false,
    volume: 0.7,
  },

  /** SE05 -- Single line clear */
  SE05: {
    id: 'SE05',
    path: 'audio/se/se05_line_clear.mp3',
    label: 'Line Clear',
    isMusic: false,
    loop: false,
    volume: 1.0,
  },

  /** SE06 -- Combo line clear (2x) */
  SE06: {
    id: 'SE06',
    path: 'audio/se/se06_combo.mp3',
    label: 'Combo',
    isMusic: false,
    loop: false,
    volume: 1.0,
  },

  /** SE07 -- Super combo (3x+) */
  SE07: {
    id: 'SE07',
    path: 'audio/se/se07_super_combo.mp3',
    label: 'Super Combo',
    isMusic: false,
    loop: false,
    volume: 1.0,
  },

  /** SE08 -- Chain break / obstacle destroyed */
  SE08: {
    id: 'SE08',
    path: 'audio/se/se08_chain_break.mp3',
    label: 'Chain Break',
    isMusic: false,
    loop: false,
    volume: 0.9,
  },

  /** SE09 -- Booster activated */
  SE09: {
    id: 'SE09',
    path: 'audio/se/se09_booster.mp3',
    label: 'Booster Activate',
    isMusic: false,
    loop: false,
    volume: 0.9,
  },

  /** SE10 -- Level clear / star earned */
  SE10: {
    id: 'SE10',
    path: 'audio/se/se10_level_clear.mp3',
    label: 'Level Clear',
    isMusic: false,
    loop: false,
    volume: 1.0,
  },

  /** SE11 -- Game over */
  SE11: {
    id: 'SE11',
    path: 'audio/se/se11_game_over.mp3',
    label: 'Game Over',
    isMusic: false,
    loop: false,
    volume: 0.8,
  },

  /** SE12 -- UI button tap */
  SE12: {
    id: 'SE12',
    path: 'audio/se/se12_button_tap.mp3',
    label: 'Button Tap',
    isMusic: false,
    loop: false,
    volume: 0.6,
  },

  /** SE13 -- New wagara discovered */
  SE13: {
    id: 'SE13',
    path: 'audio/se/se13_discovery.mp3',
    label: 'Wagara Discovery',
    isMusic: false,
    loop: false,
    volume: 1.0,
  },

  /** SE14 -- Coin earned / purchase */
  SE14: {
    id: 'SE14',
    path: 'audio/se/se14_coin.mp3',
    label: 'Coin',
    isMusic: false,
    loop: false,
    volume: 0.7,
  },

  // =========================================================================
  // Background Music (BGM01 - BGM04)
  // =========================================================================

  /** BGM01 -- Main menu / home screen */
  BGM01: {
    id: 'BGM01',
    path: 'audio/bgm/bgm01_menu.mp3',
    label: 'Menu BGM',
    isMusic: true,
    loop: true,
    volume: 0.4,
  },

  /** BGM02 -- Classic mode gameplay */
  BGM02: {
    id: 'BGM02',
    path: 'audio/bgm/bgm02_classic.mp3',
    label: 'Classic Mode BGM',
    isMusic: true,
    loop: true,
    volume: 0.35,
  },

  /** BGM03 -- Level mode gameplay */
  BGM03: {
    id: 'BGM03',
    path: 'audio/bgm/bgm03_level.mp3',
    label: 'Level Mode BGM',
    isMusic: true,
    loop: true,
    volume: 0.35,
  },

  /** BGM04 -- Daily challenge gameplay */
  BGM04: {
    id: 'BGM04',
    path: 'audio/bgm/bgm04_daily.mp3',
    label: 'Daily Challenge BGM',
    isMusic: true,
    loop: true,
    volume: 0.35,
  },
};

// ---------------------------------------------------------------------------
// Convenience arrays
// ---------------------------------------------------------------------------

/** All sound-effect entries. */
export const SE_ENTRIES: SoundManifestEntry[] = Object.values(
  SOUND_MANIFEST,
).filter((e) => !e.isMusic);

/** All background-music entries. */
export const BGM_ENTRIES: SoundManifestEntry[] = Object.values(
  SOUND_MANIFEST,
).filter((e) => e.isMusic);

/** All sound IDs (SE + BGM). */
export const ALL_SOUND_IDS: SoundId[] = Object.keys(SOUND_MANIFEST) as SoundId[];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Get the manifest entry for a given sound ID.
 */
export function getSoundEntry(id: SoundId): SoundManifestEntry {
  return SOUND_MANIFEST[id];
}

/**
 * Get the asset path for a given sound ID.
 */
export function getSoundPath(id: SoundId): string {
  return SOUND_MANIFEST[id].path;
}

/**
 * Get the default volume for a given sound ID.
 */
export function getSoundVolume(id: SoundId): number {
  return SOUND_MANIFEST[id].volume;
}

/**
 * Mapping from FeedbackEvent types to their corresponding SoundIds.
 * Used by the feedback system to play appropriate sounds.
 */
export const FEEDBACK_SOUND_MAP: Record<string, SoundId> = {
  pickup: 'SE01',
  hover: 'SE02',
  place: 'SE03',
  invalidDrop: 'SE04',
  lineClear: 'SE05',
  combo: 'SE06',
  superCombo: 'SE07',
  chain: 'SE08',
  levelClear: 'SE10',
  gameOver: 'SE11',
};

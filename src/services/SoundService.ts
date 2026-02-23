// =============================================================================
// Sound Service - Audio playback via expo-audio
// =============================================================================
import { createAudioPlayer } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio/build/AudioModule.types';

// ---------------------------------------------------------------------------
// Sound manifest: maps SoundId to require() asset references
// ---------------------------------------------------------------------------

const soundManifest: Record<string, number> = {
  // Sound Effects
  SE01: require('../assets/sounds/SE01_pick_up.wav'),
  SE02: require('../assets/sounds/SE02_hover_tick.wav'),
  SE03: require('../assets/sounds/SE03_snap_place.wav'),
  SE04: require('../assets/sounds/SE04_invalid_drop.wav'),
  SE05: require('../assets/sounds/SE05_line_clear.wav'),
  SE06: require('../assets/sounds/SE06_combo_2.wav'),
  SE07: require('../assets/sounds/SE07_combo_3.wav'),
  SE08: require('../assets/sounds/SE08_chain_up.wav'),
  SE09: require('../assets/sounds/SE09_score_pop.wav'),
  SE10: require('../assets/sounds/SE10_level_clear.wav'),
  SE11: require('../assets/sounds/SE11_game_over.wav'),
  SE12: require('../assets/sounds/SE12_star_appear.wav'),
  SE13: require('../assets/sounds/SE13_button_tap.wav'),
  SE14: require('../assets/sounds/SE14_booster_use.wav'),
  // Background Music
  BGM01: require('../assets/sounds/BGM01_classic.wav'),
  BGM02: require('../assets/sounds/BGM02_level.wav'),
  BGM03: require('../assets/sounds/BGM03_daily.wav'),
  BGM04: require('../assets/sounds/BGM04_menu.wav'),
};

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

/** Cache of preloaded AudioPlayer instances for SE (keyed by SoundId). */
const loadedSounds: Map<string, AudioPlayer> = new Map();

/** Currently playing BGM player (only one at a time). */
let currentBGM: AudioPlayer | null = null;
let currentBGMId: string | null = null;

/** Global volume multipliers (0..1). */
let seVolume = 1.0;
let bgmVolume = 0.5; // BGM at 50% of SE by default

/** Master enable flag (toggled by settings). */
let enabled = true;

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const SoundService = {
  /**
   * Preload all SE sound files into memory for instant playback.
   * Should be called once during app startup.
   */
  preloadSounds: async (): Promise<void> => {
    const seIds = Object.keys(soundManifest).filter((id) =>
      id.startsWith('SE'),
    );

    for (const id of seIds) {
      try {
        const player = createAudioPlayer(soundManifest[id]);
        loadedSounds.set(id, player);
      } catch (err) {
        console.warn(`[SoundService] Failed to preload ${id}:`, err);
      }
    }

    console.log(
      `[SoundService] Preloaded ${loadedSounds.size}/${seIds.length} SE sounds`,
    );
  },

  /**
   * Play a sound effect by its SoundId (e.g. 'SE03').
   * Fires and forgets.
   */
  playSound: (id: string): void => {
    if (!enabled) return;

    const player = loadedSounds.get(id);
    if (!player) {
      console.warn(`[SoundService] Sound not loaded: ${id}`);
      return;
    }

    try {
      player.seekTo(0);
      player.volume = seVolume;
      player.play();
    } catch (err) {
      console.warn(`[SoundService] Error playing ${id}:`, err);
    }
  },

  /**
   * Start playing background music on loop.
   * Stops any currently playing BGM first.
   */
  playBGM: (id: string): void => {
    if (!enabled) return;
    if (currentBGMId === id && currentBGM) return;

    SoundService.stopBGM();

    const asset = soundManifest[id];
    if (!asset) {
      console.warn(`[SoundService] BGM asset not found: ${id}`);
      return;
    }

    try {
      const player = createAudioPlayer(asset);
      player.volume = bgmVolume;
      player.loop = true;
      player.play();
      currentBGM = player;
      currentBGMId = id;
    } catch (err) {
      console.warn(`[SoundService] Error playing BGM ${id}:`, err);
    }
  },

  /** Stop the currently playing BGM. */
  stopBGM: (): void => {
    if (currentBGM) {
      try {
        currentBGM.remove();
      } catch {
        // Ignore cleanup errors
      }
      currentBGM = null;
      currentBGMId = null;
    }
  },

  /** Set the SE volume (0..1). */
  setVolume: (volume: number): void => {
    seVolume = Math.max(0, Math.min(1, volume));
  },

  /** Set the BGM volume (0..1). Also updates the live player if any. */
  setBGMVolume: (volume: number): void => {
    bgmVolume = Math.max(0, Math.min(1, volume));
    if (currentBGM) {
      currentBGM.volume = bgmVolume;
    }
  },

  /** Enable or disable all sound playback. */
  setEnabled: (value: boolean): void => {
    enabled = value;
    if (!enabled) {
      SoundService.stopBGM();
    }
  },

  /** Release all loaded sounds to free memory. */
  cleanup: (): void => {
    SoundService.stopBGM();
    loadedSounds.forEach((player) => {
      try {
        player.remove();
      } catch {
        // Ignore
      }
    });
    loadedSounds.clear();
  },
};

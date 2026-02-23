// =============================================================================
// Feedback Service - Orchestrates Sound + Haptic + Animation hints
// =============================================================================
import type { FeedbackEvent } from '../types';
import { SoundService } from './SoundService';
import { HapticService } from './HapticService';

// ---------------------------------------------------------------------------
// Animation hint type (returned so the caller / UI layer can trigger visuals)
// ---------------------------------------------------------------------------

export interface AnimationHint {
  /** Type of visual effect to play. */
  type:
    | 'none'
    | 'flash'
    | 'shake'
    | 'pulse'
    | 'ripple'
    | 'confetti'
    | 'glow';
  /** Intensity multiplier (0..1). */
  intensity: number;
  /** Duration hint in milliseconds. */
  durationMs: number;
}

// ---------------------------------------------------------------------------
// Event -> action mapping
// ---------------------------------------------------------------------------

function mapFeedback(event: FeedbackEvent): {
  sound: string | null;
  haptic: (() => void) | null;
  animation: AnimationHint;
} {
  const { type, comboCount } = event;

  switch (type) {
    case 'pickup':
      return {
        sound: 'SE01',
        haptic: () => HapticService.pickup(),
        animation: { type: 'pulse', intensity: 0.3, durationMs: 150 },
      };

    case 'hover':
      return {
        sound: 'SE02',
        haptic: () => HapticService.hoverTick(),
        animation: { type: 'none', intensity: 0, durationMs: 0 },
      };

    case 'place':
      return {
        sound: 'SE03',
        haptic: () => HapticService.place(),
        animation: { type: 'ripple', intensity: 0.5, durationMs: 200 },
      };

    case 'invalidDrop':
      return {
        sound: 'SE04',
        haptic: () => HapticService.invalidDrop(),
        animation: { type: 'shake', intensity: 0.6, durationMs: 300 },
      };

    case 'lineClear':
      return {
        sound: 'SE05',
        haptic: () => HapticService.lineClear(),
        animation: { type: 'flash', intensity: 0.7, durationMs: 350 },
      };

    case 'combo': {
      const count = comboCount ?? 2;
      // Scale the sound: combo 2 -> SE06, combo 3+ -> SE07
      const soundId = count >= 3 ? 'SE07' : 'SE06';
      return {
        sound: soundId,
        haptic: () => HapticService.combo(count),
        animation: {
          type: 'pulse',
          intensity: Math.min(1, 0.4 + count * 0.15),
          durationMs: 200 + count * 80,
        },
      };
    }

    case 'superCombo':
      return {
        sound: 'SE07',
        haptic: () => HapticService.superCombo(),
        animation: { type: 'confetti', intensity: 1.0, durationMs: 800 },
      };

    case 'chain':
      return {
        sound: 'SE08',
        haptic: () => HapticService.lineClear(),
        animation: { type: 'glow', intensity: 0.6, durationMs: 300 },
      };

    case 'levelClear':
      return {
        sound: 'SE10',
        haptic: () => HapticService.levelClear(),
        animation: { type: 'confetti', intensity: 1.0, durationMs: 1200 },
      };

    case 'gameOver':
      return {
        sound: 'SE11',
        haptic: () => HapticService.gameOver(),
        animation: { type: 'shake', intensity: 0.8, durationMs: 600 },
      };

    default:
      return {
        sound: null,
        haptic: null,
        animation: { type: 'none', intensity: 0, durationMs: 0 },
      };
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const FeedbackService = {
  /**
   * Fire all three feedback layers simultaneously for the given event.
   * Returns an AnimationHint that the UI layer can use to trigger visuals.
   */
  fireFeedback: (event: FeedbackEvent): AnimationHint => {
    const { sound, haptic, animation } = mapFeedback(event);

    // Sound
    if (sound) {
      SoundService.playSound(sound);
    }

    // Haptic
    if (haptic) {
      haptic();
    }

    // Animation hint is returned for the caller to act on
    return animation;
  },
};

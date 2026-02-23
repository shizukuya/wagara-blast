// =============================================================================
// Haptic Service - Tactile feedback via expo-haptics
// =============================================================================
import * as Haptics from 'expo-haptics';

// ---------------------------------------------------------------------------
// Internal state
// ---------------------------------------------------------------------------

let enabled = true;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fire a haptic only if haptics are enabled. Silently catches any errors. */
function safeHaptic(fn: () => Promise<void>): void {
  if (!enabled) return;
  fn().catch(() => {
    // Haptics may fail on simulators or unsupported devices -- ignore.
  });
}

/** Delay helper for combo sequences. */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export const HapticService = {
  /** Light impact -- piece picked up from tray. */
  pickup: (): void => {
    safeHaptic(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
    );
  },

  /** Selection tick -- piece hovering over a new cell. */
  hoverTick: (): void => {
    safeHaptic(() => Haptics.selectionAsync());
  },

  /** Medium impact -- piece placed on grid (MOST IMPORTANT feedback). */
  place: (): void => {
    safeHaptic(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
    );
  },

  /** Error notification -- invalid drop position. */
  invalidDrop: (): void => {
    safeHaptic(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
    );
  },

  /** Heavy impact -- line(s) cleared. */
  lineClear: (): void => {
    safeHaptic(() =>
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
    );
  },

  /**
   * Combo feedback -- fires `count` heavy impacts with 80ms intervals.
   * Each successive tap reinforces the combo "feel".
   */
  combo: (count: number): void => {
    if (!enabled || count <= 0) return;

    (async () => {
      try {
        for (let i = 0; i < count; i++) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          if (i < count - 1) await delay(80);
        }
      } catch {
        // Ignore
      }
    })();
  },

  /** Success notification -- super combo (4+ lines at once). */
  superCombo: (): void => {
    safeHaptic(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    );
  },

  /** Success notification -- level cleared. */
  levelClear: (): void => {
    safeHaptic(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
    );
  },

  /** Warning notification -- game over. */
  gameOver: (): void => {
    safeHaptic(() =>
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
    );
  },

  /** Enable or disable haptic feedback globally. */
  setEnabled: (value: boolean): void => {
    enabled = value;
  },
};

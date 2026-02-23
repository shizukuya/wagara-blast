import { useCallback, useRef } from 'react';
import {
  useSharedValue,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { AnimationConfig } from '../utils/animations';

export interface GridAnimationState {
  // Screen shake
  shakeX: ReturnType<typeof useSharedValue<number>>;
  shakeY: ReturnType<typeof useSharedValue<number>>;
  // Line clear flash (row/col index -> opacity)
  flashOpacity: ReturnType<typeof useSharedValue<number>>;
  // Combo scale
  comboScale: ReturnType<typeof useSharedValue<number>>;
  comboOpacity: ReturnType<typeof useSharedValue<number>>;
}

export function useGridAnimation() {
  const shakeX = useSharedValue(0);
  const shakeY = useSharedValue(0);
  const flashOpacity = useSharedValue(0);
  const comboScale = useSharedValue(0);
  const comboOpacity = useSharedValue(0);

  // Track cells being cleared for flash effect
  const clearingCells = useRef<Set<string>>(new Set());

  const triggerShake = useCallback(
    (intensity: 'light' | 'medium' | 'heavy' = 'light') => {
      const config = AnimationConfig.shake[intensity];
      const a = config.amplitude;
      const d = config.duration / 6;

      shakeX.value = withSequence(
        withTiming(a, { duration: d }),
        withTiming(-a, { duration: d }),
        withTiming(a * 0.6, { duration: d }),
        withTiming(-a * 0.6, { duration: d }),
        withTiming(a * 0.2, { duration: d }),
        withTiming(0, { duration: d })
      );
      shakeY.value = withSequence(
        withTiming(-a * 0.5, { duration: d }),
        withTiming(a * 0.5, { duration: d }),
        withTiming(-a * 0.3, { duration: d }),
        withTiming(a * 0.3, { duration: d }),
        withTiming(0, { duration: d * 2 })
      );
    },
    [shakeX, shakeY]
  );

  const triggerFlash = useCallback(() => {
    flashOpacity.value = withSequence(
      withTiming(1, {
        duration: AnimationConfig.flash.duration,
        easing: AnimationConfig.flash.easing,
      }),
      withTiming(0, { duration: 200 })
    );
  }, [flashOpacity]);

  const triggerComboText = useCallback(
    (comboCount: number) => {
      comboScale.value = 0;
      comboOpacity.value = 1;
      comboScale.value = withSpring(1, {
        damping: 8,
        stiffness: 300,
        mass: 1,
      });
      comboOpacity.value = withDelay(
        800,
        withTiming(0, { duration: 300 })
      );
    },
    [comboScale, comboOpacity]
  );

  const triggerLineClear = useCallback(
    (rows: number[], cols: number[], onComplete?: () => void) => {
      // Flash then clear
      triggerFlash();

      // Shake based on number of lines
      const totalLines = rows.length + cols.length;
      if (totalLines >= 3) {
        triggerShake('heavy');
      } else if (totalLines >= 2) {
        triggerShake('medium');
      } else {
        triggerShake('light');
      }

      if (onComplete) {
        setTimeout(onComplete, 300);
      }
    },
    [triggerFlash, triggerShake]
  );

  return {
    shakeX,
    shakeY,
    flashOpacity,
    comboScale,
    comboOpacity,
    triggerShake,
    triggerFlash,
    triggerComboText,
    triggerLineClear,
    clearingCells,
  };
}

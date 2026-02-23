import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../stores/settingsStore';

export function useHaptics() {
  const enabled = useSettingsStore((s) => s.hapticsEnabled);

  const pickup = useCallback(() => {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [enabled]);

  const hoverTick = useCallback(() => {
    if (enabled) Haptics.selectionAsync();
  }, [enabled]);

  const place = useCallback(() => {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [enabled]);

  const invalidDrop = useCallback(() => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }, [enabled]);

  const lineClear = useCallback(() => {
    if (enabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  }, [enabled]);

  const combo = useCallback(
    (count: number) => {
      if (!enabled) return;
      for (let i = 0; i < Math.min(count, 4); i++) {
        setTimeout(
          () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
          i * 80
        );
      }
    },
    [enabled]
  );

  const superCombo = useCallback(() => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [enabled]);

  const levelClear = useCallback(() => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [enabled]);

  const gameOver = useCallback(() => {
    if (enabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, [enabled]);

  return {
    pickup,
    hoverTick,
    place,
    invalidDrop,
    lineClear,
    combo,
    superCombo,
    levelClear,
    gameOver,
  };
}

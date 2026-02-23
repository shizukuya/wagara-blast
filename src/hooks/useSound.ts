import { useCallback, useEffect, useRef } from 'react';
import { useSettingsStore } from '../stores/settingsStore';

// Lazy import to avoid circular deps
let SoundServiceModule: typeof import('../services/SoundService') | null = null;

export function useSound() {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const musicEnabled = useSettingsStore((s) => s.musicEnabled);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      import('../services/SoundService').then((mod) => {
        SoundServiceModule = mod;
        mod.SoundService.preloadSounds();
      });
    }
  }, []);

  const playSound = useCallback(
    (id: string) => {
      if (soundEnabled && SoundServiceModule) {
        SoundServiceModule.SoundService.playSound(id);
      }
    },
    [soundEnabled]
  );

  const playBGM = useCallback(
    (id: string) => {
      if (musicEnabled && SoundServiceModule) {
        SoundServiceModule.SoundService.playBGM(id);
      }
    },
    [musicEnabled]
  );

  const stopBGM = useCallback(() => {
    SoundServiceModule?.SoundService.stopBGM();
  }, []);

  return { playSound, playBGM, stopBGM };
}

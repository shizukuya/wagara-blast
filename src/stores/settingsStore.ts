// =============================================================================
// Settings Store - Persistent (MMKV + Zustand)
// =============================================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkvStorage';
import { getLocale } from '../utils/i18n';

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface SettingsStoreState {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  locale: 'ja' | 'en';

  // Actions
  toggleSound: () => void;
  toggleMusic: () => void;
  toggleHaptics: () => void;
  setLocale: (locale: 'ja' | 'en') => void;
}

// ---------------------------------------------------------------------------
// Store (persisted to MMKV)
// ---------------------------------------------------------------------------

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set, get) => ({
      // ---- Initial values ----
      soundEnabled: true,
      musicEnabled: true,
      hapticsEnabled: true,
      locale: getLocale(), // auto-detect from device

      // ---- Actions ----

      toggleSound: () => set({ soundEnabled: !get().soundEnabled }),

      toggleMusic: () => set({ musicEnabled: !get().musicEnabled }),

      toggleHaptics: () => set({ hapticsEnabled: !get().hapticsEnabled }),

      setLocale: (locale: 'ja' | 'en') => set({ locale }),
    }),
    {
      name: 'wagara-blast-settings',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

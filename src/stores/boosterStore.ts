// =============================================================================
// Booster Store - Persistent booster inventory (MMKV + Zustand)
// =============================================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkvStorage';
import type { BoosterType } from '../types';

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface BoosterStoreState {
  /** Inventory keyed by BoosterType. Value is the remaining count. */
  inventory: Record<string, number>;

  // Actions
  useBooster: (type: BoosterType) => boolean;
  addBoosters: (type: BoosterType, count: number) => void;
  getCount: (type: BoosterType) => number;
}

// ---------------------------------------------------------------------------
// Default inventory (generous for testing)
// ---------------------------------------------------------------------------

const DEFAULT_INVENTORY: Record<string, number> = {
  stoneBreaker: 3,
  shuffle: 3,
  guide: 3,
  lightning: 1,
  wave: 1,
};

// ---------------------------------------------------------------------------
// Store (persisted to MMKV)
// ---------------------------------------------------------------------------

export const useBoosterStore = create<BoosterStoreState>()(
  persist(
    (set, get) => ({
      inventory: { ...DEFAULT_INVENTORY },

      /**
       * Consume one use of the given booster.
       * Returns `true` if successfully decremented, `false` if none remaining.
       */
      useBooster: (type: BoosterType) => {
        const { inventory } = get();
        const current = inventory[type] ?? 0;
        if (current <= 0) return false;

        set({
          inventory: {
            ...inventory,
            [type]: current - 1,
          },
        });
        return true;
      },

      /** Add `count` uses of a booster (e.g. from purchase or reward). */
      addBoosters: (type: BoosterType, count: number) => {
        const { inventory } = get();
        const current = inventory[type] ?? 0;
        set({
          inventory: {
            ...inventory,
            [type]: current + count,
          },
        });
      },

      /** Get the current count for a booster type. */
      getCount: (type: BoosterType) => {
        return get().inventory[type] ?? 0;
      },
    }),
    {
      name: 'wagara-blast-boosters',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

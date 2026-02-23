// =============================================================================
// Collection Store - Wagara encyclopedia / discovery tracking (MMKV + Zustand)
// =============================================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkvStorage';
import type { WagaraType } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PatternDiscovery {
  /** ISO date string when the pattern was first discovered. */
  discoveredAt: string;
  /** Number of times the player has viewed the pattern in the encyclopedia. */
  viewCount: number;
}

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface CollectionStoreState {
  /** Map from WagaraType to discovery info. */
  discoveredPatterns: Record<string, PatternDiscovery>;

  // Actions
  discoverPattern: (type: WagaraType) => void;
  markViewed: (type: WagaraType) => void;
  isDiscovered: (type: WagaraType) => boolean;
  getDiscoveryDate: (type: WagaraType) => string | null;
}

// ---------------------------------------------------------------------------
// Store (persisted to MMKV)
// ---------------------------------------------------------------------------

export const useCollectionStore = create<CollectionStoreState>()(
  persist(
    (set, get) => ({
      discoveredPatterns: {},

      discoverPattern: (type: WagaraType) => {
        const current = get().discoveredPatterns;
        if (current[type]) return; // Already discovered

        set({
          discoveredPatterns: {
            ...current,
            [type]: {
              discoveredAt: new Date().toISOString(),
              viewCount: 0,
            },
          },
        });
      },

      markViewed: (type: WagaraType) => {
        const current = get().discoveredPatterns;
        const entry = current[type];
        if (!entry) return; // Not discovered yet, cannot view

        set({
          discoveredPatterns: {
            ...current,
            [type]: {
              ...entry,
              viewCount: entry.viewCount + 1,
            },
          },
        });
      },

      isDiscovered: (type: WagaraType) => {
        return type in get().discoveredPatterns;
      },

      getDiscoveryDate: (type: WagaraType) => {
        const entry = get().discoveredPatterns[type];
        return entry ? entry.discoveredAt : null;
      },
    }),
    {
      name: 'wagara-blast-collection',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

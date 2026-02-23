// =============================================================================
// User Progress Store - Persistent (MMKV + Zustand)
// =============================================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkvStorage';
import type { WagaraType } from '../types';

// ---------------------------------------------------------------------------
// State shape
// ---------------------------------------------------------------------------

export interface UserStoreState {
  // Classic mode
  classicHighScore: number;

  // Level mode progress: levelId -> stars earned (1-3)
  levelProgress: Record<number, number>;
  totalStars: number;

  // Economy
  coins: number;

  // Daily challenge
  dailyStreak: number;
  lastDailyDate: string;
  completedDailyDates: string[];

  // Collection / discovery
  discoveredWagara: WagaraType[];

  // Actions
  updateHighScore: (score: number) => void;
  updateLevelProgress: (levelId: number, stars: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  completeDailyChallenge: (dateISO: string) => void;
  discoverWagara: (type: WagaraType) => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Store (persisted to MMKV)
// ---------------------------------------------------------------------------

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      // ---- Initial values ----
      classicHighScore: 0,
      levelProgress: {},
      totalStars: 0,
      coins: 0,
      dailyStreak: 0,
      lastDailyDate: '',
      completedDailyDates: [],
      discoveredWagara: [],

      // ---- Actions ----

      updateHighScore: (score: number) => {
        if (score > get().classicHighScore) {
          set({ classicHighScore: score });
        }
      },

      updateLevelProgress: (levelId: number, stars: number) => {
        const prev = get().levelProgress;
        const existing = prev[levelId] ?? 0;
        if (stars <= existing) return; // Only upgrade, never downgrade

        const newProgress = { ...prev, [levelId]: stars };
        const totalStars = Object.values(newProgress).reduce(
          (sum, s) => sum + s,
          0,
        );
        set({ levelProgress: newProgress, totalStars });
      },

      addCoins: (amount: number) => {
        set({ coins: get().coins + amount });
      },

      spendCoins: (amount: number) => {
        const current = get().coins;
        if (current < amount) return false;
        set({ coins: current - amount });
        return true;
      },

      completeDailyChallenge: (dateISO: string) => {
        const { lastDailyDate, dailyStreak, completedDailyDates } = get();

        // Check if already completed today
        if (completedDailyDates.includes(dateISO)) return;

        // Calculate streak: if the last date was yesterday, increment; otherwise reset to 1
        let newStreak = 1;
        if (lastDailyDate) {
          const lastDate = new Date(lastDailyDate);
          const today = new Date(dateISO);
          const diffMs = today.getTime() - lastDate.getTime();
          const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            newStreak = dailyStreak + 1;
          }
        }

        set({
          dailyStreak: newStreak,
          lastDailyDate: dateISO,
          completedDailyDates: [...completedDailyDates, dateISO],
        });
      },

      discoverWagara: (type: WagaraType) => {
        const current = get().discoveredWagara;
        if (current.includes(type)) return;
        set({ discoveredWagara: [...current, type] });
      },

      reset: () => {
        set({
          classicHighScore: 0,
          levelProgress: {},
          totalStars: 0,
          coins: 0,
          dailyStreak: 0,
          lastDailyDate: '',
          completedDailyDates: [],
          discoveredWagara: [],
        });
      },
    }),
    {
      name: 'wagara-blast-user',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);

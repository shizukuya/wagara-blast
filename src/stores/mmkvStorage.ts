// =============================================================================
// MMKV Storage Adapter for Zustand persist middleware
// =============================================================================
import { createMMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const storage = createMMKV({ id: 'wagara-blast' });

/**
 * StateStorage-compatible adapter that delegates to react-native-mmkv.
 * Used by all persistent Zustand stores (userStore, settingsStore, etc.).
 */
export const mmkvStorage: StateStorage = {
  getItem: (name: string): string | null => {
    return storage.getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};

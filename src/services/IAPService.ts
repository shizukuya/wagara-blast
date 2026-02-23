// =============================================================================
// IAP Service - Stub (TODO: Implement with expo-in-app-purchases or
// react-native-iap)
// =============================================================================

// TODO: Implement with a real IAP library
export const IAPService = {
  initialize: async (): Promise<void> => {
    console.log('[IAPService] TODO: Initialize IAP connection');
  },

  getProducts: async (): Promise<unknown[]> => {
    console.log('[IAPService] TODO: Fetch available products');
    return [];
  },

  purchase: async (productId: string): Promise<boolean> => {
    console.log(`[IAPService] TODO: Purchase product ${productId}`);
    return true; // Simulate successful purchase for development
  },

  restorePurchases: async (): Promise<string[]> => {
    console.log('[IAPService] TODO: Restore purchases');
    return []; // No previously purchased items in dev mode
  },

  cleanup: (): void => {
    console.log('[IAPService] TODO: Disconnect IAP listener');
  },
};

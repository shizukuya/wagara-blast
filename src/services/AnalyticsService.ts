// =============================================================================
// Analytics Service - Stub (TODO: Implement with Firebase Analytics,
// Amplitude, or similar)
// =============================================================================

// TODO: Implement with a real analytics SDK
export const AnalyticsService = {
  initialize: async (): Promise<void> => {
    console.log('[AnalyticsService] TODO: Initialize analytics');
  },

  logEvent: (eventName: string, params?: Record<string, unknown>): void => {
    console.log(`[AnalyticsService] Event: ${eventName}`, params ?? '');
  },

  setUserId: (userId: string): void => {
    console.log(`[AnalyticsService] TODO: Set user ID: ${userId}`);
  },

  setUserProperty: (name: string, value: string): void => {
    console.log(`[AnalyticsService] TODO: Set property ${name}=${value}`);
  },

  logScreenView: (screenName: string): void => {
    console.log(`[AnalyticsService] Screen: ${screenName}`);
  },

  logGameStart: (mode: string): void => {
    console.log(`[AnalyticsService] Game Start: ${mode}`);
  },

  logGameOver: (mode: string, score: number): void => {
    console.log(`[AnalyticsService] Game Over: ${mode}, score=${score}`);
  },

  logLevelComplete: (levelId: number, stars: number): void => {
    console.log(
      `[AnalyticsService] Level Complete: ${levelId}, stars=${stars}`,
    );
  },

  logPurchase: (productId: string, amount: number): void => {
    console.log(
      `[AnalyticsService] Purchase: ${productId}, amount=${amount}`,
    );
  },
};

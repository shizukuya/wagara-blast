// =============================================================================
// Ad Service - Stub (TODO: Implement with react-native-google-mobile-ads)
// =============================================================================

// TODO: Implement with react-native-google-mobile-ads
export const AdService = {
  initialize: async (): Promise<void> => {
    console.log('[AdService] TODO: Initialize AdMob');
  },

  showRewardedAd: async (): Promise<boolean> => {
    console.log('[AdService] TODO: Show rewarded ad');
    return true; // Simulate successful reward for development
  },

  showInterstitial: async (): Promise<void> => {
    console.log('[AdService] TODO: Show interstitial');
  },

  showBanner: (): void => {
    console.log('[AdService] TODO: Show banner');
  },
};

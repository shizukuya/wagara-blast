import { Easing } from 'react-native-reanimated';

// Easing presets from GDD 2.5
export const AnimationConfig = {
  // Block pickup - swift scale up
  pickup: {
    duration: 100,
    easing: Easing.out(Easing.ease),
    scale: 1.05,
  },

  // Grid snap - THE key animation for "kachitto" feel
  snap: {
    duration: 150,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1), // ease-out-back
  },

  // Line clear flash
  flash: {
    duration: 80,
    easing: Easing.in(Easing.ease),
  },

  // Tile destruction
  tileDestroy: {
    duration: 200,
    easing: Easing.in(Easing.quad),
  },

  // Score popup - spring bounce
  scorePop: {
    damping: 15,
    stiffness: 300,
    mass: 1,
  },

  // Screen shake
  shake: {
    light: { amplitude: 2, duration: 100 },
    medium: { amplitude: 4, duration: 150 },
    heavy: { amplitude: 6, duration: 200 },
  },

  // Combo text - elastic bounce
  comboText: {
    duration: 400,
    easing: Easing.bezier(0.68, -0.55, 0.27, 1.55), // ease-out-elastic approx
  },

  // Block return to tray on invalid drop
  returnToTray: {
    damping: 12,
    stiffness: 200,
    mass: 1,
  },

  // Game over fade
  gameOverFade: {
    duration: 800,
    easing: Easing.out(Easing.ease),
  },

  // Level clear celebration
  levelClear: {
    starDelay: 200, // ms between each star appearance
    confettiDuration: 2000,
  },
} as const;

// Max animation duration rule from GDD: all animations under 300ms
export const MAX_ANIMATION_DURATION = 300;

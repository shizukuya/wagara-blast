// Wagara Blast Color Palette - Japanese traditional aesthetic
export const Colors = {
  // Base palette
  background: '#F5F0E8',      // 生成り / Unbleached paper
  woodFrame: '#5C3D2E',       // 木枠 / Wood frame
  emptyCell: '#EDE5D8',       // 空マス / Empty cell
  gridLine: '#D4C9B8',        // グリッドライン / Grid line
  textPrimary: '#2C2C2C',     // 墨色 / Ink black
  textSecondary: '#6B5B4F',   // Secondary text
  accent: '#C41E3A',          // 朱色 / Vermillion
  gold: '#C9A84C',            // 金箔色 / Gold leaf

  // Wagara tile colors
  wagara: {
    ichimatsu: { primary: '#2D5A3D', secondary: '#1A1A1A' },   // 市松: 緑×黒
    asanoha:   { primary: '#E8A0BF', secondary: '#D4789F' },    // 麻の葉: ピンク
    seigaiha:  { primary: '#3A6EA5', secondary: '#2A5080' },    // 青海波: 青
    shippou:   { primary: '#7B5EA7', secondary: '#5E3D8A' },    // 七宝: 紫
    yagasuri:  { primary: '#C41E3A', secondary: '#9B1830' },    // 矢絣: 赤
    kikkou:    { primary: '#C9A84C', secondary: '#A88B2F' },    // 亀甲: 金
    uroko:     { primary: '#E07B3C', secondary: '#C06028' },    // 鱗: オレンジ
  },

  // UI colors
  buttonPrimary: '#C41E3A',
  buttonSecondary: '#5C3D2E',
  disabled: '#B5A99A',
  success: '#2D5A3D',
  error: '#C41E3A',
  warning: '#C9A84C',

  // Overlay / effects
  overlayDark: 'rgba(26, 10, 46, 0.7)',
  overlayLight: 'rgba(245, 240, 232, 0.9)',
  flash: '#FFFFFF',
  goldGlow: 'rgba(201, 168, 76, 0.6)',

  // Tab bar
  tabActive: '#C41E3A',
  tabInactive: '#B5A99A',
  tabBackground: '#F5F0E8',
} as const;

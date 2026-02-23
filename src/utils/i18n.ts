import { Platform, NativeModules } from 'react-native';

type Locale = 'ja' | 'en';

// Detect device locale
function getDeviceLocale(): Locale {
  try {
    const locale =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0]
        : NativeModules.I18nManager?.localeIdentifier;
    if (locale && locale.startsWith('ja')) return 'ja';
  } catch {}
  return 'en';
}

let currentLocale: Locale = getDeviceLocale();

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getLocale(): Locale {
  return currentLocale;
}

type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    // Modes
    play: 'Play',
    classic: 'Classic',
    level: 'Level',
    daily: 'Daily',
    collection: 'Collection',
    shop: 'Shop',
    settings: 'Settings',

    // Game
    score: 'Score',
    highScore: 'High Score',
    level_label: 'Level',
    moves: 'Moves',
    target: 'Target',
    combo: 'Combo',
    double: 'Double!',
    triple: 'Triple!',
    perfect: 'Perfect!',
    gameOver: 'Game Over',
    levelClear: 'Level Clear!',
    retry: 'Retry',
    next: 'Next',
    home: 'Home',
    pause: 'Pause',
    resume: 'Resume',

    // Boosters
    stoneBreaker: 'Stone Breaker',
    shuffle: 'Shuffle',
    guide: 'Guide',
    lightning: 'Lightning',
    wave: 'Wave',

    // Settings
    sound: 'Sound',
    music: 'Music',
    haptics: 'Haptics',
    language: 'Language',
    resetProgress: 'Reset Progress',
    resetConfirm: 'Are you sure? This cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Confirm',

    // Collection
    discovered: 'Discovered',
    locked: 'Not yet discovered',
    meaning: 'Meaning',
    history: 'History',

    // Shop
    removeAds: 'Remove Ads',
    boosterPack: 'Booster Pack',
    premiumPack: 'Premium Pack',
    skinPack: 'Wagara Skin Pack',
    coinPack: 'Coin Pack',
    comingSoon: 'Coming Soon',

    // Daily
    dailyChallenge: 'Daily Challenge',
    streak: 'Streak',
    todayCompleted: "Today's challenge completed!",

    // Level select
    selectLevel: 'Select Level',
    stars: 'Stars',
  },
  ja: {
    play: 'プレイ',
    classic: 'クラシック',
    level: 'レベル',
    daily: 'デイリー',
    collection: '図鑑',
    shop: 'ショップ',
    settings: '設定',

    score: 'スコア',
    highScore: 'ハイスコア',
    level_label: 'レベル',
    moves: '手数',
    target: '目標',
    combo: 'コンボ',
    double: 'ダブル！',
    triple: 'トリプル！',
    perfect: 'パーフェクト！',
    gameOver: 'おしまい',
    levelClear: 'クリア！',
    retry: 'リトライ',
    next: '次へ',
    home: 'ホーム',
    pause: 'ポーズ',
    resume: '再開',

    stoneBreaker: '石割り',
    shuffle: '入替え',
    guide: '導き',
    lightning: '稲妻',
    wave: '波',

    sound: 'サウンド',
    music: 'BGM',
    haptics: '振動',
    language: '言語',
    resetProgress: 'データリセット',
    resetConfirm: '本当にリセットしますか？元に戻せません。',
    cancel: 'キャンセル',
    confirm: '確認',

    discovered: '発見済み',
    locked: '未発見',
    meaning: '意味',
    history: '歴史',

    removeAds: '広告除去',
    boosterPack: 'ブースターパック',
    premiumPack: 'プレミアムパック',
    skinPack: '和柄スキンパック',
    coinPack: 'コインパック',
    comingSoon: '近日公開',

    dailyChallenge: 'デイリーチャレンジ',
    streak: '連続日数',
    todayCompleted: '今日のチャレンジ完了！',

    selectLevel: 'レベル選択',
    stars: 'スター',
  },
} as const;

export function t(key: TranslationKey): string {
  return translations[currentLocale][key] ?? translations.en[key] ?? key;
}

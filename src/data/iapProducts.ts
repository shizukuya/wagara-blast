// =============================================================================
// Wagara Blast - In-App Purchase (IAP) Product Catalog
// =============================================================================

import { IAPProduct } from '@/types';

// ---------------------------------------------------------------------------
// Product catalog -- all purchasable items
// ---------------------------------------------------------------------------

/**
 * Remove Ads (non-consumable).
 * Permanently removes interstitial and banner ads.
 */
export const PRODUCT_REMOVE_ADS: IAPProduct = {
  id: 'com.wagara_blast.remove_ads',
  nameJa: '広告除去',
  nameEn: 'Remove Ads',
  priceJPY: 480,
  type: 'non_consumable',
};

/**
 * Booster Pack -- Small (consumable).
 * Contains a small set of assorted boosters.
 */
export const PRODUCT_BOOSTER_PACK_S: IAPProduct = {
  id: 'com.wagara_blast.booster_pack_s',
  nameJa: 'ブースターパック (小)',
  nameEn: 'Booster Pack (S)',
  priceJPY: 160,
  type: 'consumable',
};

/**
 * Booster Pack -- Medium (consumable).
 * Contains a medium set of assorted boosters.
 */
export const PRODUCT_BOOSTER_PACK_M: IAPProduct = {
  id: 'com.wagara_blast.booster_pack_m',
  nameJa: 'ブースターパック (中)',
  nameEn: 'Booster Pack (M)',
  priceJPY: 240,
  type: 'consumable',
};

/**
 * Booster Pack -- Large (consumable).
 * Contains a large set of assorted boosters.
 */
export const PRODUCT_BOOSTER_PACK_L: IAPProduct = {
  id: 'com.wagara_blast.booster_pack_l',
  nameJa: 'ブースターパック (大)',
  nameEn: 'Booster Pack (L)',
  priceJPY: 320,
  type: 'consumable',
};

/**
 * Premium Pack (non-consumable).
 * Includes Remove Ads + exclusive wagara skin set + starter boosters.
 */
export const PRODUCT_PREMIUM_PACK: IAPProduct = {
  id: 'com.wagara_blast.premium_pack',
  nameJa: 'プレミアムパック',
  nameEn: 'Premium Pack',
  priceJPY: 800,
  type: 'non_consumable',
};

/**
 * Skin Pack (non-consumable).
 * Unlocks an additional set of cosmetic wagara tile skins.
 */
export const PRODUCT_SKIN_PACK: IAPProduct = {
  id: 'com.wagara_blast.skin_pack',
  nameJa: 'スキンパック',
  nameEn: 'Skin Pack',
  priceJPY: 240,
  type: 'non_consumable',
};

/**
 * Coin Pack -- Small (consumable).
 * 500 coins.
 */
export const PRODUCT_COIN_PACK_S: IAPProduct = {
  id: 'com.wagara_blast.coin_pack_s',
  nameJa: 'コインパック (小)',
  nameEn: 'Coin Pack (S)',
  priceJPY: 120,
  type: 'consumable',
};

/**
 * Coin Pack -- Medium (consumable).
 * 1200 coins.
 */
export const PRODUCT_COIN_PACK_M: IAPProduct = {
  id: 'com.wagara_blast.coin_pack_m',
  nameJa: 'コインパック (中)',
  nameEn: 'Coin Pack (M)',
  priceJPY: 240,
  type: 'consumable',
};

/**
 * Coin Pack -- Large (consumable).
 * 3000 coins.
 */
export const PRODUCT_COIN_PACK_L: IAPProduct = {
  id: 'com.wagara_blast.coin_pack_l',
  nameJa: 'コインパック (大)',
  nameEn: 'Coin Pack (L)',
  priceJPY: 400,
  type: 'consumable',
};

// ---------------------------------------------------------------------------
// Aggregate catalog
// ---------------------------------------------------------------------------

/** All IAP products as an array (for store listing). */
export const IAP_PRODUCTS: IAPProduct[] = [
  PRODUCT_REMOVE_ADS,
  PRODUCT_BOOSTER_PACK_S,
  PRODUCT_BOOSTER_PACK_M,
  PRODUCT_BOOSTER_PACK_L,
  PRODUCT_PREMIUM_PACK,
  PRODUCT_SKIN_PACK,
  PRODUCT_COIN_PACK_S,
  PRODUCT_COIN_PACK_M,
  PRODUCT_COIN_PACK_L,
];

/** Map from product ID string to IAPProduct for fast lookups. */
export const IAP_PRODUCTS_BY_ID: Record<string, IAPProduct> = Object.fromEntries(
  IAP_PRODUCTS.map((p) => [p.id, p]),
);

// ---------------------------------------------------------------------------
// Filtered sub-catalogs
// ---------------------------------------------------------------------------

/** All consumable products. */
export const CONSUMABLE_PRODUCTS: IAPProduct[] = IAP_PRODUCTS.filter(
  (p) => p.type === 'consumable',
);

/** All non-consumable (permanent) products. */
export const NON_CONSUMABLE_PRODUCTS: IAPProduct[] = IAP_PRODUCTS.filter(
  (p) => p.type === 'non_consumable',
);

/** Booster packs only. */
export const BOOSTER_PACK_PRODUCTS: IAPProduct[] = [
  PRODUCT_BOOSTER_PACK_S,
  PRODUCT_BOOSTER_PACK_M,
  PRODUCT_BOOSTER_PACK_L,
];

/** Coin packs only. */
export const COIN_PACK_PRODUCTS: IAPProduct[] = [
  PRODUCT_COIN_PACK_S,
  PRODUCT_COIN_PACK_M,
  PRODUCT_COIN_PACK_L,
];

// ---------------------------------------------------------------------------
// Coin pack reward amounts
// ---------------------------------------------------------------------------

/** Maps coin-pack product IDs to the number of coins awarded. */
export const COIN_PACK_AMOUNTS: Record<string, number> = {
  [PRODUCT_COIN_PACK_S.id]: 500,
  [PRODUCT_COIN_PACK_M.id]: 1200,
  [PRODUCT_COIN_PACK_L.id]: 3000,
};

// ---------------------------------------------------------------------------
// Booster pack contents
// ---------------------------------------------------------------------------

/** Maps booster-pack product IDs to the boosters included. */
export const BOOSTER_PACK_CONTENTS: Record<
  string,
  { stoneBreaker: number; shuffle: number; guide: number; lightning: number; wave: number }
> = {
  [PRODUCT_BOOSTER_PACK_S.id]: {
    stoneBreaker: 2,
    shuffle: 2,
    guide: 3,
    lightning: 0,
    wave: 0,
  },
  [PRODUCT_BOOSTER_PACK_M.id]: {
    stoneBreaker: 3,
    shuffle: 3,
    guide: 5,
    lightning: 1,
    wave: 1,
  },
  [PRODUCT_BOOSTER_PACK_L.id]: {
    stoneBreaker: 5,
    shuffle: 5,
    guide: 8,
    lightning: 3,
    wave: 3,
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Look up an IAP product by its ID string.
 */
export function getProductById(id: string): IAPProduct | undefined {
  return IAP_PRODUCTS_BY_ID[id];
}

/**
 * Get the coin amount for a coin pack product.
 * Returns 0 if the product is not a coin pack.
 */
export function getCoinPackAmount(productId: string): number {
  return COIN_PACK_AMOUNTS[productId] ?? 0;
}

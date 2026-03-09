export const QUESTS_CONFIG = {
  maxChest: 5,
};

export const CHAIN_CHEST = {
  SKALE: 'skale',
  CORE: 'core',
  PENTAGON: 'pentagon',
  AVAX: 'avax',
} as const;

export const USER_TYPES = {
  NORMAL_USER: 'normal_user',
  PREMIUM_USER: 'premium_user',
} as const;

export const REMAINING_CHESTS = {
  CORE: 'remaining_chest_today_core',
  SKALE: 'remaining_chest_today_skale',
  PENTAGON: 'remaining_chest_today_pen',
  AVAX: 'remaining_chest_today_avax',
} as const;

export const CHEST_TYPES = {
  SKALE_NORMAL: 'skale_normal',
  SKALE_PREMIUM: 'skale_premium',
  CORE_NORMAL: 'core_normal',
  CORE_PREMIUM: 'core_premium',
  PENTAGON_NORMAL: 'pen_normal',
  PENTAGON_PREMIUM: 'pen_premium',
  AVAX_NORMAL: 'avax_normal',
  AVAX_PREMIUM: 'avax_premium',
} as const;

export type ChestUserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];
export type RemainingChestType = (typeof REMAINING_CHESTS)[keyof typeof REMAINING_CHESTS];
export type ChestType = (typeof CHEST_TYPES)[keyof typeof CHEST_TYPES];

export type ChainChest = (typeof CHAIN_CHEST)[keyof typeof CHAIN_CHEST];

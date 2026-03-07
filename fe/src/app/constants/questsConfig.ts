export const QUESTS_CONFIG = {
  maxChest: 5,
};

export const CHAIN_CHEST = {
  AVAX: 'avax',
} as const;

export const USER_TYPES = {
  NORMAL_USER: 'normal_user',
  PREMIUM_USER: 'premium_user',
} as const;

export const REMAINING_CHESTS = {
  AVAX: 'remaining_chest_today_avax',
} as const;

export const CHEST_TYPES = {
  AVAX_NORMAL: 'avax_normal',
  AVAX_PREMIUM: 'avax_premium',
} as const;

export type ChestUserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];
export type RemainingChestType = (typeof REMAINING_CHESTS)[keyof typeof REMAINING_CHESTS];
export type ChestType = (typeof CHEST_TYPES)[keyof typeof CHEST_TYPES];

export type ChainChest = (typeof CHAIN_CHEST)[keyof typeof CHAIN_CHEST];

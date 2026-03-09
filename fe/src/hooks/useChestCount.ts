import useStore from '@/app/stores/userStore';
import {
  ChestType,
  ChestUserType,
  QUESTS_CONFIG,
  REMAINING_CHESTS,
  RemainingChestType,
  USER_TYPES,
} from '@/app/constants/questsConfig';

interface RemainingChests {
  [USER_TYPES.NORMAL_USER]: {
    [REMAINING_CHESTS.SKALE]: number;
    [REMAINING_CHESTS.CORE]: number;
    [REMAINING_CHESTS.PENTAGON]: number;
    [REMAINING_CHESTS.AVAX]: number;
  };
  [USER_TYPES.PREMIUM_USER]: {
    [REMAINING_CHESTS.SKALE]: number;
    [REMAINING_CHESTS.CORE]: number;
    [REMAINING_CHESTS.PENTAGON]: number;
    [REMAINING_CHESTS.AVAX]: number;
  };
}

interface RewardsState {
  remaining_chests?: RemainingChests;
}

interface ChestCounts {
  claimed: number;
  remaining: number;
}

export const useHasPremiumUserChests = (): boolean => {
  const rewards = useStore((state: { rewards: any }) => state.rewards);
  const premiumChests = rewards?.remaining_chests?.[USER_TYPES.PREMIUM_USER];
  return !!premiumChests && typeof premiumChests === 'object';
};

export const useHasSkalePremiumUserChests = (): boolean => {
  const rewards = useStore((state: { rewards: any }) => state.rewards);
  const skalePremiumChests =
    rewards?.remaining_chests?.[USER_TYPES.PREMIUM_USER]?.[REMAINING_CHESTS.SKALE];
  return typeof skalePremiumChests === 'number';
};

export const useHasCorePremiumUserChests = (): boolean => {
  const rewards = useStore((state: { rewards: any }) => state.rewards);
  const corePremiumChests =
    rewards?.remaining_chests?.[USER_TYPES.PREMIUM_USER]?.[REMAINING_CHESTS.CORE];
  return typeof corePremiumChests === 'number';
};

export const useHasPentagonPremiumUserChests = (): boolean => {
  const rewards = useStore((state: { rewards: any }) => state.rewards);
  const pentagonPremiumChests =
    rewards?.remaining_chests?.[USER_TYPES.PREMIUM_USER]?.[REMAINING_CHESTS.PENTAGON];
  return typeof pentagonPremiumChests === 'number';
};

export const useHasPentagonUserChests = (): boolean => {
  const rewards = useStore((state: { rewards: any }) => state.rewards);
  const pentagonChests = rewards?.remaining_chests?.[USER_TYPES.NORMAL_USER]?.[REMAINING_CHESTS.PENTAGON];
  return typeof pentagonChests === 'number';
};

export const useChestCount = ({
  remainingChestType,
  userType,
}: {
  remainingChestType: RemainingChestType;
  userType: ChestUserType;
}): ChestCounts => {
  const rewards = useStore((state: { rewards: RewardsState }) => state.rewards);
  const maxChest = QUESTS_CONFIG.maxChest;

  if (!rewards?.remaining_chests) {
    return {
      claimed: 0,
      remaining: maxChest,
    };
  }

  const remaining = rewards.remaining_chests[userType]?.[remainingChestType] || 0;
  const claimed = maxChest - remaining;

  return {
    claimed,
    remaining,
  };
};

export const useHasAvaxPremiumUserChests = (): boolean => {
  const rewards = useStore((state: { rewards: any }) => state.rewards);
  const avaxPremiumChests =
    rewards?.remaining_chests?.['premium_user']?.['remaining_chest_today_avax'];
  return typeof avaxPremiumChests === 'number';
};

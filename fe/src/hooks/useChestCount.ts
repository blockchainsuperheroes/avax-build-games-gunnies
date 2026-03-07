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
    [REMAINING_CHESTS.AVAX]: number;
    [REMAINING_CHESTS.AVAX]: number;
    [REMAINING_CHESTS.AVAX]: number;
  };
  [USER_TYPES.PREMIUM_USER]: {
    [REMAINING_CHESTS.AVAX]: number;
    [REMAINING_CHESTS.AVAX]: number;
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

export const useHasAvalanchePremiumUserChests = (): boolean => {
  const rewards = useStore((state: { rewards: any }) => state.rewards);
  const avaxPremiumChests =
    rewards?.remaining_chests?.[USER_TYPES.PREMIUM_USER]?.[REMAINING_CHESTS.AVAX];
  return typeof avaxPremiumChests === 'number';
};

export const useHasAvalanchePremiumUserChests = (): boolean => {
  const rewards = useStore((state: { rewards: any }) => state.rewards);
  const corePremiumChests =
    rewards?.remaining_chests?.[USER_TYPES.PREMIUM_USER]?.[REMAINING_CHESTS.AVAX];
  return typeof corePremiumChests === 'number';
};

export const useHasAvalanchePremiumUserChests = (): boolean => {
  const rewards = useStore((state: { rewards: any }) => state.rewards);
  const avalanchePremiumChests =
    rewards?.remaining_chests?.[USER_TYPES.PREMIUM_USER]?.[REMAINING_CHESTS.AVAX];
  return typeof avalanchePremiumChests === 'number';
};

export const useHasAvalancheUserChests = (): boolean => {
  const rewards = useStore((state: { rewards: any }) => state.rewards);
  const avalancheChests = rewards?.remaining_chests?.[USER_TYPES.NORMAL_USER]?.[REMAINING_CHESTS.AVAX];
  return typeof avalancheChests === 'number';
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

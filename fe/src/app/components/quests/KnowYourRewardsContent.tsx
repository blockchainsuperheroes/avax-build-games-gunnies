import React from 'react';
import Image from 'next/image';

export interface RewardItem {
  icon: string;
  title: string;
  description: string;
  imageClass: string;
}

export const defaultRewards: RewardItem[] = [
  {
    icon: '/images/quests/star-circle.png',
    title: 'STAR',
    description:
      'Earn stars by opening loot boxes or getting kills in-game. The more stars you collect, the higher you’ll climb on the competitive leaderboard.',
    imageClass: 'w-[68px] h-[75px]',
  },
  {
    icon: '/images/quests/gcoin.png',
    title: 'COIN',
    description: 'Coins are in-game currency used to buy Cosmetics, Weapons & Skill Cards.',
    imageClass: 'w-[68px] h-[75px]',
  },
  {
    icon: '/images/quests/carrot.png',
    title: 'KARROT',
    description:
      'Karrots are premium currency for buying Legendary Loot Boxes and Battle Passes, available in the shop or from AvalancheAvalanche rewards.',
    imageClass: 'w-[52px] h-[75px]',
  },
  // {
  //   icon: '/images/quests/xkhao.png',
  //   title: 'xKHAOS',
  //   description:
  //     'xKHAOS is a non-tradable, pre-TGE token used for early access, testing rewards, and exclusive in-game events.',
  //   imageClass: 'w-[68px] h-[75px]',
  // },
  // {
  //   icon: '/images/quests/usdt.png',
  //   title: 'USDT',
  //   description: 'USDT is a stablecoin used to buy premium items and in-game currencies.',
  //   imageClass: 'w-[68px] h-[75px]',
  // },
];

interface RewardsGridProps {
  rewards?: RewardItem[];
  gridCols?: string;
}

export function RewardsGrid({
  rewards = defaultRewards,
  gridCols = 'grid-cols-1 md:grid-cols-3',
}: RewardsGridProps) {
  return (
    <div className={`grid ${gridCols} gap-5 mt-12`}>
      {rewards.map((reward, index) => (
        <div
          key={index}
          className="border border-white rounded-lg p-4 flex gap-[18px] items-center justify-center hover:border-[#1CBBBC] transition-colors"
        >
          <div className="flex-shrink-0 w-[68px] h-[75px] flex items-center justify-center">
            <Image
              src={reward.icon}
              alt={reward.title}
              width={68}
              height={74}
              className={reward.imageClass}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-white text-lg md:text-[28px] font-chakra font-bold uppercase mb-2">
              {reward.title}
            </h3>
            <p className="text-white text-xs md:text-sm font-chakra font-normal leading-relaxed">
              {reward.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Complete component with default data
export function KnowYourRewardsContent() {
  return <RewardsGrid rewards={defaultRewards} />;
}

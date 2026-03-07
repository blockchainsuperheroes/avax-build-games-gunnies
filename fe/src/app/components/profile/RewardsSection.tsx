'use client';

import React from 'react';
import Image from 'next/image';
import { useBalance } from '@/hooks/useBalance';

export const RewardsSection = () => {
  const { balance, isLoading } = useBalance();
  const inGameBalance = balance?.balance || { stars: 0, coins: 0, karrots: 0 };
  const lootBoxRewards = balance?.earned || { stars: 0, coins: 0, karrots: 0 };

  if (isLoading) {
    return (
      <div className="bg-black rounded-xl py-5 px-6 md:py-11 md:px-12 mb-5 md:mb-12 border-[0.5px] border-[#7E7E7E]">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl py-5 px-6 md:py-11 md:px-12 mb-5 md:mb-12 border-[0.5px] border-[#7E7E7E]">
      <h2 className="text-white text-[32px] md:text-[42px] font-bold font-batgrexo uppercase mb-5 md:mb-[28px] text-center md:text-left">
        YOUR REWARDS
      </h2>

      {/* In Game Balance */}
      <div className="mb-5 md:mb-9">
        <h3 className="text-white text-xl mb-3 font-lexend-giga">YOUR CURRENT IN GAME BALANCE</h3>
        <div className="flex flex-wrap gap-8">
          <div className="flex items-center gap-2">
            <Image src="/images/quests/star-circle.png" alt="Star" width={40} height={40} />
            <div className="flex items-center gap-1">
              <p className="text-white text-base md:text-2xl font-chakra font-semibold">STARS</p>
              <p className="text-base md:text-2xl text-[#FFA100] font-semibold font-chakra">
                {inGameBalance.stars || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/images/quests/gcoin.png" alt="Coin" width={40} height={40} />
            <div className="flex items-center gap-1">
              <p className="text-white text-base md:text-2xl font-chakra font-semibold">COINS</p>
              <p className="text-base md:text-2xl text-[#FFA100] font-chakra font-semibold">
                {inGameBalance.coins || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/images/quests/carrot.png" alt="Karrot" width={36} height={44} />
            <div className="flex items-center gap-1">
              <p className="text-white text-base md:text-2xl font-chakra font-semibold">KARROTS</p>
              <p className="text-base md:text-2xl text-[#FFA100] font-chakra font-semibold">
                {inGameBalance.karrots || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="mb-5 md:mb-9 border-[#7E7E7E]" />

      {/* Loot Box Rewards */}
      <div>
        <h3 className="text-white text-xl md:text-2xl mb-3 font-lexend-giga">
          YOUR ALL TIME LOOT BOX REWARD
        </h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <Image src="/images/quests/star-circle.png" alt="Star" width={44} height={44} />
            <div className="flex items-center gap-1">
              <p className="text-white text-base md:text-2xl font-chakra font-semibold">STARS</p>
              <p className="text-base md:text-2xl text-[#FFA100] font-chakra font-semibold">
                {lootBoxRewards.stars || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/images/quests/gcoin.png" alt="Coin" width={44} height={44} />
            <div className="flex items-center gap-1">
              <p className="text-white text-base md:text-2xl font-chakra font-semibold">COINS</p>
              <p className="text-base md:text-2xl text-[#FFA100] font-chakra font-semibold">
                {lootBoxRewards.coins || 0}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/images/quests/carrot.png" alt="Karrot" width={36} height={44} />
            <div className="flex items-center gap-1">
              <p className="text-white text-base md:text-2xl font-chakra font-semibold">KARROTS</p>
              <p className="text-base md:text-2xl text-[#FFA100] font-chakra font-semibold">
                {lootBoxRewards.karrots || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import Image from 'next/image';
import { useBalance } from '@/hooks/useBalance';

export const Banner = () => {
  const { balance, isLoading } = useBalance();
  const inGameBalance = balance?.balance || { stars: 0, coins: 0, karrots: 0 };
  const lootBoxRewards = balance?.earned || { stars: 0, coins: 0, karrots: 0 };

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch justify-center mt-6 mb-4 md:max-w-[1569px] w-full mx-auto">
        <div className="relative flex-1 min-h-[133px] md:min-h-[100%]">
          <Image src="/images/quests/banner.png" alt="Quest banner" fill className="object-cover" />
        </div>
        <div className="flex-1 bg-black p-4 md:p-8 relative">
          <div className="absolute inset-0 bg-[url('/images/quests/rank.png')] bg-no-repeat bg-top-left bg-[length:70px] md:bg-[length:150px] opacity-40 pointer-events-none z-0" />

          <div className="mb-5 md:mb-9 z-10 relative">
            <h3 className="text-white text-base md:text-xl mb-3 font-lexend-giga">YOUR CURRENT IN GAME BALANCE</h3>
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-2">
                <Image src="/images/quests/star-circle.png" alt="Star" width={40} height={40} />
                <div className="flex items-center gap-1">
                  <p className="text-white text-base md:text-2xl font-chakra font-semibold">
                    STARS
                  </p>
                  <p className="text-base md:text-2xl text-[#FFA100] font-semibold font-chakra">
                    {inGameBalance.stars || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/images/quests/gcoin.png" alt="Coin" width={40} height={40} />
                <div className="flex items-center gap-1">
                  <p className="text-white text-base md:text-2xl font-chakra font-semibold">
                    COINS
                  </p>
                  <p className="text-base md:text-2xl text-[#FFA100] font-chakra font-semibold">
                    {inGameBalance.coins || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/images/quests/carrot.png" alt="Karrot" width={36} height={44} />
                <div className="flex items-center gap-1">
                  <p className="text-white text-base md:text-2xl font-chakra font-semibold">
                    KARROTS
                  </p>
                  <p className="text-base md:text-2xl text-[#FFA100] font-chakra font-semibold">
                    {inGameBalance.karrots || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="mb-5 md:mb-9 border-white" />

          {/* Loot Box Rewards */}
          <div>
            <h3 className="text-white text-base md:text-xl mb-3 font-lexend-giga">
              YOUR ALL TIME LOOT BOX REWARD
            </h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Image src="/images/quests/star-circle.png" alt="Star" width={44} height={44} />
                <div className="flex items-center gap-1">
                  <p className="text-white text-base md:text-2xl font-chakra font-semibold">
                    STARS
                  </p>
                  <p className="text-base md:text-2xl text-[#FFA100] font-chakra font-semibold">
                    {lootBoxRewards.stars || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/images/quests/gcoin.png" alt="Coin" width={44} height={44} />
                <div className="flex items-center gap-1">
                  <p className="text-white text-base md:text-2xl font-chakra font-semibold">
                    COINS
                  </p>
                  <p className="text-base md:text-2xl text-[#FFA100] font-chakra font-semibold">
                    {lootBoxRewards.coins || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Image src="/images/quests/carrot.png" alt="Karrot" width={36} height={44} />
                <div className="flex items-center gap-1">
                  <p className="text-white text-base md:text-2xl font-chakra font-semibold">
                    KARROTS
                  </p>
                  <p className="text-base md:text-2xl text-[#FFA100] font-chakra font-semibold">
                    {lootBoxRewards.karrots || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

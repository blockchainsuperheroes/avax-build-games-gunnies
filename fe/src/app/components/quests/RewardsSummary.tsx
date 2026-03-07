import React from 'react';
import Image from 'next/image';
import { Tooltip } from '../common/Tooltip';
import { useMedia } from 'react-use';

function RewardsSummary() {
  const isMobile = useMedia('(max-width: 768px)', true);

  return (
    <div className="border-[.5px] border-white rounded-[10px] p-5 md:px-8 md:py-8 mb-4 md:mb-10 max-w-[1569px] mx-auto gap-4 md:gap-0 mt-10">
      <p className="font-batgrexo text-3xl md:text-4xl text-center text-white font-bold uppercase py-6">
        OPEN LOOT BOXES TO EARN EXCITING REWARDS
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-2 md:gap-8">
        <div>
          <div className="flex items-center justify-start md:justify-center gap-2 md:gap-[22px] w-full md:w-[unset] md:grow order-3 md:order-none grow">
            <div className="w-[68px] md:w-fit flex items-center justify-center">
              <Image
                className="w-[48px] h-[53px] md:w-[84px] md:h-[92px]"
                src="/images/quests/star-circle.png"
                alt="Star"
                width={84}
                height={92}
              />
            </div>

            <div className="grow">
              <div className="flex items-center gap-1">
                <p className="text-white text-xl md:text-4xl font-semibold font-chakra uppercase">
                  Star
                </p>
              </div>

              <div className="flex items-center gap-1">
                <p className=" md:block text-white md:text-2xl font-semibold font-chakra uppercase">
                  5-40
                </p>
              </div>
            </div>
          </div>
          <p className="text-base font-sora text-white mt-5">
            Earn stars by opening loot boxes or getting kills in-game. The more stars you collect,
            the higher you’ll climb on the competitive leaderboard.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-start md:justify-center gap-2 md:gap-[22px] md:w-[unset] md:grow order-4 md:order-none grow">
            <div className="w-[68px] md:w-fit flex items-center justify-center">
              <Image
                className="w-[48px] h-[53px] md:w-[84px] md:h-[92px]"
                src="/images/quests/gcoin.png"
                alt="G Coin"
                width={84}
                height={92}
              />
            </div>

            <div className="grow">
              <div className="flex items-center gap-1">
                <p className="text-white text-xl md:text-4xl font-semibold font-chakra uppercase">
                  Coin
                </p>
              </div>

              <div className="flex items-center gap-1">
                <p className=" md:block text-white md:text-2xl font-semibold font-chakra uppercase">
                  10-40
                </p>
              </div>
            </div>
          </div>
          <p className="text-base font-sora text-white mt-5">
            Coins are in-game currency used to buy Cosmetics, Weapons & Skill Cards.
          </p>
        </div>
        <div>
          <div className="flex items-center justify-start md:justify-center gap-2 md:gap-[22px] md:w-[unset] md:grow order-2 md:order-none grow">
            <div className="w-[68px] md:w-fit flex items-center justify-center">
              <Image
                className="w-[38px] h-[55px] md:w-[66px] md:h-[96px]"
                src="/images/quests/carrot.png"
                alt="Carrot"
                width={66}
                height={96}
              />
            </div>
            <div className="grow">
              <div className="flex items-center gap-1">
                <p className="text-white md:text-4xl font-semibold font-chakra uppercase">Karrot</p>
              </div>
              <div className="flex items-center gap-1">
                <p className=" md:block text-white md:text-2xl font-semibold font-chakra uppercase">
                  10-100
                </p>
              </div>
            </div>
          </div>
          <p className="text-base font-sora text-white mt-5">
            Karrots are premium currency for buying Legendary Loot Boxes and Battle Passes,
            available in the shop or from Avalanche/Avalanche chests.
          </p>
        </div>
      </div>
    </div>
  );
}

export default RewardsSummary;

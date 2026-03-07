import React, { useState } from 'react';
import Image from 'next/image';
import CountdownTimer from './Countdown';
import { Tooltip } from '../common/Tooltip';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import RewardsTableModal from './RewardsTableModal';

function Banner() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="relative">
      <div className="relative w-full md:max-w-[1573px] mx-auto mt-10 md:mt-[60px] rounded-lg">
        <Image
          src="/images/leaderboard/banner.png"
          alt="banner"
          width={1573}
          height={438}
          className="w-full h-auto"
        />
        <p className="uppercase text-3xl md:text-[125px] font-batgrexo text-[#FD3300] absolute top-[calc(50%_-_30px)] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center [text-shadow:-4px_2px_0px_white,-2px_5px_0px_white,6px_2px_0px_white,0px_-5px_0px_white,6px_-5px_0px_white,-4px_-4px_0px_white,0px_15px_6px_black]">
          GLOBAL LEADERBOARD
        </p>
        <div className="flex flex-col items-center justify-center gap-0 md:gap-4 absolute -bottom-4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
          <p className="text-base md:text-6xl text-center font-batgrexo md:[text-shadow:-4px_2px_0px_red,-2px_5px_0px_red,6px_2px_0px_red,0px_-5px_0px_red,6px_-5px_0px_red,-4px_-4px_0px_red,0px_15px_6px_black]">
            Season 1 is live!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FFA83D] text-black font-charka font-semibold px-2 md:px-6 py-1 md:py-2 rounded-lg shadow-lg text-[11px] md:text-base"
          >
            Rewards Table
          </button>
        </div>
      </div>

      {/* <div className="hidden md:block absolute bottom-12 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <CountdownTimer />
      </div> */}

      <div className="hidden md:grid grid-cols-[100px_2fr_3fr] gap-8 bg-[#FFAD00] max-w-[1573px] mx-auto px-10 py-5 rounded-b-lg relative bottom-1">
        <div className="col-span-1">
          <p className="text-black text-xl font-charka font-semibold uppercase text-left">Rank</p>
        </div>
        <div className="col-span-1">
          <p className="text-black text-xl font-charka font-semibold uppercase text-left ml-8">
            Player
          </p>
        </div>
        <div>
          <p className="text-black text-xl font-charka font-semibold uppercase text-center">
            Collected Star
          </p>
        </div>
        {/* <div className="col-span-1">
          <p className="text-black text-xl font-charka font-semibold uppercase text-left">
            Rewards
          </p>
        </div>
        <div className="col-span-1">
          <Tooltip
            content={
              <p className="text-white text-base font-normal font-chakra line-clamp-2">
                Earn leaderboard rewards - applicable <br /> only for web3 version.
              </p>
            }
            position="bottom-left"
            offsetX={-40}
          >
            <p className="text-black text-xl font-charka font-semibold uppercase text-left">
              Extra rewards
            </p>
            <div className="flex items-center gap-2">
              <p className="text-black text-xl font-charka font-semibold uppercase text-left">
                (Kaboom Pass)
              </p>
              <InformationCircleIcon width={24} height={24} className="text-black" />
            </div>
          </Tooltip>
        </div> */}
      </div>

      {/* <div className="block md:hidden">
        <CountdownTimer />
      </div> */}

      <RewardsTableModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default Banner;

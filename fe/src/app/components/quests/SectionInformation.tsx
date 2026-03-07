'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import KnowYourRewardsModal from './KnowYourRewardsModal';
import KaboomPassModal from './KaboomPassModal';

function SectionInformation() {
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isKaboomPassModalOpen, setIsKaboomPassModalOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-[1569px] mx-auto mb-8 md:mb-12">
        {/* Know Your Rewards Card */}
        <button
          onClick={() => setIsRewardsModalOpen(true)}
          className="relative group overflow-hidden rounded-lg border border-white hover:border-[#1CBBBC] transition-all duration-300 cursor-pointer"
        >
          <div className="relative h-[150px] md:h-[200px]">
            {/* Background Image Overlay */}
            <div className="absolute inset-0 bg-[url('/images/quests/bg-rewards.png')] [background-size:110%_230px] bg-center bg-no-repeat" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center gap-3 md:gap-4 px-4">
              <Image
                src="/assets/icons/gift.svg"
                alt="Rewards"
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12"
              />
              <h3 className="font-chakra text-xl md:text-2xl lg:text-3xl font-bold text-white text-center uppercase tracking-wide">
                Know Your Rewards
              </h3>
            </div>
          </div>
        </button>

        {/* Earn More with Kaboom Pass Card */}
        <button
          onClick={() => setIsKaboomPassModalOpen(true)}
          className="relative group overflow-hidden rounded-lg border border-white hover:border-[#1CBBBC] transition-all duration-300 cursor-pointer"
        >
          <div className="relative h-[150px] md:h-[200px]">
            {/* Background Image Overlay */}
            <div className="absolute inset-0 bg-[url('/images/quests/bg-kaboom-rewards.png')] [background-size:110%_230px] bg-center bg-no-repeat" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center gap-3 md:gap-4 px-4">
              <Image
                src="/assets/icons/thunder.svg"
                alt="Thunder"
                width={48}
                height={48}
                className="w-10 h-10 md:w-12 md:h-12"
              />
              <h3 className="font-chakra text-xl md:text-2xl lg:text-3xl font-bold text-white text-center uppercase tracking-wide">
                Earn More with Kaboom Pass
              </h3>
            </div>
          </div>
        </button>
      </div>

      {/* Modals */}
      <KnowYourRewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
      />
      <KaboomPassModal
        isOpen={isKaboomPassModalOpen}
        onClose={() => setIsKaboomPassModalOpen(false)}
      />
    </>
  );
}

export default SectionInformation;

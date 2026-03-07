'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ROUTES } from '@/app/constants/routes';
import Link from 'next/link';
import KaboomPassModal from './KaboomPassModal';
import PremiumPerksModal from './PremiumPerksModal';

function SectionPlayMore() {
  const [isKaboomPassModalOpen, setIsKaboomPassModalOpen] = useState(false);
  const [isPremiumPerksModalOpen, setIsPremiumPerksModalOpen] = useState(false);

  return (
    <div className="max-w-[1569px] mx-auto py-8 space-y-6">
      {/* Bottom Section - Two Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gunnies Gang Card */}
        <div className="rounded-2xl border border-white p-6 md:p-8 overflow-hidden bg-[url('/images/quests/bg-gangs.png')] bg-cover bg-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:min-w-[280px] md:max-w-[258px] md:shrink-0">
              <h3 className="text-white text-2xl md:text-[28px] font-chakra font-bold uppercase mb-4 leading-tight">
                Boost Your <br /> Game. Reap The Rewards.
              </h3>
              <p className="text-white text-xs md:text-base font-chakra mb-6 uppercase">
                Unlock exclusive rewards every day.
              </p>
              <button
                onClick={() => setIsPremiumPerksModalOpen(true)}
                className="inline-block bg-transparent hover:bg-white/10 text-white text-base md:text-lg font-chakra font-bold uppercase py-3 px-8 rounded-lg border-2 border-white transition-colors w-full text-center"
              >
                Learn More
              </button>
            </div>
            <div className="shrink-0">
              <Image
                src="/images/quests/gang-logo-v2.png"
                alt="Gunnies Gang"
                width={300}
                height={239}
                className="w-[346px]"
              />
            </div>
          </div>
        </div>

        {/* Kaboom Pass Card */}
        <div className="relative rounded-2xl border border-white p-6 md:p-8 bg-[url('/images/quests/bg-burn.png')] bg-cover bg-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:min-w-[258px] md:max-w-[258px] md:shrink-0">
              <h3 className="text-white text-2xl md:text-[28px] font-chakra font-bold uppercase mb-4 leading-tight">
                Unlock Mayhem. Dominate The Boom.
              </h3>
              <p className="text-white text-xs md:text-base font-chakra mb-6 uppercase">
                More fun with a Kaboom Pass & earn more rewards.
              </p>
              <button
                onClick={() => setIsKaboomPassModalOpen(true)}
                className="inline-block bg-transparent hover:bg-white/10 text-white text-base md:text-lg font-chakra font-bold uppercase py-3 px-8 rounded-lg border-2 border-white transition-colors w-full text-center"
              >
                Buy Pass
              </button>
            </div>
            <div className="w-[282px] shrink-0">
              <Image
                src="/images/quests/kaboom-v2.png"
                alt="Kaboom Pass"
                width={202}
                height={184}
                className="w-[282px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Kaboom Pass Modal */}
      <KaboomPassModal
        isOpen={isKaboomPassModalOpen}
        onClose={() => setIsKaboomPassModalOpen(false)}
      />

      {/* Premium Perks Modal */}
      <PremiumPerksModal
        isOpen={isPremiumPerksModalOpen}
        onClose={() => setIsPremiumPerksModalOpen(false)}
      />
    </div>
  );
}

export default SectionPlayMore;

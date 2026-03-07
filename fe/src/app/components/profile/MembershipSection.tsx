'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import PremiumPerksModal from '../quests/PremiumPerksModal';

interface MembershipSectionProps {
  onViewBenefits: () => void;
}

export const MembershipSection = ({ onViewBenefits }: MembershipSectionProps) => {
  const { hasSubscription, isLoading, expirationDate } = useSubscriptions();
  const [isPremiumPerksModalOpen, setIsPremiumPerksModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-black rounded-xl py-5 px-6 mb-5 md:mb-12 border-[0.5px] border-[#7E7E7E]">
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // If user has subscription, show the subscribed UI
  if (hasSubscription) {
    return (
      <div className="bg-black rounded-xl py-5 px-6 mb-5 md:mb-12 border-[0.5px] border-[#7E7E7E]">
        <div className="flex flex-col md:flex-row items-center gap-5 md:gap-10">
          <div className="flex-shrink-0">
            <Image
              src="/images/profile/gunnies-gang.png"
              alt="Gunnies Gang"
              width={223}
              height={177}
            />
          </div>
          <div className="flex-1">
            <p className="text-white text-xl md:text-2xl font-bold font-chakra uppercase mb-3 text-center md:text-left">
              YOU'VE SUBSCRIBED THE GUNNIES GANG MEMBERSHIP
            </p>
            <button
              onClick={onViewBenefits}
              className="border border-white rounded-lg px-8 py-3 hover:bg-white/20 transition-colors w-full md:w-auto"
            >
              <p className="text-sm font-chakra font-bold">
                {expirationDate
                  ? `THE MEMBERSHIP EXPIRES ON ${expirationDate}`
                  : 'THE MEMBERSHIP EXPIRES ON 01/01/2027'}
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user doesn't have subscription, show promotional banner
  return (
    <div className="relative rounded-2xl border border-white p-6 md:p-8 overflow-hidden mb-5 md:mb-12">
      <div className="absolute inset-0 bg-[url('/images/quests/bg-gangs.png')] bg-cover bg-center" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="w-full md:w-1/2">
          <h3 className="text-white text-2xl md:text-[28px] font-chakra font-bold uppercase mb-4 leading-tight">
            Boost Your Game. Reap The Rewards.
          </h3>
          <p className="text-white/80 text-xs md:text-base font-chakra mb-6">
            Unlock exclusive rewards every day.
          </p>
          <button
            onClick={() => setIsPremiumPerksModalOpen(true)}
            className="inline-block bg-transparent hover:bg-white/10 text-white text-base md:text-lg font-chakra font-bold uppercase py-3 px-8 rounded-lg border-2 border-white transition-colors w-full text-center"
          >
            Learn More
          </button>
        </div>
        <div className="flex-shrink-0 flex-1">
          <Image
            src="/images/quests/gang-logo.png"
            alt="Gunnies Gang"
            width={300}
            height={239}
            className="w-[306px]"
          />
        </div>
      </div>

      <PremiumPerksModal
        isOpen={isPremiumPerksModalOpen}
        onClose={() => setIsPremiumPerksModalOpen(false)}
      />
    </div>
  );
};

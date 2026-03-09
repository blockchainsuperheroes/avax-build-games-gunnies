'use client';

import { Banner } from '@/app/components/quests/Banner';
import ProgressSection from '@/app/components/quests/ProgressSection';
import QuestSectionAvax from '@/app/components/quests/QuestSectionAvax';
import RewardsSummary from '@/app/components/quests/RewardsSummary';
import { useSyncRewards } from '@/app/components/quests/syncRewards';
import {
  CHAIN_CHEST,
  QUESTS_CONFIG,
  REMAINING_CHESTS,
  USER_TYPES,
} from '@/app/constants/questsConfig';
import { useRef, useEffect } from 'react';
import { useResponsiveScale } from '@/hooks/useResponsiveScale';
import { useChestCount, useHasAvaxPremiumUserChests } from '@/hooks/useChestCount';
import { useMedia } from 'react-use';
import { EXTERNAL_LINK } from '@/app/constants/external_link';
import { useGlobalContext } from '@/app/providers/GlobalProvider';
import { toast } from 'react-toastify';
import SectionPlayMore from '@/app/components/quests/SectionPlayMore';
import AvaxPrimeSection from '@/app/components/avax/AvaxPrimeSection';
import AvaxMintSection from '@/app/components/avax/AvaxMintSection';
import AvaxInfoContent from '@/app/components/avax/AvaxInfoContent';
import KillBalanceDisplay from '@/app/components/avax/KillBalanceDisplay';

export default function AvaxPage() {
  useSyncRewards();
  const maxChest = QUESTS_CONFIG.maxChest;
  const avaxPremiumUserChests = useHasAvaxPremiumUserChests();
  const isMobile = useMedia('(max-width: 768px)', true);
  const { showLoginSignUpModal, isAuthenticated } = useGlobalContext();

  const { claimed: completedAvax, remaining: remainingChestTodayAvax } = useChestCount({
    remainingChestType: REMAINING_CHESTS.AVAX,
    userType: USER_TYPES.NORMAL_USER,
  });

  const { claimed: completedAvaxPremium, remaining: remainingChestTodayAvaxPremium } =
    useChestCount({
      remainingChestType: REMAINING_CHESTS.AVAX,
      userType: USER_TYPES.PREMIUM_USER,
    });

  const totalCompletedAvax =
    completedAvax + (avaxPremiumUserChests ? completedAvaxPremium : 0);
  const totalAvaxChests = maxChest * 2;
  const percentAvax = Math.round((totalCompletedAvax / totalAvaxChests) * 100);

  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { isScaled, scale } = useResponsiveScale({ ref: sectionRef, scaleOverride: 0.8 });

  useEffect(() => {
    if (wrapperRef.current && sectionRef.current && !isMobile) {
      const unscaledHeight = sectionRef.current.scrollHeight;
      wrapperRef.current.style.height = `${unscaledHeight * scale + 100}px`;
    }
  }, [scale, isScaled, isMobile]);

  return (
    <div ref={wrapperRef} className="xl:flex xl:justify-center" style={{ overflow: 'hidden' }}>
      <section
        ref={sectionRef}
        className={`w-full max-w-[1920px] mx-auto px-3 md:px-8 2xl:px-16 design-container transition-opacity duration-200 ${
          isScaled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Title */}
        <div className="my-12">
          <p className="font-chakra text-4xl md:text-[60px] font-bold text-center linear-grad1 uppercase mb-4">
            YOUR ALL TIME LOOT BOX REWARD
          </p>
          <p className="font-chakra text-lg md:text-2xl text-center text-[#E84142] font-bold uppercase mb-2">
            Powered by Avalanche
          </p>
          {!isAuthenticated && (
            <p className="font-chakra text-base md:text-xl text-center text-white linear-grad1 font-bold uppercase">
              <span
                className="cursor-pointer border-b-2 border-white pb-[2px]"
                onClick={() => {
                  if (isAuthenticated) {
                    toast.info('Already logged in');
                  } else {
                    showLoginSignUpModal();
                  }
                }}
              >
                Login the game
              </span>{' '}
              to see your IN-GAME total stats
            </p>
          )}
        </div>

        {/* Banner - balances */}
        <Banner />

        {/* Kill Balance Display */}
        <div className="mt-6 mb-4">
          <KillBalanceDisplay />
        </div>

        {/* Rewards Summary */}
        <RewardsSummary />

        {/* Kaboom Pass Mint Section */}
        <AvaxMintSection />

        {/* More Perks Section */}
        <div className="mt-4 md:mt-32">
          <p className="hidden md:block font-chakra text-4xl md:text-[60px] font-bold text-center linear-grad1 uppercase mb-4">
            more perks, more fun
          </p>
          <SectionPlayMore />
        </div>

        {/* Daily Loot Box Section */}
        <p className="font-chakra text-4xl md:text-[60px] text-center md:leading-[66px] text-white linear-grad1 font-bold uppercase py-6 mt-6 md:mt-[120px] mb-6 md:mb-16">
          CHECK IN DAILY & CLAIM YOUR <br /> loot box REWARDS
        </p>

        {/* Avalanche Loot Boxes - No tabs needed, AVAX only */}
        <div className="border-[18px] border-[#E84142] rounded-2xl mx-auto shadow-[0px_0px_36px_0px_rgba(232,65,66,0.3)] max-w-[1569px]">
          <ProgressSection
            image="/images/quests/avax-logo.png"
            width={267}
            height={90}
            percent={percentAvax}
            content={<AvaxInfoContent />}
          />
          <QuestSectionAvax userType={USER_TYPES.NORMAL_USER} />
          <AvaxPrimeSection />
        </div>

        {/* Support Button */}
        <button
          type="button"
          className="bg-[#E84142] hover:bg-[#c73536] transition-colors px-8 md:px-16 py-4 md:py-6 rounded-lg mx-auto mt-8 md:mt-[100px] w-fit block"
          onClick={() => window.open(EXTERNAL_LINK.SUPPORT_FORM, '_blank', 'noopener,noreferrer')}
        >
          <p className="text-white font-semibold text-xl md:text-2xl font-chakra text-center uppercase">
            Got trouble? Let us know
          </p>
        </button>
      </section>
    </div>
  );
}

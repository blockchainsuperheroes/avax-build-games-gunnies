'use client';

import { Banner } from '@/app/components/quests/Banner';
import ProgressSection from '@/app/components/quests/ProgressSection';
import RewardsSummary from '@/app/components/quests/RewardsSummary';
import SectionInformation from '@/app/components/quests/SectionInformation';
import { useSyncRewards } from '@/app/components/quests/syncRewards';
import {
  CHAIN_CHEST,
  QUESTS_CONFIG,
  REMAINING_CHESTS,
  USER_TYPES,
} from '@/app/constants/questsConfig';
import { useRef, useEffect } from 'react';
import PrimeSection from '@/app/components/quests/PrimeSection';
import { useResponsiveScale } from '@/hooks/useResponsiveScale';
import { useChestCount } from '@/hooks/useChestCount';
import Image from 'next/image';
import ModalEvent from '@/app/components/quests/ModalEvent';
import { useReleaseWeekPopup } from '@/hooks/useReleaseWeekPopup';
import { useMedia } from 'react-use';
import { EXTERNAL_LINK } from '@/app/constants/external_link';
import { useGlobalContext } from '@/app/providers/GlobalProvider';
import { toast } from 'react-toastify';
import SectionPlayMore from '@/app/components/quests/SectionPlayMore';

export default function Page() {
  useSyncRewards();
  const maxChest = QUESTS_CONFIG.maxChest;
  const { showPopup: showReleasePopup, closePopup: closeReleasePopup } = useReleaseWeekPopup(
    3000,
    '2025-06-20'
  );
  const isMobile = useMedia('(max-width: 768px)', true);
  const { showLoginSignUpModal, isAuthenticated } = useGlobalContext();

  const { claimed: completedAvax, remaining: remainingChestTodayAvax } = useChestCount({
    remainingChestType: REMAINING_CHESTS.AVAX,
    userType: USER_TYPES.NORMAL_USER,
  });

  const totalCompletedAvax = completedAvax;
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
        <div className="my-12">
          <p className="font-chakra text-4xl md:text-[60px] font-bold text-center linear-grad1 uppercase mb-4">
            YOUR ALL TIME LOOT BOX REWARD
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

        <Banner />

        <RewardsSummary />

        <div className="mt-4 md:mt-32">
          <p className="hidden md:block font-chakra text-4xl md:text-[60px] font-bold text-center linear-grad1 uppercase mb-4">
            more perks, more fun
          </p>
          <SectionPlayMore />
        </div>

        <p className="font-chakra text-4xl md:text-[60px] text-center md:leading-[66px] text-white linear-grad1 font-bold uppercase py-6 mt-6 md:mt-[120px] mb-6 md:mb-16">
          CHECK IN DAILY & CLAIM YOUR <br /> loot box REWARDS
        </p>

        {/* AVAX Tab */}
        <div className="flex flex-row justify-center items-end max-w-[1569px] mx-auto flex-wrap relative">
          <div className="relative z-30 transform scale-105">
            <div
              className="relative w-[253px] h-20 flex items-center justify-center bg-[#E84142] text-white shadow-lg"
              style={{
                clipPath:
                  'polygon(0% 100%, 10px 6px, 16px 0px, calc(100% - 20px) -7px, calc(100% - 11px) 6px, 100% 100%)',
              }}
            >
              <div className="flex items-center gap-2 mt-[-8px]">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2L28 26H4L16 2Z" fill="white"/>
                </svg>
                <span className="font-chakra font-bold text-2xl text-white">AVALANCHE</span>
              </div>
            </div>
          </div>
        </div>

        {/* AVAX Content */}
        <div className="border-[18px] border-[#E84142] rounded-2xl mx-auto shadow-[0px_0px_36px_0px_rgba(232,65,66,0.3)] max-w-[1569px]">
          <ProgressSection
            image="/images/quests/avax-logo.png"
            width={267}
            height={90}
            percent={percentAvax}
            content={<ContentAvax />}
          />
          <PrimeSection
            type={REMAINING_CHESTS.AVAX}
            image="/images/quests/buy-avax-nft.png"
            width={1090}
            height={138}
            chainChest={CHAIN_CHEST.AVAX}
          />
        </div>

        <button
          type="button"
          className="bg-[#E84142] hover:bg-[#c73536] transition-colors px-8 md:px-16 py-4 md:py-6 rounded-lg mx-auto mt-8 md:mt-[100px] w-fit block"
          onClick={() => window.open(EXTERNAL_LINK.SUPPORT_FORM, '_blank', 'noopener,noreferrer')}
        >
          <p className="text-white font-semibold text-xl md:text-2xl font-chakra text-center uppercase">
            Got trouble? Let us know
          </p>
        </button>

        <ModalEvent isOpen={showReleasePopup} onClose={closeReleasePopup} />
      </section>
    </div>
  );
}

const ContentAvax = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3">
        <svg width="120" height="130" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 10L110 110H10L60 10Z" fill="#E84142" stroke="white" strokeWidth="3"/>
          <text x="60" y="85" textAnchor="middle" fill="white" fontFamily="sans-serif" fontSize="24" fontWeight="bold">A</text>
        </svg>
        <div>
          <p className="text-[#E84142] text-2xl md:text-4xl font-bold font-chakra text-center uppercase">
            How do I get AVAX tokens?
          </p>
          <p className="text-white text-xl md:text-2xl font-normal font-chakra text-center md:px-4">
            AVAX is the native token of the Avalanche network, used for gas fees, staking, and governance.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start justify-center gap-4 mt-8">
        <div>
          <p className="text-[#FF8F00] text-base font-bold font-chakra uppercase">
            Step 1: Add the Avalanche C-Chain network to your wallet
          </p>
          <p className="text-white text-base font-normal font-chakra">
            Go to: Network &gt; Add Network &gt; Add manually
          </p>
          <p className="text-white text-base font-normal font-chakra">Use these details:</p>
          <div className="ml-4">
            <li className="text-white text-base font-normal font-chakra">
              Network Name: Avalanche C-Chain
            </li>
            <li className="text-white text-base font-normal font-chakra">
              RPC URL:{' '}
              <a
                href="https://api.avax.network/ext/bc/C/rpc"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                https://api.avax.network/ext/bc/C/rpc
              </a>
            </li>
            <li className="text-white text-base font-normal font-chakra">Chain ID: 43114</li>
            <li className="text-white text-base font-normal font-chakra">Currency Symbol: AVAX</li>
            <li className="text-white text-base font-normal font-chakra">
              Block Explorer:{' '}
              <a
                className="underline"
                href="https://snowtrace.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://snowtrace.io
              </a>
            </li>
          </div>
        </div>

        <div>
          <p className="text-[#FF8F00] text-base font-bold font-chakra uppercase">
            Testnet (Fuji) Details:
          </p>
          <div className="ml-4">
            <li className="text-white text-base font-normal font-chakra">
              Network Name: Avalanche Fuji Testnet
            </li>
            <li className="text-white text-base font-normal font-chakra">
              RPC URL:{' '}
              <a
                href="https://api.avax-test.network/ext/bc/C/rpc"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                https://api.avax-test.network/ext/bc/C/rpc
              </a>
            </li>
            <li className="text-white text-base font-normal font-chakra">Chain ID: 43113</li>
            <li className="text-white text-base font-normal font-chakra">Currency Symbol: AVAX</li>
            <li className="text-white text-base font-normal font-chakra">
              Block Explorer:{' '}
              <a
                className="underline"
                href="https://testnet.snowtrace.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://testnet.snowtrace.io
              </a>
            </li>
          </div>
        </div>

        <div>
          <p className="text-[#FF8F00] text-base font-bold font-chakra uppercase">
            Step 2: Buy AVAX tokens
          </p>

          <p className="text-white text-base font-normal font-chakra">Available on:</p>
          <div className="ml-4">
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://www.coinbase.com/" target="_blank" rel="noopener noreferrer" className="underline">Coinbase</a>
            </li>
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://www.binance.com/" target="_blank" rel="noopener noreferrer" className="underline">Binance</a>
            </li>
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://www.kucoin.com/" target="_blank" rel="noopener noreferrer" className="underline">KuCoin</a>
            </li>
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://www.kraken.com/" target="_blank" rel="noopener noreferrer" className="underline">Kraken</a>
            </li>
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://www.okx.com/" target="_blank" rel="noopener noreferrer" className="underline">OKX</a>
            </li>
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://traderjoexyz.com/" target="_blank" rel="noopener noreferrer" className="underline">Trader Joe (DEX)</a>
            </li>
          </div>
        </div>

        <p className="text-white text-base font-normal font-chakra mt-4 mb-8 md:mb-24">
          Search for AVAX/USDT or AVAX/USD, trade, and withdraw to your wallet on Avalanche C-Chain.
        </p>
      </div>
    </>
  );
};

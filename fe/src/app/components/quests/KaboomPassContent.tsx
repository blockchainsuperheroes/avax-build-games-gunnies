'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import useMintAvalanche from '@/hooks/useMintAvalanche';
import useMintAvalanche from '@/hooks/useMintAvalanche';
import useMintAvalanche from '@/hooks/useMintAvalanche';
import { useAccount, useSwitchChain } from 'wagmi';
import { toast } from 'react-toastify';
import { avalancheFuji, avalanche } from 'viem/chains';
import { AvalancheMainnet } from '@/app/constants/chains';
import { UserRejectedRequestError } from 'viem';
import {
  useHasAvalanchePremiumUserChests,
  useHasAvalanchePremiumUserChests,
  useHasAvalanchePremiumUserChests,
} from '@/hooks/useChestCount';
import { useGlobalContext } from '@/app/providers/GlobalProvider';

const DynamicReactPlayer = dynamic(() => import('react-player'), { ssr: false });

interface KaboomPassNFTCardProps {
  isMounted: boolean;
}

export function KaboomPassNFTCard({ isMounted }: KaboomPassNFTCardProps) {
  return (
    <div className="flex-shrink-0 mx-auto lg:mx-0">
      <div className="relative w-[200px]">
        <div className="absolute inset-0 bg-[#EF6C00] blur-2xl z-0" />
        <div className="relative z-10 rounded-xl overflow-hidden">
          {isMounted && (
            <DynamicReactPlayer
              playing
              url="/assets/gunnies-nft.webm"
              width="100%"
              height="100%"
              controls={false}
              loop
              muted
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface BenefitItem {
  icon: string;
  iconAlt: string;
  multiplier: string;
  title: string;
}

interface KaboomPassBenefitsProps {
  benefits?: BenefitItem[];
}

const defaultBenefits: BenefitItem[] = [
  {
    icon: '/images/lock.png',
    iconAlt: 'Chest',
    multiplier: 'x5',
    title: 'Eligible For Prime Chests Rewards [CHAIN-SPECIFIC]',
  },
  {
    icon: '/images/crown.png',
    iconAlt: 'Crown',
    multiplier: '2x',
    title: 'Double Leaderboard Rewards',
  },
  {
    icon: '/images/gunnies-gang.png',
    iconAlt: 'Badge',
    multiplier: '1',
    title: '1 Year Gunnies Gang Membership (120$ Worth)',
  },
];

export function KaboomPassBenefits({ benefits = defaultBenefits }: KaboomPassBenefitsProps) {
  return (
    <div className="w-full md:w-[unset] md:max-w-[600px] space-y-6">
      {benefits.map((benefit, index) => (
        <div key={index} className="relative">
          <div className="flex-shrink-0 w-[70px] h-[70px] flex items-center justify-center rounded-lg absolute top-1/2 left-6 md:left-0 transform -translate-x-1/2 -translate-y-1/2">
            <Image src={benefit.icon} alt={benefit.iconAlt} width={70} height={70} />
          </div>
          <div className="flex items-center gap-3 md:gap-4 w-[80dvw] md:w-[380px] bg-[#1CBBBC] rounded-lg pl-16 md:pl-12 pr-4 py-2 border border-white">
            <span className="text-white text-2xl md:text-4xl font-chakra font-bold w-[30px] text-center">
              {benefit.multiplier}
            </span>
            <div className="flex-1">
              <p className="text-white text-xs md:text-sm font-chakra font-bold uppercase leading-tight">
                {benefit.title.split('[').map((part, i) => {
                  if (i === 0) return part;
                  return (
                    <React.Fragment key={i}>
                      <br />
                      {'[' + part}
                    </React.Fragment>
                  );
                })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ChainButton {
  logo: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  label: string;
  onClick: () => void;
  isLoading: boolean;
  isEquipped: boolean;
  loadingText?: string;
  className?: string;
}

interface KaboomPassBuyButtonsProps {
  buttons: ChainButton[];
}

export function KaboomPassBuyButtons({ buttons }: KaboomPassBuyButtonsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-[1100px] mx-auto mb-8 md:mb-12">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          disabled={button.isLoading || button.isEquipped}
          className={`${
            button.isEquipped
              ? 'bg-[#272727] border border-white cursor-not-allowed'
              : 'bg-transparent border border-white hover:bg-white/10'
          } rounded-[20px] py-3 md:py-4 px-4 md:px-8 flex flex-row md:flex-col items-center justify-between md:justify-center gap-2 md:gap-3 transition-colors disabled:cursor-not-allowed`}
        >
          <Image
            src={button.logo}
            alt={button.logoAlt}
            width={button.logoWidth}
            height={button.logoHeight}
            className={button.className}
          />
          {button.isEquipped ? (
            <div className="flex items-center gap-2">
              <p className="text-[#FF9505] text-[10px] md:text-base font-bold font-batgrexo uppercase text-center">
                KABOOM PASS NFT EQUIPPED
              </p>
              <Image
                src="/images/quests/check-mark.png"
                alt="checked mark"
                width={30}
                height={30}
                className='md:w-[30px] md:h-[30px] w-[26px] h-[26px]'
              />
            </div>
          ) : (
            <p className="text-white text-[10px] md:text-base font-bold font-chakra uppercase">
              {button.isLoading ? button.loadingText || 'Loading...' : button.label}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}

interface KaboomPassMainContentProps {
  isMounted: boolean;
  benefits?: BenefitItem[];
  buttons: ChainButton[];
  isHideButton?: boolean;
}

export function KaboomPassMainContent({
  isMounted,
  benefits,
  buttons,
  isHideButton = false,
}: KaboomPassMainContentProps) {
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 md:gap-20 items-center justify-center mb-8 md:mb-12 mx-auto">
        <KaboomPassNFTCard isMounted={isMounted} />
        <KaboomPassBenefits benefits={benefits} />
      </div>
      {!isHideButton && <KaboomPassBuyButtons buttons={buttons} />}
    </>
  );
}

// Complete component with all logic included
export function KaboomPassContentWithLogic({ isHideButton }: { isHideButton?: boolean }) {
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { showWalletDetectionModal } = useGlobalContext();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const avaxPremiumUserChests = useHasAvalanchePremiumUserChests();
  const corePremiumUserChests = useHasAvalanchePremiumUserChests();
  const avalanchePremiumUserChests = useHasAvalanchePremiumUserChests();

  const handleMint = async (chainId: number) => {
    try {
      if (!isConnected) {
        showWalletDetectionModal(() => {
          handleMint(chainId);
        });
        return;
      }

      const result = await switchChainAsync({ chainId });

      if (isLoadingAvalanche || isLoadingAvalanche || isLoadingAvalanche) {
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.id === avalancheFuji.id) {
        await mintAvalanche(chainId);
      } else if (result.id === AvalancheMainnet.id) {
        await mintAvalanche(chainId);
      } else {
        await mintAvalanche(chainId);
      }
    } catch (error: any) {
      if (error instanceof UserRejectedRequestError) {
        toast.warn('Transaction cancelled');
      } else if (error.message.includes('Insufficient balance')) {
        toast.error('Insufficient balance');
      } else if (error.message.includes('User rejected the request')) {
        toast.error('User rejected the request');
      } else {
        toast.error('Mint failed');
      }
    }
  };

  return (
    <KaboomPassMainContent
      isMounted={isMounted}
      isHideButton={isHideButton}
      buttons={[
        {
          logo: '/images/quests/avax-logo.png',
          logoAlt: 'Avalanche',
          logoWidth: 131,
          logoHeight: 33,
          label: 'Buy Avalanche Kaboom Pass',
          onClick: () => handleMint(avalanche.id),
          isLoading: isLoadingAvalanche,
          isEquipped: avaxPremiumUserChests,
          loadingText: 'Minting...',
          className: 'md:w-[131px] md:h-[33px] w-[63px] h-[16px]',
        },
        {
          logo: '/images/quests/core-logo.png',
          logoAlt: 'Avalanche',
          logoWidth: 108,
          logoHeight: 36,
          label: 'Buy Avalanche Kaboom Pass',
          onClick: () => handleMint(avalancheFuji.id),
          isLoading: isLoadingAvalanche,
          isEquipped: corePremiumUserChests,
          loadingText: 'Minting...',
          className: 'md:w-[108px] md:h-[36px] w-[60px] h-[20px]',
        },
        {
          logo: '/images/quests/pen-chain.png',
          logoAlt: 'Avalanche',
          logoWidth: 161,
          logoHeight: 41,
          label: 'Buy Avalanche Kaboom Pass',
          onClick: () => handleMint(AvalancheMainnet.id),
          isLoading: isLoadingAvalanche,
          isEquipped: avalanchePremiumUserChests,
          loadingText: 'Minting...',
          className: 'md:w-[161px] md:h-[41px] w-[66px] h-[18px]',
        },
      ]}
    />
  );
}

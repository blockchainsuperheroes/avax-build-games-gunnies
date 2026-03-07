'use client';

import React, { useEffect, useState } from 'react';
import { KaboomPassNFTCard } from '../quests/KaboomPassContent';
import Image from 'next/image';
import clsx from 'clsx';
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

export const KaboomPassSection = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { showWalletDetectionModal } = useGlobalContext();
  const avaxPremiumUserChests = useHasAvalanchePremiumUserChests();
  const corePremiumUserChests = useHasAvalanchePremiumUserChests();
  const avalanchePremiumUserChests = useHasAvalanchePremiumUserChests();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      } else if (error.message?.includes('Insufficient balance')) {
        toast.error('Insufficient balance');
      } else if (error.message?.includes('User rejected the request')) {
        toast.error('User rejected the request');
      } else {
        toast.error('Mint failed');
      }
    }
  };

  return (
    <div className="rounded-lg px-5 py-7 md:p-12 mb-5 md:mb-12 border border-[#7E7E7E]">
      <h2 className="text-white text-[32px] md:text-[42px] font-bold font-batgrexo uppercase mb-5 md:mb-[28px] text-center md:text-left">
        YOUR KABOOM PASS
      </h2>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <KaboomPassNFTCard isMounted={isMounted} />
        <div className="flex-1 space-y-4">
          <KaboomPassChain
            name="AVAX"
            image="/images/quests/avax-logo.png"
            onClick={() => handleMint(avalanche.id)}
            isEquipped={avaxPremiumUserChests}
          />
          <KaboomPassChain
            name="AVAX"
            image="/images/quests/core-logo.png"
            onClick={() => handleMint(avalancheFuji.id)}
            isEquipped={corePremiumUserChests}
          />
          <KaboomPassChain
            name="AVAX"
            image="/images/quests/pen-chain.png"
            onClick={() => handleMint(AvalancheMainnet.id)}
            isEquipped={avalanchePremiumUserChests}
          />
        </div>
      </div>
    </div>
  );
};

const KaboomPassChain = ({
  name,
  image,
  onClick,
  isEquipped = false,
}: {
  name: string;
  image: string;
  onClick: () => void;
  isEquipped?: boolean;
}) => {
  return (
    <div
      className={clsx(
        'flex gap-4 items-center justify-between border border-[#7E7E7E] rounded-lg p-5 cursor-pointer w-full',
        isEquipped ? 'bg-[#313131]' : 'bg-transparent'
      )}
      onClick={() => {
        if (isEquipped) {
          return;
        }
        onClick();
      }}
    >
      <Image src={image} alt={name} width={109} height={28} />
      {isEquipped ? (
        <div className="flex items-center gap-2">
          <p className="hidden md:block text-xl font-batgrexo uppercase text-[#FF9505]">
            KABOOM PASS NFT EQUIPPED
          </p>
          <Image src="/images/quests/check-mark.png" alt="checked mark" width={26} height={26} />
        </div>
      ) : (
        <p className="text-white textsm md:text-base font-bold font-charka uppercase">
          BUY {name} KABOOM PASS
        </p>
      )}
    </div>
  );
};

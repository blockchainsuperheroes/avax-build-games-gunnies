import React, { useState, useMemo } from 'react';
import PrimeCard from './PrimeCard';
import Image from 'next/image';
import useMintAvalanche from '@/hooks/useMintAvalanche';
import { useAccount, useSwitchChain } from 'wagmi';
import { toast } from 'react-toastify';
import ChainSelectModal from '../common/ChainSelectModal';
import useMintAvalanche from '@/hooks/useMintAvalanche';
import { avalancheFuji } from 'viem/chains';
import KaboomPassModal from './KaboomPassModal';
import {
  REMAINING_CHESTS,
  RemainingChestType,
  USER_TYPES,
  ChainChest,
  CHAIN_CHEST,
} from '@/app/constants/questsConfig';
import QuestSectionAvalanche from './QuestSectionAvalanche';
import QuestSectionAvalanche from './QuestSectionAvalanche';
import {
  useHasAvalanchePremiumUserChests,
  useHasAvalanchePremiumUserChests,
  useHasAvalanchePremiumUserChests,
} from '@/hooks/useChestCount';
import QuestSectionAvalanche from './QuestSectionAvalanche';
import { UserRejectedRequestError } from 'viem';

interface PrimeSectionProps {
  image: string;
  width: number;
  height: number;
  type: RemainingChestType;
  chainChest: ChainChest;
}

export default function PrimeSection({
  image,
  width,
  height,
  type,
  chainChest,
}: PrimeSectionProps) {
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [isChainModalOpen, setIsChainModalOpen] = useState(false);
  const [isKaboomPassModalOpen, setIsKaboomPassModalOpen] = useState(false);
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const hasAvalanchePremium = useHasAvalanchePremiumUserChests();
  const hasAvalanchePremium = useHasAvalanchePremiumUserChests();
  const hasAvalanchePremium = useHasAvalanchePremiumUserChests();

  const handleChainSelect = async (chainId: number) => {
    try {
      const result = await switchChainAsync({ chainId });
      setIsChainModalOpen(false);

      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.id === avalancheFuji.id) {
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

  const handleMint = async () => {
    setIsKaboomPassModalOpen(true);
  };

  const renderPrimeCard = useMemo(() => {
    const hasPremium =
      chainChest === CHAIN_CHEST.AVAX
        ? hasAvalanchePremium
        : chainChest === CHAIN_CHEST.AVAX
          ? hasAvalanchePremium
          : hasAvalanchePremium;
    if (!hasPremium) {
      return (
        <div className="flex flex-wrap lg:flex-nowrap gap-2 md:gap-6 justify-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <PrimeCard key={index} />
          ))}
        </div>
      );
    } else {
      if (type === REMAINING_CHESTS.AVAX) {
        return <QuestSectionAvalanche userType={USER_TYPES.PREMIUM_USER} />;
      } else if (type === REMAINING_CHESTS.AVAX) {
        return <QuestSectionAvalanche userType={USER_TYPES.PREMIUM_USER} />;
      } else if (type === REMAINING_CHESTS.AVAX) {
        return <QuestSectionAvalanche userType={USER_TYPES.PREMIUM_USER} />;
      }
    }
  }, [type, chainChest, hasAvalanchePremium, hasAvalanchePremium, hasAvalanchePremium]);

  return (
    <>
      <ChainSelectModal
        isOpen={isChainModalOpen}
        onClose={() => setIsChainModalOpen(false)}
        onSelectChain={handleChainSelect}
      />
      <KaboomPassModal
        isOpen={isKaboomPassModalOpen}
        onClose={() => setIsKaboomPassModalOpen(false)}
      />

      <div className="px-4 md:px-8 py-4 md:py-12 w-fit mx-auto bg-[url('/images/quests/bg-subscriber.png')] bg-cover bg-center">
        {renderPrimeCard}

        <button
          onClick={handleMint}
          disabled={isLoadingAvalanche || isLoadingAvalanche}
          className="w-fit mx-auto mt-16 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image src={image} alt="Subscribe" width={width} height={height} />
        </button>
      </div>
    </>
  );
}

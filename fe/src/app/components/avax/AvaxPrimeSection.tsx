'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import useMintAvax from '@/hooks/useMintAvax';
import { useAccount, useSwitchChain } from 'wagmi';
import { toast } from 'react-toastify';
import { avalanche } from 'viem/chains';
import KaboomPassModal from '@/app/components/quests/KaboomPassModal';
import {
  REMAINING_CHESTS,
  USER_TYPES,
} from '@/app/constants/questsConfig';
import QuestSectionAvax from '@/app/components/quests/QuestSectionAvax';
import { useHasAvaxPremiumUserChests } from '@/hooks/useChestCount';
import PrimeCard from '@/app/components/quests/PrimeCard';
import { UserRejectedRequestError } from 'viem';

export default function AvaxPrimeSection() {
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [isKaboomPassModalOpen, setIsKaboomPassModalOpen] = useState(false);
  const { mint: mintAvax, isLoading: isLoadingAvax } = useMintAvax();
  const hasAvaxPremium = useHasAvaxPremiumUserChests();

  const handleMint = async () => {
    setIsKaboomPassModalOpen(true);
  };

  const renderPrimeCard = useMemo(() => {
    if (!hasAvaxPremium) {
      return (
        <div className="flex flex-wrap lg:flex-nowrap gap-2 md:gap-6 justify-center">
          {Array.from({ length: 5 }).map((_, index) => (
            <PrimeCard key={index} />
          ))}
        </div>
      );
    } else {
      return <QuestSectionAvax userType={USER_TYPES.PREMIUM_USER} />;
    }
  }, [hasAvaxPremium]);

  return (
    <>
      <KaboomPassModal
        isOpen={isKaboomPassModalOpen}
        onClose={() => setIsKaboomPassModalOpen(false)}
      />

      <div className="px-4 md:px-8 py-4 md:py-12 w-fit mx-auto bg-[url('/images/quests/bg-subscriber.png')] bg-cover bg-center">
        {renderPrimeCard}

        <button
          onClick={handleMint}
          disabled={isLoadingAvax}
          className="w-fit mx-auto mt-16 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Image
            src="/images/quests/buy-an-nft.png"
            alt="Buy Kaboom Pass"
            width={1090}
            height={138}
          />
        </button>
      </div>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import ModalOverlay from '../common/ModalOverlay';
import Image from 'next/image';
import BurnConfirmModal from './BurnConfirmModal';

type CardData = {
  name: string;
  image: string;
  description: string;
  hashrate: number;
  traits: Array<{ trait_type: string; value: string }>;
};

interface BurnCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardData;
  rarity: 'HOLO' | 'GOLD';
  onBurn: (tokenId?: number) => void;
  isBurning: boolean;
  ownedTokenIds: number[];
}

export default function BurnCardModal({
  isOpen,
  onClose,
  card,
  rarity,
  onBurn,
  isBurning,
  ownedTokenIds,
}: BurnCardModalProps) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const shardsToGet = rarity === 'HOLO' ? 100 : 800; // HOLO gives 100, GOLD gives 800 shards
  const displayName = card.name.split(' (')[0].toUpperCase();

  const handleBurnClick = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmBurn = () => {
    // Use the first available tokenId (could be enhanced to let user choose)
    const tokenIdToBurn = ownedTokenIds[0];
    onBurn(tokenIdToBurn);
    setConfirmModalOpen(false);
    onClose();
  };

  const handleCloseConfirm = () => {
    setConfirmModalOpen(false);
  };

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose} className="w-full md:max-w-[460px]">
        <div className="border border-white rounded-lg p-6 relative bg-black">
          <button
            className="absolute top-4 right-4 z-10 border border-white rounded-full p-1.5"
            onClick={onClose}
          >
            <Image src="/assets/icons/ic-close.svg" alt="Close" width={12} height={12} />
          </button>

          <div className="text-center">
            <h2 className="text-[#00D4FF] text-3xl md:text-[40px] font-bold font-chakra uppercase mb-6">
              BURN YOUR CARD
              <br />
              FOR SHARDS
            </h2>

            {/* Card Display */}
            <div className="mb-2">
              <div className="relative inline-block">
                <Image
                  src={card.image}
                  alt={card.name}
                  width={160}
                  height={224}
                  className="md:w-[160px] md:h-[224px] w-[98px] h-[137px]"
                />
              </div>
            </div>

            {/* Shards Display */}
            {/* <div className="mb-6">
              <p className="text-white text-[10px] md:text-sm font-chakra uppercase mb-2">YOU'LL GET</p>
              <p className="text-[#FFA200] text-base md:text-2xl font-bold font-chakra mb-1">
                {shardsToGet} SHARDS
              </p>
            </div> */}

            {/* Burn Button */}
            <button
              className="px-6 py-2 md:px-8 md:py-3 rounded-lg bg-transparent hover:bg-white/10 transition-colors border border-white w-1/3"
              onClick={handleBurnClick}
              disabled={isBurning || ownedTokenIds.length === 0}
            >
              <span className="text-white font-bold uppercase text-xs md:text-sm font-chakra">
                {isBurning ? 'BURNING...' : ownedTokenIds.length === 0 ? 'NO TOKENS' : 'BURN'}
              </span>
            </button>
          </div>
        </div>
      </ModalOverlay>

      {/* Confirmation Modal */}
      <BurnConfirmModal
        isOpen={confirmModalOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmBurn}
        shardsToGet={shardsToGet}
        rarity={rarity}
      />
    </>
  );
}

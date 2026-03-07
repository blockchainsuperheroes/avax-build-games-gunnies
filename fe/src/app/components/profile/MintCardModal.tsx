'use client';

import React, { useState } from 'react';
import ModalOverlay from '../common/ModalOverlay';
import Image from 'next/image';
import { GCN_CARDS_DATA, GCN_TYPES } from '@/app/constants/gcn';
import MintConfirmModal from './MintConfirmModal';

type CardData = {
  name: string;
  image: string;
  description: string;
  hashrate: number;
  traits: Array<{ trait_type: string; value: string }>;
};

interface MintCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardId: number;
  currentRarity: keyof typeof GCN_TYPES;
  currentBalance: number;
  onMint: (rarity: keyof typeof GCN_TYPES) => void | Promise<void>;
  isMinting: boolean;
}

export default function MintCardModal({
  isOpen,
  onClose,
  cardId,
  currentRarity,
  currentBalance,
  onMint,
  isMinting,
}: MintCardModalProps) {
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<'HOLO' | 'GOLD' | null>(null);

  const getCardData = (rarity: keyof typeof GCN_TYPES): CardData | null => {
    const rarityValue = GCN_TYPES[rarity];
    const card =
      GCN_CARDS_DATA[rarityValue]?.[cardId as keyof (typeof GCN_CARDS_DATA)[typeof rarityValue]];
    return card || null;
  };

  const currentCard = getCardData(currentRarity);
  const holoCard = getCardData('HOLO');
  const goldCard = getCardData('GOLD');

  // For SHARD cards, show both HOLO and GOLD options
  const canMintHolo = currentBalance >= 100;
  const canMintGold = currentBalance >= 1000;

  const handleMintClick = (rarity: 'HOLO' | 'GOLD') => {
    setSelectedRarity(rarity);
    setConfirmModalOpen(true);
  };

  const handleConfirmMint = () => {
    if (selectedRarity) {
      onMint(selectedRarity);
      setConfirmModalOpen(false);
    }
  };

  const handleCloseConfirm = () => {
    setConfirmModalOpen(false);
    setSelectedRarity(null);
  };

  if (!currentCard) return null;

  return (
    <>
      <ModalOverlay isOpen={isOpen} onClose={onClose} className="w-full md:max-w-[720px]">
        <div className="border border-white rounded-lg p-6 md:p-8 relative">
          <button
            className="absolute top-4 right-4 z-10 border border-white rounded-full p-1.5"
            onClick={onClose}
          >
            <Image src="/assets/icons/ic-close.svg" alt="Close" width={12} height={12} />
          </button>
          {/* Header */}
          <div className="text-center mb-5">
            <p className="text-[#1CBBBC] text-xs md:text-base font-chakra font-bold uppercase mb-2">
              CONGRATS, YOU HAVE ENOUGH TO MINT.
            </p>

            <p className="text-[#1CBBBC] text-[28px] md:text-[40px] font-chakra font-bold uppercase">
              TURN YOUR SHARDS TO CARDS
            </p>
          </div>

          {/* Cards Grid - Show SHARD, HOLO, and GOLD */}
          <div className="flex flex-row justify-center gap-3 md:gap-12">
            {/* HOLO Card */}
            {holoCard && (
              <div className="flex flex-col items-center">
                <div className="rounded-lg">
                  <Image
                    src={holoCard.image}
                    alt={holoCard.name}
                    width={160}
                    height={223}
                    className="rounded"
                  />
                </div>
                <div className="mt-3 text-center w-full">
                  <p className="text-[#FFA200] text-2xl font-bold font-chakra">100</p>
                  <p className="text-white text-xs font-chakra uppercase font-bold mb-3">
                    {' '}
                    SHARDS NEEDED
                  </p>
                  <button
                    className="px-6 py-1.5 w-2/3 rounded-lg bg-[#00000033] hover:bg-[#00000033]/80 transition-colors border border-white disabled:bg-[#00000033]/80 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!canMintHolo || isMinting}
                    onClick={() => handleMintClick('HOLO')}
                  >
                    <span className="text-white font-bold uppercase text-xs">
                      {isMinting ? 'MINTING...' : 'MINT'}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* GOLD Card */}
            {goldCard && (
              <div className="flex flex-col items-center">
                <div className="rounded-lg">
                  <Image
                    src={goldCard.image}
                    alt={goldCard.name}
                    width={160}
                    height={223}
                    className="rounded"
                  />
                </div>
                <div className="mt-3 text-center w-full">
                  <p className="text-[#FFA200] text-2xl font-bold font-chakra">1000</p>
                  <p className="text-white text-xs font-chakra uppercase font-bold mb-3">
                    {' '}
                    SHARDS NEEDED
                  </p>
                  <button
                    className="px-6 py-1.5 w-2/3 rounded-lg bg-[#00000033] hover:bg-[#00000033]/80 transition-colors border border-white disabled:bg-[#00000033]/80 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!canMintGold || isMinting}
                    onClick={() => handleMintClick('GOLD')}
                  >
                    <span className="text-white font-bold uppercase text-xs">
                      {isMinting ? 'MINTING...' : 'MINT'}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalOverlay>

      {/* Confirmation Modal */}
      {selectedRarity && (
        <MintConfirmModal
          isOpen={confirmModalOpen}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirmMint}
          shardsNeeded={selectedRarity === 'HOLO' ? 100 : 1000}
          rarity={selectedRarity}
        />
      )}
    </>
  );
}

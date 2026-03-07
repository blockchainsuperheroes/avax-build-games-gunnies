'use client';

import React from 'react';
import ModalOverlay from '../common/ModalOverlay';
import Image from 'next/image';

interface MintConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  shardsNeeded: number;
  rarity: 'HOLO' | 'GOLD';
}

export default function MintConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  shardsNeeded,
  rarity,
}: MintConfirmModalProps) {
  const rarityName = rarity === 'HOLO' ? 'holo' : 'gold';

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} className="w-full md:max-w-[600px]">
      <div className="border border-white rounded-lg p-8 md:p-10 relative bg-black">
        <button
          className="absolute top-4 right-4 z-10 border border-white rounded-full p-1.5"
          onClick={onClose}
        >
          <Image src="/assets/icons/ic-close.svg" alt="Close" width={12} height={12} />
        </button>

        <div className="text-center">
          <h2 className="text-white text-3xl md:text-[32px] font-bold font-chakra uppercase mb-2">
            GOOD JOB
          </h2>
          <p className="text-white text-base md:text-xl font-sora mb-6">
            Are you sure to use {shardsNeeded} shards for a {rarityName} card upgrade?
          </p>
          <button
            className="px-8 py-3 rounded-lg bg-transparent hover:bg-white/10 transition-colors border border-[#7C7C7C] w-2/3"
            onClick={onConfirm}
          >
            <span className="text-white font-bold uppercase text-sm font-chakra">YES</span>
          </button>
        </div>
      </div>
    </ModalOverlay>
  );
}

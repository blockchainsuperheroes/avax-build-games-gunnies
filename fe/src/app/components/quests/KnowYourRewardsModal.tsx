import React from 'react';
import ModalOverlay from '../common/ModalOverlay';
import Image from 'next/image';
import { KnowYourRewardsContent } from './KnowYourRewardsContent';

function KnowYourRewardsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} className="w-full md:max-w-[1319px]">
      <div className="bg-black/95 border border-white/20 rounded-lg p-6 md:p-8">
        <button type="button" className="absolute top-4 right-4 z-10" onClick={onClose}>
          <Image src="/assets/icons/x-circle.svg" alt="Close" width={36} height={36} />
        </button>
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-[#1CBBBC] text-sm md:text-2xl font-chakra font-semibold uppercase mb-4">
            Earn & Redeem Your Way to Victory.
          </p>
          <h2 className="text-[#1CBBBC] text-3xl md:text-[58px] font-chakra font-bold uppercase">
            Know Your Rewards
          </h2>
        </div>

        {/* Rewards Grid */}
        <KnowYourRewardsContent />
      </div>
    </ModalOverlay>
  );
}

export default KnowYourRewardsModal;

'use client';

import React from 'react';
import ModalOverlay from '../common/ModalOverlay';
import Image from 'next/image';
import { KaboomPassContentWithLogic } from './KaboomPassContent';

function KaboomPassModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} className="w-full md:max-w-[1084px]">
      <div className="bg-black/95 border border-white/20 rounded-lg p-6 md:p-12 relative">
        {/* Close Button */}
        <button type="button" className="absolute top-4 right-4 z-10" onClick={onClose}>
          <Image src="/assets/icons/x-circle.svg" alt="Close" width={36} height={36} />
        </button>

        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-[#1CBBBC] text-sm md:text-2xl font-chakra font-semibold uppercase">
            Unlock Mayhem. Dominate the Boom.
          </p>
          <h2 className="text-[#1CBBBC] text-3xl md:text-[58px] font-chakra font-bold uppercase leading-tight">
            More Fun with Kaboom Pass
          </h2>
        </div>

        {/* Main Content with all logic included */}
        <KaboomPassContentWithLogic />

        <p className="text-[#FFFFFFE5] font-sora text-xs md:text-sm text-center mt-2 md:mt-6">*Kaboom pass is good for one year and rewards are subject to change.</p>
      </div>
    </ModalOverlay>
  );
}

export default KaboomPassModal;

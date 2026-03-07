'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';

interface HalloweenRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
  heroImage?: string;
}

export const HalloweenRuleModal: React.FC<HalloweenRuleModalProps> = ({
  isOpen,
  onClose,
  onLoginClick,
}) => {
  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGotItClick = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100006] backdrop-blur-[16px] flex items-center justify-center p-6"
      onClick={onClose}
    >
      {/* Panel with hero image background */}
      <div
        className="relative w-full max-w-[600px] aspect-[4/5] max-h-[587px] overflow-hidden flex flex-col items-center justify-center p-[22px] pb-10 gap-3"
        style={{
          background: `url('/images/shop/banner-rule.png') center/cover no-repeat`,
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Soft inner darkening for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/55 to-black/70 p-[22px] pb-10 w-[65%] h-[70%] m-auto -z-10" />

        {/* Main message */}
        <p className="text-center max-w-[60%] text-white text-xl md:text-4xl leading-[100%] text-shadow-[0_1px_0_rgba(0,0,0,0.6)] mx-4 font-chakra font-extrabold">
          Win pumpkins to redeem prizes!
        </p>

        {/* Rules list */}
        <ul className="mt-2 mb-3 text-white font-semibold text-shadow-[0_1px_0_rgba(0,0,0,0.6)] text-sm md:text-xl leading-[100%] font-chakra space-y-1 list-disc list-inside flex flex-col items-start justify-start max-w-[70%] md:px-4">
          <li>Replay again every 24 hours</li>
          <li>$PEN VIPs can play every 8 hours!</li>
          <li>Claim Halloween stickers in the shop!</li>
          <li>Special Halloween goodies on sale!</li>
        </ul>

        {/* GOT IT Button */}
        <button
          onClick={handleGotItClick}
          className="w-full max-w-[250px] px-2 py-1 md:px-4 md:py-1.5 rounded-lg border-none cursor-pointer bg-[#4F41AB] text-white font-normal tracking-[0.04em] shadow-[0_4px_4px_rgba(0,0,0,0.5)] font-batgrexo text-base md:text-[28px] hover:bg-[#3d3299] transition-colors"
        >
          GOT IT
        </button>
      </div>
    </div>
  );
};

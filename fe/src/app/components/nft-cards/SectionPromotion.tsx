'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@/app/constants/routes';
import ModalOverlay from '../common/ModalOverlay';

export default function SectionPromotion() {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <section className="relative py-8 md:py-16 lg:py-24 px-4 md:px-8">
      <div className="max-w-[800px] mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-[28px] md:text-[58px] leading-[32px] md:leading-[64px] font-bold font-chakra uppercase text-[#1CBBBB] mb-4 mx-auto">
            What You Need to Know...
          </h1>
        </div>

        {/* Central Promotional Graphic */}
        <div className="relative mb-8 md:mb-16 rounded-lg overflow-hidden mt-6 group cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
          <Image
            src="/images/lineup-and-more/promotion-banner.png"
            alt="Gunnies NFT Cards Promotion"
            width={1920}
            height={1080}
            className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
            priority
          />
          {/* Zoom Icon */}
          <div className="absolute bottom-4 right-4 bg-black/70 hover:bg-[#1CBBBB] rounded-full p-2.5 transition-colors z-10">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
              />
            </svg>
          </div>
        </div>

        {/* Image Modal */}
        <ModalOverlay
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          className="w-full md:max-w-[1200px]"
          isShowCloseButton
        >
          <Image
            src="/images/lineup-and-more/promotion-banner.png"
            alt="Gunnies NFT Cards Promotion"
            width={1920}
            height={1080}
            className="w-full h-auto rounded-lg"
            priority
          />
        </ModalOverlay>

        {/* Information Panels Grid */}
        <div className="border border-[#FF8F00] rounded-lg p-9 mb-8 md:mb-12">
          <div className="grid grid-cols-1 gap-8">
            {/* Panel 1: Rarities */}
            <div>
              <p className="text-[#FF8F00] text-[28px] font-medium font-chakra uppercase">
                💎 Rarities
              </p>
              <ul className="space-y-0.5 text-[#FFFFFFCC] text-base font-sora">
                <li className="flex items-center gap-2 mt-2">
                  <div className="w-1 h-1 bg-[#FFFFFFCC]" />
                  <span>Shard (ERC-1155, Non-transferable): Entry tier</span>
                </li>
                <li className="flex items-center gap-2 mt-2">
                  <div className="w-1 h-1 bg-[#FFFFFFCC]" />
                  <span>Holo (ERC-721, Transferable): Upgraded collectible</span>
                </li>
                <li className="flex items-center gap-2 mt-2">
                  <div className="w-1 h-1 bg-[#FFFFFFCC]" />
                  <span>
                    Gold (ERC-721, Transferable): Ultra-rare — max 500 total across all characters
                  </span>
                </li>
              </ul>
            </div>

            {/* Panel 2: How to upgrade */}
            <div>
              <p className="text-[#FF8F00] text-[28px] font-medium font-chakra uppercase">
                🛠️ How to upgrade
              </p>
              <ul className="space-y-0.5 text-[#FFFFFFCC] text-base font-sora">
                <li className="flex items-center gap-2 mt-2">
                  <div className="w-1 h-1 bg-[#FFFFFFCC]" />
                  <span>Holo: Collect 100 shards</span>
                </li>
                <li className="flex items-center gap-2 mt-2">
                  <div className="w-1 h-1 bg-[#FFFFFFCC]" />
                  <span>Gold: Collect 1,000 shards</span>
                </li>
              </ul>
            </div>

            {/* Panel 3: How to get the cards */}
            <div>
              <p className="text-[#FF8F00] text-[28px] font-medium font-chakra uppercase">
                💥 How to get the cards
              </p>
              <ul className="space-y-0.5 text-[#FFFFFFCC] text-base font-sora">
                <li className="flex items-center gap-2 mt-2">
                  <div className="w-1 h-1 bg-[#FFFFFFCC]" />
                  <span>In-game: Earn 1 shard per day via daily mission</span>
                </li>
                <li className="flex items-center gap-2 mt-2">
                  <div className="w-1 h-1 bg-[#FFFFFFCC]" />
                  <span>Campaigns: Watch our socials for drops</span>
                </li>
                <li className="flex items-center gap-2 mt-2">
                  <div className="w-1 h-1 bg-[#FFFFFFCC]" />
                  <span>PenXR Spatial: Coming soon</span>
                </li>
              </ul>
            </div>

            {/* Panel 4: Benefits */}
            <div>
              <p className="text-[#FF8F00] text-[28px] font-medium font-chakra uppercase">
                🔥 Benefits
              </p>
              <p className="text-[#FFFFFFCC] text-base font-sora">
                Owning a Gunnies Character NFT unlocks exclusive in-game access, abilities, and rare
                cosmetics.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="flex justify-center">
          <Link
            href={ROUTES.DOWNLOAD}
            className="bg-[#1CBBBC] hover:bg-[#1CBBBC]/80 transition-colors px-12 md:px-16 py-4 md:py-6 rounded-lg w-full max-w-[400px]"
          >
            <p className="text-white text-lg md:text-2xl font-bold font-chakra uppercase text-center">
              PLAY NOW
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

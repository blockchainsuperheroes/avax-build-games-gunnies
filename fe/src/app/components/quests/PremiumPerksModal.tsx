'use client';

import React from 'react';
import ModalOverlay from '../common/ModalOverlay';
import Image from 'next/image';
import { ROUTES } from '@/app/constants/routes';
import { useCartStore } from '@/app/stores/cartStore';
import { useRouter } from 'next/navigation';
import { useShopItems } from '@/hooks/useShopItems';

interface PremiumPerksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumPerksModal({ isOpen, onClose }: PremiumPerksModalProps) {
  const { addToCart } = useCartStore();
  const router = useRouter();
  const { items: shopItems, loading, error } = useShopItems();

  // Find the Gunnies Gang Subscription item from the API
  const subscriptionItem = shopItems.find(
    item =>
      item.name.toLowerCase().includes('gunnies gang') ||
      item.name.toLowerCase().includes('subscription') ||
      item.description?.toLowerCase().includes('subscription') ||
      item.description?.toLowerCase().includes('membership')
  );

  const handlePurchaseClick = () => {
    if (!subscriptionItem) {
      console.error('Subscription item not found');
      return;
    }

    // Add the subscription item to cart
    addToCart(subscriptionItem);

    // Close the modal
    onClose();

    // Navigate to cart page
    router.push(ROUTES.CART);
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} className="w-full md:max-w-[600px]">
      <div className="bg-[url('/images/quests/banner-premium-perks.png')] bg-cover bg-center border border-white rounded-lg p-6 md:p-8 relative">
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-4 right-4 z-10 border border-white rounded-full p-1.5 bg-black"
          onClick={onClose}
        >
          <Image src="/assets/icons/ic-close.svg" alt="Close" width={12} height={12} />
        </button>

        {/* Header */}
        <div className="text-center mb-1 md:mb-6">
          <h2 className="text-[#1CBBBC] text-2xl md:text-[32px] font-chakra font-bold uppercase mb-4 leading-tight">
            UNLOCK PREMIUM PERKS
            <br />
            AND LEVEL UP FASTER.
          </h2>

          {/* Gunnies Gang Logo */}
          <div className="flex justify-center mb-1 md:mb-6">
            <Image
              src="/images/profile/gunnies-gang.png"
              alt="Gunnies Gang"
              width={200}
              height={160}
              className="w-[148px] md:w-[200px] h-auto"
            />
          </div>
        </div>

        {/* Perks Section */}
        <div className="mb-4 md:mb-8 flex flex-col gap-8 md:gap-16 items-center justify-center">
          {/* Perk 1: Skill Card Slot */}
          <div className="relative pr-[88px] md:pr-[120px]">
            <Image
              src="/images/quests/skill-card-slot.png"
              alt="Skill Card Slot"
              width={120}
              height={120}
              className="w-[88px] h-[88px] md:w-[120px] md:h-[120px] absolute top-1/2 left-0 -translate-y-1/2 z-10"
            />
            <div className="flex items-center justify-center bg-[#1CBBBB] border-2 border-white rounded-lg p-2 md:p-4 relative left-[84px] md:left-[120px] h-[69px] md:h-[78px] w-[216px] md:w-[281px]">
              <p className="text-white text-xs md:text-sm font-sora font-semibold uppercase leading-[1]">
                Gain access to a third Skill Card slot, giving you a gameplay edge in any mode.
              </p>
            </div>
          </div>

          {/* Perk 2: Bonus Coins and Stars */}
          <div className="relative pr-[88px] md:pr-[120px]">
            <Image
              src="/images/quests/bonus-coins-and-stars.png"
              alt="Bonus Coins and Stars"
              width={120}
              height={120}
              className="w-[88px] h-[88px] md:w-[120px] md:h-[120px] absolute top-1/2 left-0 -translate-y-1/2 z-10"
            />

            <div className="flex items-center justify-center bg-[#1CBBBB] border-2 border-white rounded-lg p-2 md:p-4 relative left-[84px] md:left-[120px] h-[69px] md:h-[78px] w-[216px] md:w-[281px]">
              <p className="text-white text-xs md:text-sm font-sora font-semibold uppercase leading-[1]">
                Earn bonus Coins and Stars to progress faster both in-game and on the web platform.
              </p>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <div className="flex justify-center mt-6 md:mt-12">
          {loading ? (
            <div className="bg-[#FF8F00]/50 text-white text-sm md:text-lg font-chakra font-bold uppercase py-3 px-8 rounded-lg w-full text-center flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              LOADING...
            </div>
          ) : error ? (
            <div className="bg-red-600 text-white text-sm md:text-lg font-chakra font-bold uppercase py-3 px-8 rounded-lg w-full text-center">
              ERROR LOADING ITEM
            </div>
          ) : !subscriptionItem ? (
            <div className="bg-gray-600 text-white text-sm md:text-lg font-chakra font-bold uppercase py-3 px-8 rounded-lg w-full text-center">
              ITEM NOT AVAILABLE
            </div>
          ) : (
            <button
              onClick={handlePurchaseClick}
              className="bg-[#FF8F00] hover:bg-[#FF8F00]/80 text-white text-sm md:text-lg font-chakra font-bold uppercase py-3 px-8 rounded-lg transition-colors w-full text-center"
            >
              PURCHASE ${subscriptionItem.price}
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore, CartItem } from '@/app/stores/cartStore';

interface ShopItemProps {
  item: Omit<CartItem, 'quantity'>;
  checkValidAddToCard: any;
}

export const ShopItem: React.FC<ShopItemProps> = ({ item, checkValidAddToCard }) => {
  const { addToCart, openCartModal } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);
  const isTShirt = item.name.toLowerCase().includes('t-shirt');

  const handleAddToCart = () => {
    addToCart(item);
    openCartModal({ ...item, quantity: 1 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className={`border-[2px] transition-colors group ${
          isHovered ? 'border-[#f4ba0e]' : 'border-transparent'
        }`}
      >
        {/* Item Image */}
        <div className="relative h-[134px] md:h-[248px] bg-[#2B2B2B] overflow-hidden px-2 md:px-4 pb-8 md:pb-12 pt-1 md:pt-4">
          <div className="relative h-full w-full">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain transition-transform duration-300 ${
                isHovered ? 'scale-105' : ''
              }`}
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            {isTShirt && (
              <div className="flex items-center justify-center gap-1">
                <p className="text-[14px] md:text-xl font-chakra uppercase text-[#00A4FF]">NFC</p>

                <Image src="/assets/icons/wifi.svg" alt="NFC" width={20} height={31} />
              </div>
            )}
            <p className="text-white text-[17px] md:text-[32px] text-center font-chakra uppercase">
              {isTShirt ? 'T-shirt' : item.name}
            </p>
          </div>
        </div>

        <p className="text-black text-[17px] md:text-[24px] text-center font-chakra uppercase font-bold bg-[#DBDBDB] p-2 md:p-4">
          USD {item.price.toFixed(2)}${' '}
          {isTShirt && <span className="line-through text-red-500 mr-2">$50.00</span>}
        </p>
      </div>
      <button
        onClick={handleAddToCart}
        className={`font-bold px-4 py-2 rounded-lg transition-colors active:scale-95 flex items-center justify-center mx-auto mt-4 md:mt-9 ${
          isHovered
            ? 'border-transparent bg-[#1CBBBC]'
            : 'border hover:border-transparent bg-transparent hover:bg-[#1CBBBC]'
        }`}
      >
        <p className="text-white text-xs md:text-xl font-bold font-chakra uppercase">ADD TO CART</p>
      </button>
    </div>
  );
};

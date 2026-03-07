'use client';

import React from 'react';
import { useCartStore } from '@/app/stores/cartStore';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/constants/routes';
import Image from 'next/image';
import ModalCommon from '../common/ModalCommon';

export const CartModal = () => {
  const router = useRouter();
  const { isCartModalOpen, selectedItem, closeCartModal } = useCartStore();

  const handleCheckout = () => {
    closeCartModal();
    router.push(ROUTES.CART);
  };

  const handleBackToShop = () => {
    closeCartModal();
  };

  if (!selectedItem) return null;

  const { image, name, price } = selectedItem;

  return (
    <ModalCommon
      isOpen={isCartModalOpen}
      onClose={closeCartModal}
      className="w-full md:max-w-[828px] md:border md:border-[#1CBBBC] md:rounded-lg relative bg-transparent md:bg-black h-screen md:h-auto flex items-center justify-center"
    >
      <button onClick={closeCartModal} className="absolute top-4 right-4 block md:hidden">
        <Image src="/assets/icons/x-circle.svg" alt="Close" width={30} height={30} />
      </button>
      <div className="p-6 md:px-[60px] md:py-[57px] flex flex-col">
        <button onClick={closeCartModal} className="absolute top-2 right-2 hidden md:block">
          <Image src="/assets/icons/x-circle.svg" alt="Close" width={26} height={26} />
        </button>
        <div className="flex flex-col md:flex-row items-start justify-start gap-4 md:gap-[42px]">
          {/* Item Display */}
          <div className="w-full md:w-[312px] shrink-0 border border-white">
            <div className="relative h-[223px] md:h-[248px] bg-[#2B2B2B] overflow-hidden px-4 pb-12 pt-4">
              <div className="relative h-full w-full">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-white text-[28px] md:text-[32px] text-center font-chakra uppercase">
                {name}
              </p>
            </div>
            <p className="text-black text-[28px] md:text-[32px] text-center font-chakra uppercase font-bold bg-[#DBDBDB] p-2 md:p-3">
              USD {price.toFixed(2)}$
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col justify-between items-start self-stretch">
            <p className="text-[#FF8F00] text-2xl md:text-[32px] font-chakra uppercase font-bold md:leading-10">
              THANK YOU, THIS ITEM HAS BEEN ADDED TO YOUR CART!
            </p>

            <div className="flex flex-col justify-between items-start w-full mt-4 md:mt-0">
              <div className="text-xl text-white mb-5 md:mb-0">
                <p>Subtotal</p>
                <p className="font-semibold">USD {price.toFixed(2)}$</p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#1CBBBC] py-4 md:py-5 px-4 rounded-lg mt-4 md:mt-5"
              >
                <p className="uppercase text-xl text-white font-bold [text-shadow:2px_0px_#0F6E6F,-2px_0px_#0F6E6F,0px_2px_#0F6E6F,0px_-2px_#0F6E6F,1px_1px_#0F6E6F,-1px_-1px_#0F6E6F] font-chakra">
                  VIEW CART & CHECKOUT
                </p>
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleBackToShop}
          className="md:ml-auto w-full md:w-1/2 mt-5 md:mt-2"
        >
          <p className="text-base md:text-sm font-semibold underline font-chakra">Continue Shopping &gt;</p>
        </button>
      </div>
    </ModalCommon>
  );
};

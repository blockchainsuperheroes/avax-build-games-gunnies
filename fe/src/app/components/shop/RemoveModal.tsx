'use client';

import React from 'react';
import { CartItem } from '@/app/stores/cartStore';
import Image from 'next/image';
import ModalCommon from '../common/ModalCommon';

interface RemoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CartItem | null;
  onConfirmRemove: () => void;
}

export const RemoveModal: React.FC<RemoveModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmRemove,
}) => {
  if (!item) return null;

  const { image, name, price, quantity } = item;

  const handleConfirmRemove = () => {
    onConfirmRemove();
    onClose();
  };

  return (
    <ModalCommon
      isOpen={isOpen}
      onClose={onClose}
      className="w-full md:max-w-[828px] md:border md:border-[#1CBBBC] md:rounded-lg relative bg-transparent md:bg-black h-screen md:h-auto flex items-center justify-center"
    >
          <button onClick={onClose} className="absolute top-4 right-4 block md:hidden">
          <Image src="/assets/icons/x-circle.svg" alt="Close" width={30} height={30} />
        </button>
      <div className="p-6 md:px-[60px] md:py-[57px] flex flex-col">
        <button onClick={onClose} className="absolute top-2 right-2 hidden md:block">
          <Image src="/assets/icons/x-circle.svg" alt="Close" width={26} height={26} />
        </button>
        <div className="flex flex-col md:flex-row items-start justify-start gap-4 md:gap-[42px]">
          {/* Item Display */}
          <div className="w-full md:w-[312px] shrink-0 border border-white">
            <div className="relative h-[223px] md:h-[248px] bg-[#2B2B2B] overflow-hidden px-4 pb-12 pt-4">
              <div className="relative h-full w-full">
                <Image src={image} alt={name} fill className="object-contain" />
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
            <p className="text-white text-2xl md:text-[32px] font-chakra uppercase font-bold md:leading-10">
              ARE YOU SURE YOU WANT TO REMOVE THIS ITEM FROM YOUR CART?
            </p>

            <button
              onClick={handleConfirmRemove}
              className="bg-[#DB0023] py-5 px-4 rounded-lg hover:bg-[#e02d00] transition-colors w-full mt-4 md:mt-5"
            >
              <p className="uppercase text-xl text-white font-semibold font-chakra">
                YES, REMOVE THIS ITEM
              </p>
            </button>
          </div>
        </div>
        <button onClick={onClose} className="md:ml-auto w-full md:w-1/2 mt-5 md:mt-2">
          <p className="text-base md:text-sm font-semibold underline font-chakra">No, keep this item</p>
        </button>
      </div>
    </ModalCommon>
  );
};

'use client';

import React from 'react';
import Link from 'next/link';
import { ROUTES } from '../constants/routes';

export default function CancelPage() {
  return (
    <div className="md:min-h-[calc(100dvh_-_400px)] w-full md:max-w-[1324px] mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4 border-b border-white pb-2 md:pb-4">
          <Link
            href={ROUTES.PURCHASE_HISTORY}
            className="bg-transparent text-white font-semibold text-sm md:text-base"
          >
            &lt; back to history
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 text-center mt-5 md:mt-[56px]">
          <h2 className="text-white text-sm md:text-xl font-semibold font-chakra">
            OOPS, SOMETHING WENT WRONG...
          </h2>
          <div className="w-12 h-12 md:w-16 md:h-16 bg-[#DE554B] rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-white text-4xl md:text-[72px] font-batgrexo uppercase text-center mt-3 md:mt-[17px]">
            PAYMENT CANCELLED
          </h1>
          <div className="flex flex-col items-center justify-center w-full">
            <p className="text-xl text-white font-semibold text-center mt-[17px]">
              No worries, your cart is still saved!
            </p>
            <p className="text-white text-sm font-chakra font-semibold text-center w-full md:w-1/2 px-2 md:px-0 mt-1">
              Your payment was cancelled and no charges were made to your account. All your cart
              items are still saved and ready for checkout whenever you’re ready to continue.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-[28px] mt-12">
          <Link
            href={ROUTES.CART}
            className="bg-[#1CBBBC] rounded-[6px] px-4 py-3 text-white text-[15px] font-bold font-chakra uppercase text-center flex items-center justify-center gap-4 border border-transparent [text-shadow:2px_0px_#0F6E6F,-2px_0px_#0F6E6F,0px_2px_#0F6E6F,0px_-2px_#0F6E6F,1px_1px_#0F6E6F,-1px_-1px_#0F6E6F] w-[224px] h-12 order-1 md:order-2"
          >
            Return to cart
          </Link>
        </div>
      </div>
    </div>
  );
}

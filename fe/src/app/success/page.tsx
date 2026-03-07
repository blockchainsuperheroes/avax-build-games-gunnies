'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '../stores/cartStore';
import { ROUTES } from '../constants/routes';
import Image from 'next/image';
import { toast } from 'react-toastify';

import CopyIcon from '@/../public/assets/icons/ic-copy.svg';
import RewardIcon from '@/../public/assets/icons/ic-reward.svg';
import LoadingScreen from '../components/common/LoadingScreen';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const { clearCart } = useCartStore();
  const [isProcessed, setIsProcessed] = useState(false);

  const handleCopySessionId = async () => {
    if (sessionId) {
      try {
        await navigator.clipboard.writeText(sessionId);
        toast.success('Copy successfully!');
      } catch (err) {
        toast.error('Failed to copy transaction reference');
      }
    }
  };

  useEffect(() => {
    if (sessionId && !isProcessed) {
      clearCart();
      setIsProcessed(true);
    }
  }, [sessionId, clearCart, isProcessed]);

  return (
    <div className="md:min-h-[calc(100dvh_-_400px)] w-full md:max-w-[1324px] mx-auto">
      {/* Header */}
      <div className="mb-[28px] md:mb-12">
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
            Thank you for your purchase!
          </h2>
          <div className="w-12 h-12 md:w-15 md:h-15 bg-[#5CBF68] rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-white text-4xl md:text-[72px] font-batgrexo uppercase text-center mt-3 md:mt-[17px]">
            PAYMENT SUCCESSFUL
          </h1>
          <p className="text-white text-sm md:text-xl font-chakra font-semibold text-center mt-3 md:mt-[17px] w-full md:w-1/2 px-2 md:px-0">
            Your order has been processed successfully and your items will be available in your
            account shortly.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center">
        {/* Transaction Reference */}
        {sessionId && (
          <div
            className="bg-[#2D2222] p-3 md:px-4 md:py-3 md:max-w-2xl w-full cursor-pointer hover:bg-[#333333] transition-colors flex gap-4"
            onClick={handleCopySessionId}
            title="Click to copy transaction reference"
          >
            <div className="flex-1 overflow-hidden">
              <p className="text-[#FF8F00] text-xs md:text-sm font-chakra font-semibold">
                Transaction Reference
              </p>
              <p className="text-white text-xs md:text-sm font-chakra font-semibold truncate">{sessionId}</p>
            </div>

            <Image width={32} height={32} src={CopyIcon} alt="Copy Icon" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-[28px] mt-12">
          <Link
            href={ROUTES.PURCHASE_HISTORY}
            className="bg-transparent rounded-[6px] px-4 py-3 text-white text-[15px] font-bold font-chakra uppercase text-center flex items-center justify-between gap-4 border border-white h-12 order-2 md:order-1"
          >
            <Image width={24} height={24} src={RewardIcon} alt="Reward Icon" />
            Continue shopping
          </Link>
          <Link
            href={ROUTES.PURCHASE_HISTORY}
            className="bg-[#1CBBBC] rounded-[6px] px-4 py-3 text-white text-[15px] font-bold font-chakra uppercase text-center flex items-center justify-center gap-4 border border-transparent [text-shadow:2px_0px_#0F6E6F,-2px_0px_#0F6E6F,0px_2px_#0F6E6F,0px_-2px_#0F6E6F,1px_1px_#0F6E6F,-1px_-1px_#0F6E6F] w-[224px] h-12 order-1 md:order-2"
          >
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}


export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <SuccessPageContent />
    </Suspense>
  );
}

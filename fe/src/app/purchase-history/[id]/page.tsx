'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '../../constants/routes';
import { useParams } from 'next/navigation';
import { useShopItems } from '@/hooks/useShopItems';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { getProductInfo } from '@/utils/shop';
import { OrderStatus } from '@/app/types/shop';

interface PurchaseDetailItem {
  id: number;
  stripe_product_id: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  currency: string;
  lootlocker_assets_granted: boolean;
  created_at: string;
  updated_at: string;
}

interface PurchaseDetailResponse {
  success: boolean;
  result: {
    id: number;
    order_id: string;
    status: OrderStatus;
    amount: string;
    currency: string;
    created_at: string;
    updated_at: string;
    items: PurchaseDetailItem[];
  };
}

export default function PurchaseDetailPage() {
  const params = useParams();
  const { items: shopItems } = useShopItems();
  const { data: session }: any = useSession();

  const orderId = typeof params?.id === 'string' ? params.id : '';

  const fetchOrderDetail = async (): Promise<PurchaseDetailResponse['result']> => {
    if (!orderId) {
      throw new Error('Order ID is required');
    }

    if (!session?.user?.gunnies_access_token) {
      throw new Error('Authentication token is required');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GUNNIES_API}/shop/purchase_detail/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${session.user.gunnies_access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch order details');
    }

    const data: PurchaseDetailResponse = await response.json();

    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }

    return data.result;
  };

  const {
    data: orderData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['purchaseDetail', orderId, session?.user?.gunnies_access_token],
    queryFn: fetchOrderDetail,
    enabled: !!orderId && !!session?.user?.gunnies_access_token,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full md:max-w-[1324px] mx-auto px-6 md:px-0">
        <div className="mb-5 md:mb-8">
          <div className="flex items-center justify-between mb-4 border-b border-white pb-2 md:pb-4">
            <Link
              href={ROUTES.PURCHASE_HISTORY}
              className="bg-transparent text-white font-semibold text-sm md:text-base"
            >
              &lt; back to history
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center py-16">
          <Image
            className="jumpy"
            src="/images/quests/carrot.png"
            alt="loading"
            width={60}
            height={60}
          />
        </div>
      </div>
    );
  }

  if (error || !orderData) {
    return (
      <div className="min-h-screen w-full md:max-w-[1324px] mx-auto px-6 md:px-0">
        <div className="mb-5 md:mb-8">
          <div className="flex items-center justify-between mb-4 border-b border-white pb-2 md:pb-4">
            <Link
              href={ROUTES.PURCHASE_HISTORY}
              className="bg-transparent text-white font-semibold text-sm md:text-base"
            >
              &lt; back to history
            </Link>
          </div>
        </div>

        <div className="text-center py-16">
          <h2 className="text-white font-chakra font-semibold text-2xl mb-4">
            {error ? 'Error Loading Order' : 'Order not found'}
          </h2>
          <p className="text-gray-300 font-chakra mb-6">
            {error instanceof Error
              ? error.message
              : "The order you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            href={ROUTES.PURCHASE_HISTORY}
            className="bg-[#1CBBBC] text-white font-chakra font-semibold px-6 py-3 rounded-lg hover:bg-[#16a5a6] transition-colors"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full md:max-w-[1324px] mx-auto px-6 md:px-0">
      {/* Header */}
      <div className="mb-2 md:mb-12">
        <div className="flex items-center justify-between mb-4 border-b border-white pb-2 md:pb-4">
          <Link
            href={ROUTES.PURCHASE_HISTORY}
            className="bg-transparent text-white font-semibold text-sm md:text-base"
          >
            &lt; back to history
          </Link>
        </div>

        <h1 className="text-white text-4xl md:text-[72px] font-batgrexo uppercase text-center mt-4 md:mt-16">
          PURCHASE DETAILS
        </h1>
      </div>

      <div className="w-full md:max-w-[728px] mx-auto">
        {/* Order Header */}
        <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-5">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-chakra font-semibold text-sm md:text-xl">
              Order #{orderData.order_id}
            </h2>
          </div>
          <p className="text-white text-sm md:text-xl font-semibold font-chakra uppercase">
            Date:{' '}
            {new Date(orderData.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Status */}
        <div className="mb-8 md:mb-[44px] md:mt-2 text-center">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 border-[1px] ${
              orderData.status === 'Success'
                ? 'border-[#5CBF68] text-[#5CBF68]'
                : orderData.status === 'Processing'
                  ? 'border-[#FF8F00] text-[#FF8F00]'
                  : 'border-[#DE554B] text-[#DE554B]'
            }`}
          >
            {orderData.status === 'Success' && (
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {orderData.status === 'Processing' && (
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 15 18">
                <path d="M12.2246 0C13.5914 6.596e-05 14.7 1.10789 14.7002 2.47461V2.85156C14.7002 4.66917 13.746 6.35383 12.1875 7.28906L10.5576 8.26758C10.1354 8.52123 10.1181 9.12725 10.5254 9.4043L12.4346 10.7021C13.8513 11.6656 14.7001 13.2681 14.7002 14.9814V15.5244C14.7001 16.8912 13.5915 17.9999 12.2246 18H2.77441C1.40766 17.9998 0.299854 16.8912 0.299805 15.5244V14.9814C0.299882 13.2681 1.14765 11.6656 2.56445 10.7021L4.47363 9.4043C4.88108 9.12721 4.86385 8.52115 4.44141 8.26758L2.8125 7.28906C1.25377 6.35387 0.299837 4.6693 0.299805 2.85156V2.47461C0.299959 1.10794 1.40773 0.000160048 2.77441 0H12.2246ZM2.77441 1.34961C2.15331 1.34977 1.64957 1.85352 1.64941 2.47461V2.85156C1.64945 4.1951 2.35474 5.44059 3.50684 6.13184L5.13574 7.10938C6.40332 7.87007 6.4557 9.68903 5.2334 10.5205L3.32422 11.8184C2.277 12.5305 1.64949 13.7151 1.64941 14.9814V15.5244C1.64946 16.1456 2.15325 16.6493 2.77441 16.6494H12.2246C12.8459 16.6493 13.3496 16.1457 13.3496 15.5244V14.9814C13.3495 13.7151 12.723 12.5305 11.6758 11.8184L9.7666 10.5205C8.54394 9.68909 8.59544 7.87009 9.86328 7.10938L11.4932 6.13184C12.645 5.44054 13.3496 4.19495 13.3496 2.85156V2.47461C13.3495 1.85346 12.8458 1.34968 12.2246 1.34961H2.77441Z" />
              </svg>
            )}
            {orderData.status === 'Fail' && (
              <svg className="w-[14px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <p className="font-chakra font-semibold text-sm md:text-base uppercase">
              {orderData.status === 'Success'
                ? 'Payment Success'
                : orderData.status === 'Processing'
                  ? 'Payment Processing'
                  : 'Payment Canceled'}
            </p>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-5 md:space-y-8">
          {orderData.items.map(item => {
            const productInfo = getProductInfo(shopItems, item.stripe_product_id);

            return (
              <div key={item.id} className="bg-[#43434380] relative">
                <div className="flex">
                  <div className="w-[116px] md:w-[136px] bg-[#2B2B2B] border shrink-0">
                    <div className="relative h-[116px] md:h-[108px] bg-[#2B2B2B] overflow-hidden px-1 pb-6 md:pb-8 pt-2">
                      <div className="relative h-full w-full">
                        <Image
                          src={productInfo?.image || '/images/shop/default-item.svg'}
                          alt={productInfo?.name || 'Product'}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <p className="text-white text-[11px] md:text-[13px] text-center font-chakra uppercase mt-1 md:mt-2">
                        {productInfo?.name || 'Unknown Product'}
                      </p>
                    </div>

                    <p className="text-black text-[11px] md:text-[13px] text-center font-chakra uppercase font-bold bg-[#DBDBDB] p-1 md:p-2">
                      {item.currency} {parseFloat(item.unit_price).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-4 px-4 md:px-8 md:py-4">
                    <div>
                      <h3 className="text-white font-chakra uppercase font-semibold text-base md:text-2xl">
                        {productInfo?.name || 'Unknown Product'} Pack
                      </h3>
                      <p className="text-white font-semibold text-sm md:text-base font-chakra">
                        Item price: {parseFloat(item.unit_price).toFixed(2)} {item.currency}
                      </p>
                    </div>

                    <div className="flex items-end justify-between">
                      <p className="text-white font-semibold text-sm md:text-base font-chakra">
                        Quantity: {item.quantity}
                      </p>
                      <div>
                        <p className="font-semibold text-xs md:text-base font-chakra text-[#FF8F00] text-right">
                          Subtotal:
                        </p>
                        <p className="text-white font-semibold text-base md:text-2xl font-chakra">
                          {parseFloat(item.total_price).toFixed(2)} {item.currency}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Total Section */}
          <div className="text-center bg-[#2D2222] px-6 py-3 w-fit mx-auto flex items-center justify-center">
            <p className="text-white font-chakra font-semibold text-2xl uppercase">
              <span className="text-[#FF8F00]">Total:</span> {orderData.currency}{' '}
              {parseFloat(orderData.amount).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

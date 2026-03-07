'use client';

import React, { useEffect, useState, Fragment } from 'react';
import { useCartStore } from '../stores/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '../constants/routes';
import { useRouter } from 'next/navigation';
import { useShopItems } from '@/hooks/useShopItems';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '../components/common';
import { getProductInfo } from '@/utils/shop';
import { OrderStatus } from '../types/shop';

interface PurchaseHistoryItem {
  order_id: number;
  status: OrderStatus;
  amount: string;
  product_ids: string[];
  currency: string;
  created_at: string;
  updated_at: string;
  total_items: number;
}

interface PurchaseHistoryResponse {
  success: boolean;
  result: {
    items: PurchaseHistoryItem[];
    total_item: number;
    total_page: number;
  };
}

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const { items } = useShopItems();
  const { ref, inView } = useInView();
  const { data: session }: any = useSession();

  const fetchPurchaseHistory = async ({ pageParam = 1 }) => {
    if (!session?.user?.gunnies_access_token) {
      throw new Error('You need to be logged in to view purchase history');
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GUNNIES_API}/shop/purchase_history?page=${pageParam}`,
      {
        headers: {
          Authorization: `Bearer ${session?.user?.gunnies_access_token || ''}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch purchase history');
    }

    const data: PurchaseHistoryResponse = await response.json();

    if (!data.success) {
      throw new Error('API returned unsuccessful response');
    }

    return data;
  };

  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ['purchaseHistory', session?.user?.gunnies_access_token],
      queryFn: fetchPurchaseHistory,
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = allPages.length;
        const totalPages = lastPage?.result?.total_page;
        return currentPage < totalPages ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: !!session?.user?.gunnies_access_token,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const handleItemClick = (orderId: number) => {
    router.push(`/purchase-history/${orderId}`);
  };

  const formatOrderForDisplay = (item: PurchaseHistoryItem) => {
    return {
      id: item.order_id,
      date: item.created_at,
      items: item.product_ids.map(productId => {
        const product = getProductInfo(items, productId);
        return {
          name: product?.name || 'Unknown Product',
          image: product?.image || '/images/shop/default-item.svg',
        };
      }),
      total_items: item.total_items,
      status: item.status,
      currency: item.currency,
      amount: parseFloat(item.amount),
    };
  };

  // Get all items from all pages
  const allPurchaseItems = data?.pages.flatMap(page => page.result.items) || [];

  return (
    <div className="min-h-[calc(100dvh-360px)] w-full md:max-w-[1324px] mx-auto px-6 md:px-0">
      {/* Header */}
      <div className="mb-5 md:mb-8">
        <div className="flex items-center justify-between mb-4 border-b border-white pb-2 md:pb-4">
          <Link
            href={ROUTES.SHOP}
            className="bg-transparent text-white font-semibold text-sm md:text-base"
          >
            &lt; back to store
          </Link>
        </div>

        <h1 className="text-white text-4xl md:text-[72px] font-batgrexo uppercase text-center mt-8 md:mt-16">
          PURCHASE HISTORY
        </h1>
      </div>

      {error && <div className="text-red-500 text-center mb-4">Error: {error.message}</div>}

      {isLoading && (
        <div className="flex items-center justify-center">
          <Image
            className="mt-10 jumpy"
            src="/images/quests/carrot.png"
            alt="loading"
            width={60}
            height={60}
          />
        </div>
      )}

      {allPurchaseItems.length === 0 && !isLoading ? (
        /* Empty History */
        <div className="flex flex-col items-center justify-center gap-2 md:gap-8">
          <h2 className="text-base md:text-4xl text-white font-semibold font-chakra text-center">
            No purchase history yet!
          </h2>
          <p className="text-white font-chakra text-center mb-4">
            Start shopping to see your order history here.
          </p>

          <Link href={ROUTES.SHOP} className="text-center text-white font-semibold text-base">
            Start Shopping &gt;
          </Link>
        </div>
      ) : (
        <div className="space-y-5 md:space-y-12 mt-2 md:mt-16">
          {/* Purchase History List */}
          {data?.pages.map((page, pageIndex) => (
            <Fragment key={pageIndex}>
              {page.result.items.map(item => {
                const order = formatOrderForDisplay(item);

                return (
                  <div
                    className="w-full md:w-[728px] mx-auto cursor-pointer"
                    key={order.id}
                    onClick={() => handleItemClick(order.id)}
                  >
                    <p className="font-chakra font-semibold text-sm md:text-base uppercase mb-2">
                      Date:{' '}
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <div className="bg-[#43434380] relative">
                      <div className="flex">
                        <div className="w-[116px] md:w-[136px] bg-[#2B2B2B] border shrink-0">
                          <div className="relative h-[116px] md:h-[108px] bg-[#2B2B2B] overflow-hidden px-1 pb-6 md:pb-8 pt-2">
                            <div className="relative h-full w-full">
                              <Image
                                src={order.items[0]?.image || '/images/shop/60-coins.png'}
                                alt={order.items[0]?.name || `Order #${order.id}`}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <p className="text-white text-[11px] md:text-[13px] text-center font-chakra uppercase mt-1 md:mt-2">
                              {order.items[0]?.name || 'Order Pack'}
                            </p>
                          </div>

                          <p className="text-black text-[11px] md:text-[13px] text-center font-chakra uppercase font-bold bg-[#DBDBDB] p-1 md:p-2">
                            {order.currency} {order.amount.toFixed(2)}
                          </p>
                        </div>

                        <div className="flex-1 flex flex-col justify-start md:justify-between py-4 px-4 md:px-8 md:py-4">
                          <div className="flex items-center justify-start gap-4 mb-0 md:mb-2">
                            <h3 className="text-white font-chakra uppercase font-semibold text-base md:text-xl">
                              Order #{order.id}
                            </h3>
                            {order.status === 'Success' && (
                              <div className="w-6 h-6 bg-[#5CBF68] rounded-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-black"
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
                            )}
                            {order.status === 'Fail' && (
                              <div className="w-6 h-6 bg-[#DE554B] rounded-full flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-black"
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
                            )}
                            {order.status === 'Processing' && (
                              <Image
                                src="/assets/icons/ic-processing.svg"
                                alt="Processing Icon"
                                width={24}
                                height={24}
                              />
                            )}
                          </div>

                          <div className="w-full flex justify-between items-end">
                            <div>
                              <p className="text-white font-semibold text-xs md:text-base font-chakra">
                                Item(s): {order.total_items}
                              </p>
                              <p className="text-white font-semibold text-xs md:text-base font-chakra">
                                Total {order.amount.toFixed(2)} {order.currency}
                              </p>
                            </div>

                            <button
                              className="hidden md:block bg-[#1CBBBC] text-white font-semibold text-base font-chakra transition-colors px-8 py-2 rounded-lg [text-shadow:2px_0px_#0F6E6F,-2px_0px_#0F6E6F,0px_2px_#0F6E6F,0px_-2px_#0F6E6F,1px_1px_#0F6E6F,-1px_-1px_#0F6E6F] uppercase"
                              title="View order details"
                            >
                              View Details
                            </button>
                          </div>

                          <button
                            className="block md:hidden bg-[#1CBBBC] text-white font-semibold text-xs font-chakra transition-colors px-4 py-2 rounded-lg [text-shadow:2px_0px_#0F6E6F,-2px_0px_#0F6E6F,0px_2px_#0F6E6F,0px_-2px_#0F6E6F,1px_1px_#0F6E6F,-1px_-1px_#0F6E6F] mt-auto uppercase"
                            title="View order details"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Fragment>
          ))}

          {/* Infinite loading trigger and indicator */}
          {hasNextPage && (
            <div ref={ref} className="flex items-center justify-center py-4">
              {isFetchingNextPage ? (
                <LoadingSpinner />
              ) : (
                <p className="text-white text-sm font-normal font-chakra">
                  Scroll down to load more
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { ShopItem } from '../components/shop/ShopItem';
import { CartModal } from '../components/shop/CartModal';
import { HalloweenRuleModal } from '../components/HalloweenRuleModal';

import { useCartStore } from '../stores/cartStore';
import { useShopItems } from '../../hooks/useShopItems';
import Link from 'next/link';
import { ROUTES } from '../constants/routes';
import Image from 'next/image';
import { useGlobalContext } from '../providers/GlobalProvider';
import { useSession, signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import LoadingScreen from '../components/common/LoadingScreen';

function ShopPageContent() {
  const { showSignUpModalWithStoreMessage } = useGlobalContext();
  const { status: sessionStatus } = useSession();
  const { getTotalItems } = useCartStore();
  const { items: shopItems, loading, error, refetch } = useShopItems();
  const [isHalloweenRuleModalOpen, setIsHalloweenRuleModalOpen] = useState(false);
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const searchParams = useSearchParams();

  const totalItemsInShop = shopItems.length;

  // Auto-login when iframe opens with ?token={pg_token}
  useEffect(() => {
    const token = searchParams?.get('token');

    if (token && sessionStatus !== 'authenticated' && !isAutoLoggingIn) {
      (async () => {
        setIsAutoLoggingIn(true);
        try {
          console.log('Auto-logging in with token from URL parameter');
          const loginResult: any = await signIn('token-login', {
            data: JSON.stringify({ token: token }),
            redirect: false,
          });

          if (loginResult?.error === null) {
            console.log('Auto-login successful');
            // Remove token from URL to clean it up
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url.toString());
          } else {
            console.error('Auto-login error:', loginResult?.error);
          }
        } catch (loginError: any) {
          console.error('Auto-login error:', loginError);
        } finally {
          setIsAutoLoggingIn(false);
        }
      })();
    }
  }, [searchParams, sessionStatus, isAutoLoggingIn]);

  const checkValidAddToCard = () => {
    const isLogged = sessionStatus === 'authenticated';
    if (!isLogged) {
      showSignUpModalWithStoreMessage();
    }
    return isLogged;
  };

  return (
    <>
      {/* Shop Banner */}
      <div className="relative w-[calc(100vw-48px)] aspect-[318/143] md:aspect-[1314/244] md:max-w-[1313px] md:w-full  overflow-hidden mx-auto border-0 border-white rounded-lg">
        <Image
          src="/images/shop/halloween-banner.png"
          alt="Shop Banner"
          fill
          className="rounded-lg hidden md:block aspect-[1314/244]"
          priority
        />
        <Image
          src="/images/shop/halloween-banner-mobile.png"
          alt="Shop Banner"
          fill
          className="rounded-lg block md:hidden  aspect-[318/143]"
          priority
        />
        {/* <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-[40px] md:text-[96px] text-white font-batgrexo uppercase">Store</h1>
            <p className="text-white text-base md:text-2xl font-semibold w-3/4 md:w-full mx-auto leading-5 -mt-2 md:mt-0">
              Get Karrots & Coins — Power Up, Style Out, Play Legendary.
            </p>
          </div>
        </div> */}

        <div className="absolute bottom-2 md:bottom-1 xl:bottom-2 md:left-[23%] left-[10%] flex items-center justify-center">
          <button
            onClick={() => setIsHalloweenRuleModalOpen(true)}
            className="flex flex-row items-center justify-center w-[127px] md:w-[calc(100vw*0.0661)] md:min-w-[105px] max-w-[127px] aspect-[127/42] gap-[5.07px] rounded-[4.06px] bg-[#4F41AB] border border-white hover:bg-[#3d3299] transition-colors"
          >
            <p className="text-white font-batgrexo font-normal text-sm md:text-base leading-[100%] drop-shadow-[0_2.03px_2.03px_rgba(0,0,0,0.5)]">
              Learn more
            </p>
          </button>
        </div>
      </div>

      <main className="w-full md:max-w-[1313px] mx-auto">
        {/* Shop Header */}
        <div className="mt-6 md:mt-12 mb-6 md:mb-8">
          {/* Shop Stats Bar */}
          <div className="flex flex-row justify-between items-center gap-4 border-b py-3.5">
            <p className="text-white text-sm md:text-2xl font-semibold">
              Total: {totalItemsInShop} items
            </p>

            <div className="flex gap-2 md:gap-3">
              {/* History Button */}
              <Link href={ROUTES.PURCHASE_HISTORY} className="shopIconHover">
                <Image
                  src="/assets/icons/ic-history.svg"
                  alt="History Icon"
                  className="w-8 h-8 md:w-10 md:h-10 shopIcon"
                  width={40}
                  height={40}
                />
              </Link>

              <Link href={ROUTES.CART} className="relative shopIconHover">
                <Image
                  src="/assets/icons/ic-shop.svg"
                  alt="Shop Icon"
                  width={40}
                  height={40}
                  className="shopIcon w-8 h-8 md:w-10 md:h-10"
                />
                {getTotalItems() > 0 && (
                  <p className="text-[#FF8F00] text-[10px] md:text-xs font-bold absolute top-1/2 right-1/2 inset-0 translate-x-1/2 -translate-y-1/2 text-center">
                    {getTotalItems() > 9 ? '9+' : getTotalItems()}
                  </p>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Shop Items Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">Loading shop items...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 text-xl">Error loading shop items</p>
            <p className="text-gray-500 mt-2">{error}</p>
            <button
              onClick={refetch}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-[72px]">
            {shopItems.map(item => (
              <ShopItem key={item.id} item={item} checkValidAddToCard={checkValidAddToCard} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && shopItems.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-xl">No items available in the shop</p>
            <p className="text-gray-500 mt-2">Check back later for new products!</p>
          </div>
        )}
      </main>

      {/* Modals */}
      <CartModal />
      <HalloweenRuleModal
        isOpen={isHalloweenRuleModalOpen}
        onClose={() => setIsHalloweenRuleModalOpen(false)}
        onLoginClick={() => {
          // Handle login logic here - you can redirect to login page or open login modal
          console.log('Login clicked');
        }}
      />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ShopPageContent />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import { useCartStore, CartItem } from '../stores/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '../constants/routes';
import { RemoveModal } from '../components/shop/RemoveModal';
import useUserInfo from '@/hooks/useUserInfo';
import { toast } from 'react-toastify';
import { useGlobalContext } from '../providers/GlobalProvider';
import { useSession } from 'next-auth/react';

export default function CartPage() {
  const { showSignUpModalWithStoreMessage } = useGlobalContext();
  const { status: sessionStatus } = useSession();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();

  const { userInfo } = useUserInfo();
  const { requireLogin } = useGlobalContext();

  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('usd');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const handleStripeCheckout = async () => {
    if (items.length === 0) return;

    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      alert('Stripe configuration is missing. Please contact support.');
      return;
    }

    setIsProcessingPayment(true);

    try {
      const lineItems = items.map(item => ({
        name: `${item.name} Pack`,
        unitAmount: Math.round(item.price * 100),
        quantity: item.quantity,
        priceId: item.priceId,
      }));

      console.log('items', items);

      const requireShipping = items.some(item => item.description?.toLowerCase().includes('t-shirt')) || false;

      const response = await fetch('/api/stripe/checkout-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems,
          currency: 'usd',
          customer_id: userInfo?.stripe_customer_id,
          wallet_id: userInfo?.lootlocker_wallet_id,
          player_id: userInfo?.lootlocker_player_id?.toString(),
          requireShipping,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment session creation failed');
      }

      const { sessionId, url } = await response.json();

      // Check if we're in an iframe
      const isInIframe = window.self !== window.top;

      if (isInIframe) {
        // If in iframe, open checkout in a new window to avoid security restrictions
        if (url) {
          window.open(url, '_blank', 'noopener,noreferrer');
        } else {
          throw new Error('Checkout URL not available');
        }
      } else {
        // If not in iframe, use standard Stripe redirect
        const stripe = await import('@stripe/stripe-js').then(module =>
          module.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        );

        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          if (error) {
            throw new Error(error.message);
          }
        } else {
          throw new Error('Stripe failed to load');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCheckout = () => {
    const isLogged = sessionStatus === 'authenticated';
    if (!isLogged) {
      showSignUpModalWithStoreMessage();
      return;
    }
    if (items.length === 0) return;

    switch (selectedPaymentMethod) {
      case 'usd':
        requireLogin(() => {
          handleStripeCheckout();
        });
        break;
      case 'skl':
      case 'core':
      case 'pen':
        // TODO: Implement crypto payment methods
        toast.info(`${selectedPaymentMethod.toUpperCase()} payment not implemented yet`);
        break;
      default:
        toast.info('Please select a payment method');
    }
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      const item = items.find(item => item.id === id);
      if (item) {
        setItemToRemove(item);
        setIsRemoveModalOpen(true);
      }
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemoveClick = (item: CartItem) => {
    setItemToRemove(item);
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id);
      setItemToRemove(null);
    }
  };

  const handleCloseRemoveModal = () => {
    setIsRemoveModalOpen(false);
    setItemToRemove(null);
  };

  return (
    <div className="min-h-screen w-full md:max-w-[1324px] mx-auto px-6 md:px-0">
      {/* Cart Header */}
      <div className="mb-5 md:mb-8">
        <div className="flex items-center justify-between mb-4 border-b border-white pb-2 md:pb-4">
          <Link
            href={ROUTES.SHOP}
            className="bg-transparent text-white font-semibold text-sm md:text-base"
          >
            &lt; back to store
          </Link>
        </div>

        <h1 className="text-white text-4xl md:text-[72px] font-batgrexo uppercase text-center mt-4 md:mt-8">
          MY CART
        </h1>
      </div>

      {items.length === 0 ? (
        /* Empty Cart */
        <div className="flex flex-col items-center justify-center gap-2 md:gap-8">
          <h2 className="text-base md:text-4xl text-white font-semibold font-chakra text-center">
            It’s empty, give your cart some fun!
          </h2>

          <Link href={ROUTES.SHOP} className="text-center text-white font-semibold text-base">
            Continue Shopping &gt;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-5 md:space-y-12">
            {items.map(item => (
              <div key={item.id} className="bg-[#43434380] relative">
                <div className="flex">
                  <div className="w-[116px] md:w-[240px] bg-[#2B2B2B] border shrink-0">
                    <div className="relative h-[116px] md:h-[190px] bg-[#2B2B2B] overflow-hidden px-2 md:px-4 pb-6 md:pb-12 pt-2 md:pt-4">
                      <div className="relative h-full w-full">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <p className="text-white text-[11px] md:text-2xl text-center font-chakra uppercase mt-1 md:mt-2">
                        {item.name}
                      </p>
                    </div>

                    <p className="text-black text-[11px] md:text-xl text-center font-chakra uppercase font-bold bg-[#DBDBDB] p-1 md:p-3">
                      USD {item.price.toFixed(2)}$
                    </p>
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-2 px-4 md:px-8 md:py-4">
                    <div>
                      <h3 className="text-white font-chakra uppercase font-semibold text-base md:text-4xl mb-1 md:mb-2">
                        {item.name} Pack
                      </h3>
                      <p className="font-chakra font-semibold text-sm md:text-base">
                        Item price: ${item.price.toFixed(2)} USD
                      </p>
                    </div>

                    <div className="flex items-start justify-start gap-4 md:gap-8 w-full">
                      <div>
                        <p className="text-white font-semibold text-xs md:text-base font-chakra">
                          Quantity
                        </p>
                        <div className="flex items-center space-x-2 md:space-x-3 mt-1 md:mt-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="text-white font-bold text-[26px] md:text-[32px]"
                          >
                            -
                          </button>

                          <span className="font-semibold text-base md:text-xl w-8 md:w-10 bg-white text-black text-center font-chakra rounded">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="text-white font-bold text-[26px] md:text-[32px]"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-white font-semibold text-xs md:text-base font-chakra">
                          Subtotal
                        </p>
                        <p className="text-white font-semibold text-base font-chakra mt-3 md:mt-4">
                          ${(item.price * item.quantity).toFixed(2)} USD
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveClick(item)}
                        className="hidden md:block text-gray-400 font-semibold text-base font-chakra underline ml-auto mt-10"
                        title="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveClick(item)}
                  className="block md:hidden absolute top-4 right-4"
                  title="Remove item"
                >
                  <Image
                    src="/assets/icons/ic-close.svg"
                    alt="Remove item"
                    width={16}
                    height={16}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="md:px-6 sticky top-8">
              <h2 className="text-[#FF8F00] font-chakra font-semibold text-xl md:text-[32px] mb-2 md:mb-4 uppercase">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-6 md:mb-12">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex justify-between text-white uppercase text-base font-semibold font-chakra">
                      <span>
                        {item.name} Pack x{item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)} USD</span>
                    </div>
                    {index < items.length - 1 && <hr className="border-white border-t mt-4" />}
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mb-2 md:mb-4">
                <p className="text-xl md:text-[32px] text-[#FF8F00] uppercase font-chakra font-semibold">
                  Total
                </p>
                <p className="text-[28px] md:text-[40px] text-white uppercase font-chakra font-semibold">
                  USD ${getTotalPrice().toFixed(2)}
                </p>
              </div>

              {/* Payment Options */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="usd"
                    checked={selectedPaymentMethod === 'usd'}
                    onChange={e => setSelectedPaymentMethod(e.target.value)}
                    className="text-[#f4ba0e]"
                  />
                  <span className="text-white font-chakra text-base font-semibold">
                    Pay in $USD
                  </span>

                  <Image
                    src="/assets/icons/powered_by_stripe.svg"
                    alt="Powered by Stripe"
                    width={124}
                    height={28}
                    className="w-auto h-auto"
                  />
                </label>
                {/* <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="skl"
                    checked={selectedPaymentMethod === 'skl'}
                    onChange={e => setSelectedPaymentMethod(e.target.value)}
                    className="text-[#f4ba0e]"
                  />
                  <span className="text-white font-chakra text-base font-semibold">
                    Pay in $SKL
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="core"
                    checked={selectedPaymentMethod === 'core'}
                    onChange={e => setSelectedPaymentMethod(e.target.value)}
                    className="text-[#f4ba0e]"
                  />
                  <span className="text-white font-chakra text-base font-semibold">
                    Pay in $AVAX
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="pen"
                    checked={selectedPaymentMethod === 'pen'}
                    onChange={e => setSelectedPaymentMethod(e.target.value)}
                    className="text-[#f4ba0e]"
                  />
                  <span className="text-white font-chakra text-base font-semibold">
                    Pay in $PEN
                  </span>
                </label> */}
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={items.length === 0 || isProcessingPayment}
                className="bg-[#1CBBBC] rounded-lg px-4 py-3 md:py-5 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="text-lg md:text-xl text-white font-bold font-chakra [text-shadow:2px_0px_#0F6E6F,-2px_0px_#0F6E6F,0px_2px_#0F6E6F,0px_-2px_#0F6E6F,1px_1px_#0F6E6F,-1px_-1px_#0F6E6F] uppercase">
                  {isProcessingPayment ? 'PROCESSING...' : 'CHECKOUT'}
                </p>
              </button>

              {/* Continue Shopping */}
              <div className="text-center mt-4 md:mt-2">
                <Link href={ROUTES.SHOP} className="text-white font-chakra font-semibold text-sm">
                  Continue Shopping &gt;
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <RemoveModal
        isOpen={isRemoveModalOpen}
        onClose={handleCloseRemoveModal}
        item={itemToRemove}
        onConfirmRemove={handleConfirmRemove}
      />
    </div>
  );
}

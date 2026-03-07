'use client';

import React, { useState } from 'react';
import ModalOverlay from '../common/ModalOverlay';
import Image from 'next/image';
import useLogin from '@/hooks/useLogin';
import { useSignMessage, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { toast } from 'react-toastify';

interface WalletMismatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedAddress: string;
  profileAddress: string;
  onSwitch: () => void;
}

export const WalletMismatchModal: React.FC<WalletMismatchModalProps> = ({
  isOpen,
  onClose,
  connectedAddress,
  profileAddress,
  onSwitch,
}) => {
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { createWalletLogin, isLoading: loginLoading } = useLogin({
    onSuccess: () => {
      toast.success('Wallet switched successfully!');
      onSwitch();
      onClose();
    },
    onError: (error: string) => {
      toast.error(`Switch failed: ${error}`);
    },
    isLoginWithWallet: true,
  });

  const getMessage = () => {
    return `Logging into Avalanche Games,${parseInt((new Date().getTime() / 1000).toFixed(0))}`;
  };

  const handleSwitch = async () => {
    try {
      setIsDisconnecting(true);

      // Disconnect current wallet
      disconnect();

      // Show success message and instructions
      toast.success('Current wallet disconnected. Please connect your profile wallet.');

      // Small delay to ensure disconnect is processed
      setTimeout(() => {
        // Open connect modal to allow user to connect the correct wallet
        openConnectModal?.();
        setIsDisconnecting(false);
        onClose();
      }, 500);
    } catch (error: any) {
      console.error('Wallet disconnect error:', error);
      toast.error(`Failed to disconnect: ${error.message || 'Unknown error'}`);
      setIsDisconnecting(false);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="border border-white rounded-lg p-6 relative bg-black/80 w-full md:max-w-[508px]">
        <button
          className="absolute top-4 right-4 z-10 border border-white rounded-full p-1.5"
          onClick={onClose}
        >
          <Image src="/assets/icons/ic-close.svg" alt="Close" width={12} height={12} />
        </button>

        <div className="text-center">
          <h2 className="text-white text-2xl md:text-[32px] font-bold font-chakra uppercase mb-2.5">
            WELCOME BACK
          </h2>

          <p className="text-white text-sm md:text-[18px] leading-relaxed mb-8 px-4 font-sora">
            Your current connected wallet is different from the one in your profile. Click "SWITCH"
            to disconnect and connect your profile wallet.
          </p>

          {/* Address Display */}
          <div className="bg-[#1A1A1A] rounded-xl p-5 mb-5 mx-4">
            <div className="text-center mb-4">
              <p className="text-[#A0A0A0] text-xs md:text-sm mb-2">Your PG linked wallet is:</p>
              <div className="text-[#FF8F00] font-sora text-lg md:text-[22px]">
                {truncateAddress(profileAddress)}
              </div>
            </div>

            <button
              onClick={handleSwitch}
              disabled={isDisconnecting || loginLoading}
              className="px-6 py-2 md:px-8 md:py-3 rounded-lg bg-transparent hover:bg-white/10 transition-colors border border-white w-full disabled:opacity-50"
            >
              <span className="text-white font-bold uppercase text-xs md:text-sm font-chakra">
                {isDisconnecting ? 'DISCONNECTING...' : loginLoading ? 'SWITCHING...' : 'SWITCH'}
              </span>
            </button>
          </div>

          <div className="bg-[#1A1A1A] rounded-xl p-5 mb-5 mx-4">
            <div className="text-center mb-4">
              <p className="text-[#A0A0A0] text-xs md:text-sm mb-2">
                Your loot balance with current wallet will not be linked to your in-game account. If
                you have a different PG account tied to this wallet, your balance will be available
                there.
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2 md:px-8 md:py-3 rounded-lg bg-transparent hover:bg-white/10 transition-colors border border-white w-full"
            >
              <span className="text-white font-bold uppercase text-xs md:text-sm font-chakra">
                KEEP CURRENT ONE
              </span>
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};

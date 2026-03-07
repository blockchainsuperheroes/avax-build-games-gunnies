'use client';

import React, { useState, useEffect } from 'react';
import ModalOverlay from '../common/ModalOverlay';
import Image from 'next/image';
import { useAccount, useSignMessage } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import useLogin from '@/hooks/useLogin';
import { toast } from 'react-toastify';
import { useGlobalContext } from '@/app/providers/GlobalProvider';

interface WalletDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export const WalletDetectionModal: React.FC<WalletDetectionModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  const { address, isConnected } = useAccount();
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasWalletExtension, setHasWalletExtension] = useState(false);
  const { signMessageAsync } = useSignMessage();
  const { openConnectModal } = useConnectModal();
  const { isAuthenticated } = useGlobalContext();
  // Check if wallet extension is available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasWalletExtension(!!window.ethereum);
    }
  }, []);

  const { createWalletLogin, isLoading: loginLoading } = useLogin({
    onSuccess: () => {
      toast.success('Wallet login successful!');
      // Call the callback first to allow parent to handle post-login actions
      onConnect();
      // Then close the modal
      onClose();
    },
    onError: (error: string) => {
      toast.error(`Login failed: ${error}`);
      setIsConnecting(false);
    },
    isLoginWithWallet: true,
  });

  const getMessage = () => {
    return `Logging into Avalanche Games,${parseInt((new Date().getTime() / 1000).toFixed(0))}`;
  };

  const handleConnect = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    try {
      setIsConnecting(true);

      // If user is already authenticated, just connect the wallet without login
      if (isAuthenticated) {
        toast.success('Wallet connected successfully!');
        onConnect();
        onClose();
        return;
      }

      // If not authenticated, proceed with wallet login
      const message = getMessage();
      const signature = await signMessageAsync({ message });

      // Login with wallet
      await createWalletLogin(signature, address!.toLowerCase(), message);
    } catch (error: any) {
      console.error('Wallet connection/login error:', error);
      toast.error(`Failed to connect: ${error.message || 'Unknown error'}`);
      setIsConnecting(false);
    }
  };

  // Get appropriate content based on wallet extension availability and authentication status
  const getModalContent = () => {
    if (hasWalletExtension) {
      if (isAuthenticated) {
        return {
          title: 'CONNECT YOUR WEB3 WALLET',
          description: 'Connect your wallet to access blockchain features and claim rewards',
          buttonText: 'CONNECT',
        };
      } else {
        return {
          title: 'CONNECT YOUR WEB3 WALLET TO AVAX GROUP PROFILE',
          description: 'You will not be able to claim on chain Loot Box until you have connected a wallet',
          buttonText: 'CONNECT',
        };
      }
    } else {
      return {
        title: 'NO WALLET IS DETECTED',
        description: 'You will not be able to claim on chain Loot Box until you have connected a wallet',
        buttonText: 'INSTALL METAMASK',
      };
    }
  };

  const modalContent = getModalContent();

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="border border-white rounded-lg p-6 relative bg-black/80 w-full md:max-w-[600px]">
        <button
          className="absolute top-4 right-4 z-10 border border-white rounded-full p-1.5"
          onClick={onClose}
        >
          <Image src="/assets/icons/ic-close.svg" alt="Close" width={12} height={12} />
        </button>

        <div className="text-center">
          <h2 className="text-white text-2xl md:text-3xl font-bold font-chakra uppercase mb-6">
            {modalContent.title}
          </h2>

          <p className="text-gray-300 text-sm md:text-lg leading-relaxed mb-8 px-4">
            {modalContent.description}
          </p>

          {/* Main Action Button */}
          {!hasWalletExtension ? (
            // No wallet extension - show install instructions
            <div className="space-y-4">
              <button
                className="px-6 py-2 md:px-8 md:py-3 rounded-lg bg-transparent hover:bg-white/10 transition-colors border border-white w-full"
                onClick={() => window.open('https://metamask.io/download/', '_blank')}
              >
                <span className="text-white font-bold uppercase text-xs md:text-sm font-chakra">
                  INSTALL METAMASK
                </span>
              </button>
              <p className="text-gray-500 text-xs">Or install any other Web3 wallet extension</p>
            </div>
          ) : (
            // Wallet connected - show sign & login button
            <button
              className="px-6 py-2 md:px-8 md:py-3 rounded-lg bg-transparent hover:bg-white/10 transition-colors border border-white w-full md:w-auto min-w-[200px]"
              onClick={handleConnect}
              disabled={isConnecting || loginLoading}
            >
              <span className="text-white font-bold uppercase text-xs md:text-sm font-chakra">
                {isConnecting || loginLoading 
                  ? 'CONNECTING...' 
                  : !isConnected 
                    ? 'CONNECT WALLET' 
                    : isAuthenticated 
                      ? 'CONNECT' 
                      : 'SIGN MESSAGE'
                }
              </span>
            </button>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
};

export default WalletDetectionModal;

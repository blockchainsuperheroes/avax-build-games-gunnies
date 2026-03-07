import React, { useEffect, useState } from 'react';
import { View } from '../common/View';
import { useAccount, useConnect } from 'wagmi';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import useLogin from '@/hooks/useLogin';
import { ConnectButton } from '@rainbow-me/rainbowkit';

function WalletSection({
  handleLoginSuccess,
  handleLoginFailed,
  showSignUpCb,
  justConnect = false,
}: {
  handleLoginSuccess?: () => void;
  handleLoginFailed?: (error: string) => void;
  showSignUpCb?: () => void;
  justConnect?: boolean;
}) {
  const { connector, status: accountStatus } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { status } = useSession();
  const { createSignedSignature, isLoading } = useLogin({
    onSuccess: async () => {
      if (handleLoginSuccess) {
        handleLoginSuccess();
      }
    },
    onError: (error: string) => {
      if (handleLoginFailed) {
        handleLoginFailed(error);
      }
    },
    showSignUpCb,
    isLoginWithWallet: true,
  });

  const getWalletConnector = () => {
    if (typeof window === 'undefined') return null;

    const latestId = localStorage.getItem('rk-latest-id');
    if (!latestId || connectors.length === 0) return null;

    const connector = connectors.find(c => c.id === latestId);

    const connectorMap: Record<string, { text: string; imgSrc: string }> = {
      'io.rabby': {
        text: 'Login with Rabby',
        imgSrc: '/assets/icons/rabby-wallet.png',
      },
      walletConnect: {
        text: 'Login with WalletConnect',
        imgSrc: '/assets/icons/ic-wallet-connect.svg',
      },
      'io.metamask': {
        text: 'Login with MetaMask',
        imgSrc: '/assets/icons/metamask-icon@2x.png',
      },
    };

    return connector ? (connectorMap[connector.id] ?? null) : null;
  };

  return (
    <>
      {status === 'unauthenticated' && accountStatus == 'connected' ? (
        <View className="flex justify-center mt-[30px] w-full">
          <button
            type="button"
            onClick={() => {
              if (!isLoading) {
                createSignedSignature();
              }
            }}
            className="flex flex-1 flex-row justify-center items-center py-2.5 px-3 border border-white rounded-lg hover:border-[#5f188b] gap-4"
          >
            <div className="relative h-[36px] w-[36px]">
              <Image
                priority={true}
                fill={true}
                objectFit="contain"
                src={getWalletConnector()?.imgSrc ?? '/assets/icons/metamask-icon@2x.png'}
                alt=""
                className="rounded-full"
              />
            </div>
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <p className="cursor-pointer text-white underline font-charka text-xs lg:text-lg">
                {status === 'unauthenticated' && accountStatus == 'connected'
                  ? getWalletConnector()?.text ?? 'Login with MetaMask'
                  : 'Connect Wallet'}
              </p>
            )}
          </button>
        </View>
      ) : (
        <View className="w-full flex flex-col text-center mt-8">
          <ConnectButton />
        </View>
      )}
    </>
  );
}

export default WalletSection;

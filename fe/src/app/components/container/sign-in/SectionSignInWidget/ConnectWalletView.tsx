

"use client";

import useLogin from "@/hooks/useLogin";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useAccount, useConnect } from "wagmi";
import { Button, ButtonIcon, ButtonType, Text, View } from "../../..";

export const ConnectWalletView = ({
  onClose,
  handleLoginSuccess,
  handleLoginFailed,
  showSignUpCb,
  justConnect = false,
}: {
  onClose?: () => void;
  handleLoginSuccess?: () => void;
  handleLoginFailed?: (error: string) => void;
  showSignUpCb?: () => void;
  justConnect?: boolean;
}) => {
  const { connector, status: accountStatus } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { status, data: session, update } = useSession();
  const { createSignedSignature, isLoading: isProcessing } = useLogin({
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
   <View className="bg-transparent w-full flex items-center justify-center">
      <View className={`color-border-bg w-[calc(100vw-40px)] max-w-[400px] md:max-w-[432px] md:w-[432px] h-fit p-1`}>
        <View className=" w-full h-fit flex flex-col items-center p-5 lg:py-[36px] lg:px-[48px] rounded-[20px] backdrop-blur-[32px] bg-[linear-gradient(180deg,rgba(14,12,21,0.9)_0%,rgba(14,12,21,0)_100%)]">
       <Text
          className={`w-full text-center font-chakra-petch font-bold text-[30px] leading-[38px] text-white`}
          label={accountStatus == 'connected' ? 'CONNECTED WALLET' : 'CONNECT WALLET'}
        />
    <>
      {!isProcessing ? (
        <>
          {status === "unauthenticated" && accountStatus == 'connected' ? (
            <View className="flex justify-start mt-3">
              <Button
                onClick={() => {
                  createSignedSignature();
                }}
                btnType={ButtonType.view}
                className="flex flex-row justify-center items-center gap-[5px]"
              >
                <div className="relative h-[36px] w-[36px]">
                  <Image
                    priority={true}
                    fill={true}
                    objectFit="contain"
                    src={getWalletConnector()?.imgSrc ?? '/assets/icons/metamask-icon@2x.png'}
                    alt=""
                  />
                </div>
                <Text
                  label={
                    status === "unauthenticated" && accountStatus == 'connected'
                      ? getWalletConnector()?.text ?? 'Login with MetaMask'
                      : "Connect Wallet"
                  }
                  className="cursor-pointer text-white underline font-lexend-giga text-[12px] leading-[17px] tracking-[-0.1em]"
                />
              </Button>
            </View>
          ) : (
            <View className="w-full flex flex-col text-center mt-3">
              <View className="w-full flex flex-col gap-3">
                <div className="flex-1 w-full" >
                  <ConnectButton />
                </div>
              </View>
            </View>
          )}
        </>
      ) : (
        <img className={`w-20 mt-10 mx-auto`} src="/assets/icons/loader.svg" alt="" />
      )}
    </>
        <View className="absolute right-[8px] top-[8px] flex flex-col justify-center items-center">
          <ButtonIcon
            onClick={onClose}
            twBgIcon="bg-ic-close-black"
            className="w-[24px] h-[24px] cursor-pointer"
          />
        </View>
      </View>
      </View>
    </View>
  );
};

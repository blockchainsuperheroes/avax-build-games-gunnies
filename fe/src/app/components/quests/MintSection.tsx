import React, { useEffect, useState } from 'react';
import { Tooltip } from '../common/Tooltip';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import useMintAvalanche from '@/hooks/useMintAvalanche';
import useMintAvalanche from '@/hooks/useMintAvalanche';
import { useAccount, useSwitchChain } from 'wagmi';
import { toast } from 'react-toastify';
import { avalancheFuji, avalanche } from 'viem/chains';
import { formatUnits, UserRejectedRequestError } from 'viem';
import { useHasAvalanchePremiumUserChests, useHasAvalanchePremiumUserChests } from '@/hooks/useChestCount';
import useGetMintPriceAvalanche from '@/hooks/useGetMintPriceAvalanche';
import useGetMintPriceAvalanche from '@/hooks/useGetMintPriceAvalanche';
import { useGlobalContext } from '@/app/providers/GlobalProvider';

const DynamicReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const MintSection = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const { price: priceAvalanche } = useGetMintPriceAvalanche();
  const { price: priceAvalanche } = useGetMintPriceAvalanche();
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { showWalletDetectionModal } = useGlobalContext();

  const avaxPremiumUserChests = useHasAvalanchePremiumUserChests();
  const corePremiumUserChests = useHasAvalanchePremiumUserChests();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMint = async (chainId: number) => {
    try {
      if (!isConnected) {
        showWalletDetectionModal(() => {
          handleMint(chainId);
        });
        return;
      }

      const result = await switchChainAsync({ chainId });

      if (isLoadingAvalanche || isLoadingAvalanche) {
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      if (result.id === avalancheFuji.id) {
        await mintAvalanche(chainId);
      } else {
        await mintAvalanche(chainId);
      }
    } catch (error: any) {
      if (error instanceof UserRejectedRequestError) {
        toast.warn('Transaction cancelled');
      } else if (error.message.includes('Insufficient balance')) {
        toast.error('Insufficient balance');
      } else if (error.message.includes('User rejected the request')) {
        toast.error('User rejected the request');
      } else {
        toast.error('Mint failed');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 py-4 md:py-8 md:max-w-[1569px] w-full mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-start gap-12 px-4 md:px-8">
        <div className="block relative w-full max-w-[calc(100dvw_/_2.5)] sm:max-w-sm md:max-w-[150px] ">
          <div className="absolute inset-0 bg-[#EF6C00] blur-2xl z-0" />

          <div className="relative w-full h-full overflow-hidden rounded-xl z-10">
            {isMounted && (
              <DynamicReactPlayer
                playing
                url="/assets/gunnies-nft.webm"
                width="100%"
                height="100%"
                controls={false}
                loop
                muted
              />
            )}
          </div>
        </div>
        <div>
          <p className="text-[40px] md:text-[50px] font-batgrexo text-[#1CBBBC] leading-[48px] mb-4">
            Unlock Mayhem. <br /> Dominate the Boom.
          </p>

          <div>
            <p className="text-white text-base font-semibold font-chakra">
              BUYING THIS NFT GIVES YOU:
            </p>
            <li className="text-white text-base font-semibold">🗃️ +5 Chests for that chain</li>
            <li className="text-white text-base font-semibold">🏆 Double leaderboard rewards</li>
            <li className="text-white text-base font-semibold">
              🌟1 year Gunnies Gang membership <br className="block md:hidden" />{' '}
              <span className="ml-4 md:ml-0 block md:inline">(120$ worth)</span>
            </li>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-stretch justify-stretch gap-8">
        {avaxPremiumUserChests ? (
          <CardEquipped chainId={avalanche.id} />
        ) : (
          <div className="flex flex-row md:flex-col items-center justify-between border border-white rounded-lg p-8 gap-4 flex-1">
            <Image
              src="/images/quests/avax-logo.png"
              width={191}
              height={49}
              alt="avax-logo"
              className="w-[124px] h-[32px] md:w-[191px] md:h-[49px] md:mt-4"
            />

            <p className="text-base text-white font-chakra uppercase font-bold">
              Price: {priceAvalanche ? formatUnits(BigInt(priceAvalanche), 18) : '0'} SKL
            </p>

            <button
              onClick={() => handleMint(avalanche.id)}
              disabled={isLoadingAvalanche}
              className="block bg-[#1CBBBC] rounded-lg px-4 py-2 w-full"
            >
              <p className="text-base md:text-xl text-white font-bold font-chakra [text-shadow:2px_0px_#0F6E6F,-2px_0px_#0F6E6F,0px_2px_#0F6E6F,0px_-2px_#0F6E6F,1px_1px_#0F6E6F,-1px_-1px_#0F6E6F] uppercase">
                {isLoadingAvalanche ? 'Minting...' : 'Buy Kaboom Pass'}
              </p>
            </button>
          </div>
        )}

        {corePremiumUserChests ? (
          <CardEquipped chainId={avalancheFuji.id} />
        ) : (
          <div className="flex flex-row md:flex-col items-center justify-between border border-white rounded-lg p-8 gap-4 flex-1">
            <Image
              src="/images/quests/core-logo.png"
              width={195}
              height={65}
              alt="core-logo"
              className="w-[124px] h-[42px] md:w-[195px] md:h-[65px]"
            />

            <p className="text-base text-white font-chakra uppercase font-bold">
              Price: {priceAvalanche ? formatUnits(BigInt(priceAvalanche), 18) : '0'} Avalanche
            </p>
            <button
              onClick={() => handleMint(avalancheFuji.id)}
              disabled={isLoadingAvalanche}
              className="block bg-[#1CBBBC] rounded-lg px-4 py-2 w-full"
            >
              <p className="text-base md:text-xl text-white font-bold font-chakra [text-shadow:2px_0px_#0F6E6F,-2px_0px_#0F6E6F,0px_2px_#0F6E6F,0px_-2px_#0F6E6F,1px_1px_#0F6E6F,-1px_-1px_#0F6E6F] uppercase">
                {isLoadingAvalanche ? 'Minting...' : 'Buy Kaboom Pass'}
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MintSection;

const CardEquipped = ({ chainId }: { chainId: number }) => {
  const isAvalanche = chainId === avalanche.id;

  return (
    <div className="flex flex-col items-center justify-between border border-white rounded-lg p-8 gap-4 flex-1 relative bg-[url('/images/quests/equipped-background.png')] bg-cover bg-[center_bottom] md:bg-center bg-no-repeat">
      <Image
        src="/images/quests/check-mark.png"
        width={64}
        height={64}
        alt="checked mark"
        className="hidden md:block absolute -top-6 -right-6"
      />
      <Image
        src={`/images/quests/${isAvalanche ? 'avax' : 'core'}-logo.png`}
        width={isAvalanche ? 191 : 195}
        height={isAvalanche ? 49 : 65}
        alt={`${isAvalanche ? 'avax' : 'core'}-logo`}
        className={`mt-12 ${isAvalanche ? 'w-[191px] h-[49px]' : 'w-[195px] h-[65px]'}`}
      />

      <div className="flex items-center justify-center gap-1">
        <Image
          src="/images/quests/check-mark.png"
          width={40}
          height={40}
          alt="checked mark"
          className="block md:hidden"
        />
        <p className="text-xl md:text-2xl text-[#FF9505] font-batgrexo text-center">
          KABOOM PASS NFT EQUIPPED
        </p>
      </div>
    </div>
  );
};

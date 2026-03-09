import React, { useEffect, useState } from 'react';
import { Tooltip } from '../common/Tooltip';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import useMintAvax from '@/hooks/useMintAvax';
import { useAccount, useSwitchChain } from 'wagmi';
import { toast } from 'react-toastify';
import { avalanche } from 'viem/chains';
import { formatUnits, UserRejectedRequestError } from 'viem';
import { useHasAvaxPremiumUserChests } from '@/hooks/useChestCount';
import useGetMintPriceAvax from '@/hooks/useGetMintPriceAvax';
import { useGlobalContext } from '@/app/providers/GlobalProvider';

const DynamicReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const MintSection = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { mint: mintAvax, isLoading: isLoadingAvax } = useMintAvax();
  const { price: priceAvax } = useGetMintPriceAvax();
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { showWalletDetectionModal } = useGlobalContext();
  const avaxPremiumUserChests = useHasAvaxPremiumUserChests();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMint = async () => {
    try {
      if (!isConnected) {
        showWalletDetectionModal(() => {
          handleMint();
        });
        return;
      }

      await switchChainAsync({ chainId: avalanche.id });

      if (isLoadingAvax) return;

      await new Promise(resolve => setTimeout(resolve, 500));
      await mintAvax(avalanche.id);
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
        <div className="block relative w-full max-w-[calc(100dvw_/_2.5)] sm:max-w-sm md:max-w-[150px]">
          <div className="absolute inset-0 bg-[#E84142] blur-2xl z-0" />
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
          <p className="text-[40px] md:text-[50px] font-batgrexo text-[#E84142] leading-[48px] mb-4">
            Unlock Mayhem. <br /> Dominate the Boom.
          </p>
          <div>
            <p className="text-white text-base font-semibold font-chakra">
              BUYING THIS NFT GIVES YOU:
            </p>
            <li className="text-white text-base font-semibold">🗃️ +5 Chests on Avalanche</li>
            <li className="text-white text-base font-semibold">🏆 Double leaderboard rewards</li>
            <li className="text-white text-base font-semibold">
              🌟1 year Gunnies Gang membership{' '}
              <span className="ml-4 md:ml-0 block md:inline">(120$ worth)</span>
            </li>
          </div>
        </div>
      </div>

      <div className="flex items-stretch justify-stretch">
        {avaxPremiumUserChests ? (
          <CardEquipped />
        ) : (
          <div className="flex flex-row md:flex-col items-center justify-between border border-white rounded-lg p-8 gap-4 flex-1">
            <p className="text-[#E84142] text-2xl md:text-3xl font-chakra font-bold">AVALANCHE</p>

            <p className="text-base text-white font-chakra uppercase font-bold">
              Price: {priceAvax ? formatUnits(BigInt(priceAvax), 18) : '0'} AVAX
            </p>

            <button
              onClick={handleMint}
              disabled={isLoadingAvax}
              className="block bg-[#E84142] hover:bg-[#c73536] rounded-lg px-4 py-2 w-full transition-colors"
            >
              <p className="text-base md:text-xl text-white font-bold font-chakra uppercase">
                {isLoadingAvax ? 'Minting...' : 'Buy Kaboom Pass'}
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MintSection;

const CardEquipped = () => {
  return (
    <div className="flex flex-col items-center justify-between border border-white rounded-lg p-8 gap-4 flex-1 relative bg-[url('/images/quests/equipped-background.png')] bg-cover bg-[center_bottom] md:bg-center bg-no-repeat">
      <Image
        src="/images/quests/check-mark.png"
        width={64}
        height={64}
        alt="checked mark"
        className="hidden md:block absolute -top-6 -right-6"
      />
      <p className="text-[#E84142] text-2xl md:text-3xl font-chakra font-bold mt-12">AVALANCHE</p>

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

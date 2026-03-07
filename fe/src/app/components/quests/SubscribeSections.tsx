import React, { useState } from 'react';
import Image from 'next/image';
import { useAccount, useSwitchChain } from 'wagmi';
import useMintAvalanche from '@/hooks/useMintAvalanche';
import useMintAvalanche from '@/hooks/useMintAvalanche';
import { toast } from 'react-toastify';
import { avalancheFuji } from 'viem/chains';
import ChainSelectModal from '../common/ChainSelectModal';
import { UserRejectedRequestError } from 'viem';
import ModalDownload from '../common/ModalDownload';
import { useGlobalContext } from '@/app/providers/GlobalProvider';

function SubscribeSections() {
  const [isChainModalOpen, setIsChainModalOpen] = useState(false);
  const { isConnected } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { showWalletDetectionModal } = useGlobalContext();
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const { mint: mintAvalanche, isLoading: isLoadingAvalanche } = useMintAvalanche();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleChainSelect = async (chainId: number) => {
    try {
      const result = await switchChainAsync({ chainId });
      setIsChainModalOpen(false);

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

  const handleMint = async () => {
    try {
      if (!isConnected) {
        showWalletDetectionModal(() => {
          setIsChainModalOpen(true);
        });
        return;
      }

      setIsChainModalOpen(true);
    } catch (error: any) {
      if (error.message.includes('User denied transaction signature')) {
        toast.warn('Transaction cancelled');
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient funds');
      } else {
        toast.error('Failed to mint NFT');
      }
    }
  };
  return (
    <>
      <ModalDownload isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
      <ChainSelectModal
        isOpen={isChainModalOpen}
        onClose={() => setIsChainModalOpen(false)}
        onSelectChain={handleChainSelect}
      />

      <div className="border-[.5px] border-white rounded-[10px] px-4 md:px-8 py-4 md:py-[60px] w-fit mx-auto bg-[url('/images/quests/bg-subscriber.png')] bg-cover bg-center mb-8 md:mb-16">
        <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-6 justify-center">
          <Image
            className="w-[160px] md:w-[281px] opacity-80"
            src="/assets/gunnies-nft.png"
            alt="lock card"
            width={281}
            height={323}
          />
        </div>

        <button
          className="text-center block py-4 md:py-6 px-8 md:px-16 shadow-[-4px_-6px_#FFA100] mt-8 bg-[#800000] rounded-lg text-white text-2xl md:text-6xl font-normal font-batgrexo [text-shadow:1px_4px_0px_black,-3px_4px_0px_black,3px_4px_0px_black,4px_3px_0px_black,4px_-1px_0px_black,4px_-3px_0px_black,0px_-3px_0px_black,-3px_-1px_0px_black,-3px_-3px_0px_black,-5px_1px_0px_#FFA100,-5px_6px_0px_#FFA100,0px_6px_0px_#FFA100,3px_6px_0px_#FFA100,-4px_-5px_0px_#FFA100,5px_-5px_0px_#FFA100,6px_3px_0px_#FFA100;]"
          onClick={() => {
            setIsDownloadModalOpen(true);
          }}
        >
          PLAY THE GAME TO EARN MORE
        </button>

        <button
          onClick={handleMint}
          disabled={isLoadingAvalanche || isLoadingAvalanche}
          className="block py-4 md:py-6 px-8 md:px-16 shadow-[-4px_-6px_#FFA100] mt-8 md:mt-16 w-fit mx-auto  bg-[#800000] rounded-lg text-white text-2xl md:text-6xl font-normal font-batgrexo [text-shadow:1px_4px_0px_black,-3px_4px_0px_black,3px_4px_0px_black,4px_3px_0px_black,4px_-1px_0px_black,4px_-3px_0px_black,0px_-3px_0px_black,-3px_-1px_0px_black,-3px_-3px_0px_black,-5px_1px_0px_#FFA100,-5px_6px_0px_#FFA100,0px_6px_0px_#FFA100,3px_6px_0px_#FFA100,-4px_-5px_0px_#FFA100,5px_-5px_0px_#FFA100,6px_3px_0px_#FFA100;]"
        >
          {isLoadingAvalanche || isLoadingAvalanche ? 'Minting...' : 'BUY AN NFT'}
        </button>
      </div>
    </>
  );
}

export default SubscribeSections;

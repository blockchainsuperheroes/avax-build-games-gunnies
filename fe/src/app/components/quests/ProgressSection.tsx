import Image from 'next/image';
import React, { useState } from 'react';
import ProgressBar from '../common/Progress';
import ModalOverlay from '../common/ModalOverlay';
import { useAccount } from 'wagmi';
import { useGlobalContext } from '@/app/providers/GlobalProvider';

function ProgressSection({
  image,
  width = 100,
  height = 100,
  imageClassName,
  percent = 0,
  content,
}: {
  image: string;
  width: number;
  height: number;
  imageClassName?: string;
  percent?: number;
  content?: React.ReactNode;
}) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { showWalletDetectionModal, isAuthenticated } = useGlobalContext();

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-8 md:px-12 md:h-[187px] max-w-[1569px] bg-[url('/images/quests/bg-progress.png')] bg-auto bg-center relative w-full">
      <div className="flex flex-col items-start justify-center gap-3">
        <Image
          className={imageClassName}
          src={image}
          alt="Banner logo"
          width={width}
          height={height}
        />
        <p className="hidden md:block text-white text-xl font-semibold font-chakra mb-2">
          Resets daily at 00:00 UTC
        </p>
      </div>

      {!isAuthenticated ? (
        <button
          onClick={() => showWalletDetectionModal()}
          className="bg-gradient-to-r bg-[#FF8F00] text-white text-sm md:text-xl font-chakra font-bold uppercase px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          Connect Wallet to Open Loot Box
        </button>
      ) : (
        <div className="grow md:grow-0 w-full md:w-auto">
          <p className="text-white text-xl md:text-[33px] font-normal font-lexend-giga uppercase text-center md:text-left mb-2">
            Daily Completion
          </p>

          <div className="flex items-center gap-4 mt-2">
            <ProgressBar containerClassName="md:w-[351px]" value={percent} />
            <p className="text-white text-xl md:text-[33px] font-normal font-lexend-giga uppercase">
              {percent}%
            </p>
          </div>
        </div>
      )}

      <p className="block md:hidden text-white text-base font-semibold font-chakra">
        Resets daily at 00:00 UTC
      </p>

      {content && (
        <>
          <button className="absolute top-2 right-2" onClick={() => setIsInfoModalOpen(true)}>
            <Image
              src="/assets/icons/info-circle.svg"
              alt="Information circle"
              width={24}
              height={24}
            />
          </button>

          <ModalOverlay
            isOpen={isInfoModalOpen}
            onClose={() => setIsInfoModalOpen(false)}
            isShowCloseButton
          >
            {content}
          </ModalOverlay>
        </>
      )}
    </div>
  );
}

export default ProgressSection;

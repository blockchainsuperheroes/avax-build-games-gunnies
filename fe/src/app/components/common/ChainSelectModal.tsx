import Modal from './Modal';
import { avalancheFuji, avalanche } from 'viem/chains';
import Image from 'next/image';
import useGetMintPriceAvalanche from '@/hooks/useGetMintPriceAvalanche';
import useGetMintPriceAvalanche from '@/hooks/useGetMintPriceAvalanche';
import { formatUnits } from 'viem';

interface ChainSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChain: (chainId: number) => void;
}

export default function ChainSelectModal({
  isOpen,
  onClose,
  onSelectChain,
}: ChainSelectModalProps) {
  const { price: priceAvalanche } = useGetMintPriceAvalanche();
  const { price: priceAvalanche } = useGetMintPriceAvalanche();
  return (
    <Modal isOpen={isOpen} onClose={onClose} isShowCloseButton>
      <div className="flex flex-col items-center justify-center gap-6 p-6">
        <h2 className="text-4xl font-bold font-batgrexo text-white">Select Network</h2>

        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => onSelectChain(avalancheFuji.id)}
            className="flex items-center justify-between p-4 bg-[#1CBBBC] rounded-lg hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <Image src="/images/quests/core-logo.png" alt="Avalanche DAO" width={120} height={32} />
              <span className="text-white font-chakra text-lg">Avalanche DAO</span>
            </div>
            <p className="font-chakra text-lg text-white font-bold">
              {priceAvalanche ? formatUnits(BigInt(priceAvalanche), 18) : '0'} AVAX
            </p>
          </button>

          <button
            onClick={() => onSelectChain(avalanche.id)}
            className="flex items-center justify-between p-4 bg-[#1CBBBC] rounded-lg hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <Image src="/images/quests/avax-logo.png" alt="Avalanche" width={120} height={32} />
              <span className="text-white font-chakra text-lg">Avalanche Nebula</span>
            </div>

            <p className="font-chakra text-lg text-white font-bold">
              {priceAvalanche ? formatUnits(BigInt(priceAvalanche), 18) : '0'} SKL
            </p>
          </button>
        </div>
      </div>
    </Modal>
  );
}

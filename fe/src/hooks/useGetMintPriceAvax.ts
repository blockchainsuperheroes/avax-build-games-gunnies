import { useReadContract } from 'wagmi';
import { kaboomDistributorAbi } from '@/abi/kaboomDistributor';
import { ADDRESSES } from '@/app/constants/address';
import { avalanche } from 'viem/chains';

export default function useGetMintPriceAvax() {
  const { data: nativePriceNFT } = useReadContract({
    address: ADDRESSES.KABOOM_DISTRIBUTOR.AVAX as `0x${string}`,
    abi: kaboomDistributorAbi,
    chainId: avalanche.id,
    functionName: 'nativePriceNFT',
  });

  return {
    price: nativePriceNFT ? nativePriceNFT.toString() : undefined,
  };
}

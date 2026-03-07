import { useReadContract } from 'wagmi';
import { kaboomDistributorAbi } from '@/abi/kaboomDistributor';
import { ADDRESSES } from '@/app/constants/address';
import { avalancheFuji } from 'viem/chains';

export default function useGetMintPriceAvalanche() {
  const { data: nativePriceNFT } = useReadContract({
    address: ADDRESSES.KABOOM_DISTRIBUTOR.AVAX as `0x${string}`,
    abi: kaboomDistributorAbi,
    chainId: avalancheFuji.id,
    functionName: 'nativePriceNFT',
  });

  return {
    price: nativePriceNFT ? nativePriceNFT.toString() : undefined,
  };
}

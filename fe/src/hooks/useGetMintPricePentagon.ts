import { useReadContract } from 'wagmi';
import { avalancheDistributorAbi } from '@/abi/avalancheDistributor';
import { ADDRESSES } from '@/app/constants/address';
import { AvalancheMainnet } from '@/app/constants/chains';

export default function useGetMintPriceAvalanche() {
  const { data: nativePriceNFT } = useReadContract({
    address: ADDRESSES.KABOOM_DISTRIBUTOR.AVAX as `0x${string}`,
    abi: avalancheDistributorAbi,
    chainId: AvalancheMainnet.id,
    functionName: 'nativePriceNFT',
  });

  return {
    price: nativePriceNFT ? nativePriceNFT.toString() : undefined,
  };
}

import { useCallback, useState, useMemo, useEffect } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { kaboomDistributorAbi } from '@/abi/kaboomDistributor';
import { ADDRESSES } from '@/app/constants/address';
import { avalancheFuji } from 'viem/chains';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import useGetMintPriceAvalanche from './useGetMintPriceAvalanche';

export default function useMintAvalanche() {
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const queryClient = useQueryClient();

  const { writeContractAsync, isPending: isPendingWriteContract } = useWriteContract();

  const { price: nativePriceNFT } = useGetMintPriceAvalanche();

  const {
    data: receipt,
    isError,
    isSuccess,
    isLoading: isLoadingReceipt,
  } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
    chainId: avalancheFuji.id,
    query: {
      enabled: !!txHash,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success('🎉 Mint successful!');
      queryClient.invalidateQueries({ queryKey: ['rewardsData'] });
    } else if (isError) {
      toast.error('❌ Transaction failed');
    }
    setTxHash(null);
  }, [isSuccess, isError]);

  const isLoading = useMemo(
    () => isPendingWriteContract || isLoadingReceipt,
    [isPendingWriteContract, isLoadingReceipt]
  );

  const mint = useCallback(
    async (chainId: number) => {
      try {
        if (!nativePriceNFT) throw new Error('Mint price unavailable');

        setTxHash(null);

        const hash = await writeContractAsync({
          address: ADDRESSES.KABOOM_DISTRIBUTOR.AVAX as `0x${string}`,
          abi: kaboomDistributorAbi,
          chainId,
          functionName: 'mint',
          value: BigInt(nativePriceNFT.toString()),
        });

        toast.info('⏳ Waiting for confirmation...');
        setTxHash(hash);
      } catch (err: any) {
        console.error('Mint failed:', err);
        throw err;
      }
    },
    [writeContractAsync, nativePriceNFT]
  );

  return {
    mint,
    isLoading,
    isConfirmed: isSuccess,
    isFailed: isError,
    txHash,
    receipt,
    price: nativePriceNFT ? parseEther(nativePriceNFT.toString()) : undefined,
  };
}

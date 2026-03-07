import { useCallback, useState, useMemo, useEffect } from 'react';
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { kaboomDistributorAbi } from '@/abi/kaboomDistributor';
import { ADDRESSES } from '@/app/constants/address';
import { avalanche } from 'viem/chains';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import useGetMintPriceAvalanche from './useGetMintPriceAvalanche';
import { approvalAbi } from '@/abi/approval';
import { useAccount } from 'wagmi';

export default function useMintAvalanche() {
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const queryClient = useQueryClient();
  const { writeContractAsync, isPending: isPendingWriteContract } = useWriteContract();

  const { price: nativePriceNFT } = useGetMintPriceAvalanche();
  const { address: userAddress } = useAccount();

  const { data: sklBalanceRaw } = useReadContract({
    address: ADDRESSES.KABOOM_APPROVAL.AVAX as `0x${string}`,
    abi: approvalAbi,
    functionName: 'balanceOf',
    args: [userAddress],
    chainId: avalanche.id,
  });

  const {
    data: receipt,
    isError,
    isSuccess,
    isLoading: isLoadingReceipt,
  } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
    chainId: avalanche.id,
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

  const mint = useCallback(async (chainId: number) => {
    try {
      if (!nativePriceNFT) throw new Error('Mint price unavailable');

      if (sklBalanceRaw && BigInt(sklBalanceRaw.toString()) < BigInt(nativePriceNFT.toString())) {
        throw new Error('Insufficient balance');
      }

      setTxHash(null);

      const approve = await writeContractAsync({
        address: ADDRESSES.KABOOM_APPROVAL.AVAX as `0x${string}`,
        abi: approvalAbi,
        chainId,
        functionName: 'approve',
        args: [ADDRESSES.KABOOM_DISTRIBUTOR.AVAX, nativePriceNFT],
      });

      if (!approve) throw new Error('Approve failed');

      const hash = await writeContractAsync({
        address: ADDRESSES.KABOOM_DISTRIBUTOR.AVAX as `0x${string}`,
        abi: kaboomDistributorAbi,
        chainId,
        functionName: 'erc20Mint',
        args: [nativePriceNFT],
      });

      toast.info('⏳ Waiting for confirmation...');
      setTxHash(hash);
    } catch (err: any) {
      console.error('Mint failed:', err);
      throw err;
    }
  }, [writeContractAsync, nativePriceNFT, sklBalanceRaw]);

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

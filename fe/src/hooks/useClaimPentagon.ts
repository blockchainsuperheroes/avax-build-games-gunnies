'use client';

import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { khaoRewardsAbi } from '@/abi';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useSession } from 'next-auth/react';
import { ADDRESSES } from '@/app/constants/address';
import { AvalancheMainnet } from '@/app/constants/chains';

/**
 * Claim Avalanche Hook
 */
export default function useClaimAvalanche({
  chestType,
  onClaimSuccess,
}: {
  key: string;
  chestType: string;
  onClaimSuccess: (data: any) => void;
}) {
  const { status: sessionStatus, data: session }: any = useSession();
  const sessionWithToken = session as { user?: { gunnies_access_token: string } };
  const { isConnected, address } = useAccount();
  const queryClient = useQueryClient();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { isPending, writeContractAsync } = useWriteContract({
    mutation: {
      onError: error => {
        if (error.message.includes('User denied transaction signature')) {
          toast.warn('Transaction cancelled');
        } else if (error.message.includes('does not match the target chain for the transaction')) {
          toast.warn('Please switch to Avalanche Network');
        } else if (error.message.includes('insufficient funds for intrinsic transaction cost')) {
          toast.error('Insufficient funds for gas');
        } else {
          toast.error(error.message);
        }
      },
      onSettled: () => setTxHash(null),
    },
  });

  const {
    data: receipt,
    isSuccess: txConfirmed,
    isLoading: isLoadingReceipt,
  } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
    chainId: AvalancheMainnet.id,
    query: {
      enabled: !!txHash,
    },
  });

  const handleClaimReward = async () => {
    if (!isConnected || !address) return;

    try {
      const hash = await writeContractAsync({
        address: ADDRESSES.KHAO_REWARDS.AVAX as `0x${string}`,
        abi: khaoRewardsAbi,
        chainId: AvalancheMainnet.id,
        functionName: 'claimReward',
        args: [BigInt(Date.now())],
      });
      setTxHash(hash);
    } catch (error) {
      console.error('Error in handleClaimReward:', error);
    }
  };

  const {
    mutate: openChest,
    isPending: isChestLoading,
    error: chestError,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_GUNNIES_API}/chest/open/${chestType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionWithToken?.user?.gunnies_access_token}`,
        },
      });

      const result = await res.json();
      if (!res.ok || !result.status) {
        throw new Error(result.message || 'Failed to open chest');
      }

      return result;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['rewardsData'] });
      queryClient.invalidateQueries({ queryKey: ['userBalance'] });
      onClaimSuccess(data);
    },
    onError: err => toast.error(err.message),
  });

  useEffect(() => {
    if (sessionStatus === 'authenticated' && isConnected && txHash && txConfirmed) {
      openChest();
    }
  }, [sessionStatus, isConnected, txHash, txConfirmed]);

  return {
    handleClaimReward,
    isChestLoading,
    isPending: isPending || isLoadingReceipt,
    isSuccess: txConfirmed,
    isError: !!chestError,
    receipt,
  };
}


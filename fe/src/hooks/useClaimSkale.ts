'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { khaoRewardsAbi } from '@/abi';
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { avalanche } from 'viem/chains';
import { getBalance } from '@wagmi/core';
import { config } from '@/app/providers/Web3Provider';
import { parseUnits } from 'viem';
import { useSession } from 'next-auth/react';
import { ADDRESSES } from '@/app/constants/address';

const GAS_THRESHOLD = '0.0000000044542';

export default function useClaimAvalanche({
  key,
  chestType,
  onClaimSuccess,
}: {
  key: string;
  chestType: string;
  onClaimSuccess: (data: any) => void;
}) {
  const { data: session, status: sessionStatus } = useSession();
  const sessionWithToken = session as { user?: { gunnies_access_token: string } };
  const { isConnected, address } = useAccount();
  const queryClient = useQueryClient();
  const [isLowGas, setIsLowGas] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  const { writeContractAsync, isPending } = useWriteContract({
    mutation: {
      onSuccess: () => {
        setIsLowGas(false);
      },
      onError: error => {
        if (error.message.includes('User denied transaction')) {
          toast.warn('Transaction cancelled');
        } else if (error.message.includes('target chain')) {
          toast.warn('Switch to Avalanche Nebula Network');
        } else if (error.message.includes('insufficient funds')) {
          toast.error('Insufficient gas');
        } else {
          toast.error(error.message);
        }
      },
      onSettled: () => setTxHash(null),
    },
  });

  const handleClaimReward = async () => {
    if (!isConnected || !address) return;

    try {
      const balance = await getBalance(config as any, { address });
      const hasEnoughGas = balance.value >= parseUnits(GAS_THRESHOLD, 18);

      if (!hasEnoughGas) {
        if (!isLowGas) {
          setIsLowGas(true);
          toast.info('Refilling gas... Please wait.');
        }
        return;
      }

      const hash = await writeContractAsync({
        address: ADDRESSES.KHAO_REWARDS.AVAX as `0x${string}`,
        abi: khaoRewardsAbi,
        chainId: avalanche.id,
        functionName: 'claimReward',
        args: [BigInt(Date.now())],
      });
      setTxHash(hash);
    } catch (error) {
      console.error('Error in handleClaimReward:', error);
    }
  };

  const {
    data: receipt,
    isSuccess: txConfirmed,
    isLoading: isLoadingReceipt,
  } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    chainId: avalanche.id,
    query: { enabled: !!txHash },
  });

  const {
    isLoading: isRecharging,
    error: rechargeError,
    isSuccess: rechargeSuccess,
  } = useQuery({
    queryKey: ['rechargeGas', key],
    enabled: isConnected && isLowGas,
    queryFn: async () => {
      const res = await fetch('/api/rechargeGas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      return res.json();
    },
  });

  useEffect(() => {
    if (rechargeError) toast.error(rechargeError.message);
    if (rechargeSuccess) toast.success('Gas refilled successfully');
  }, [rechargeError, rechargeSuccess]);

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
      setIsLowGas(false);
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
    isLoading: isRecharging,
    isPending: isPending || isLoadingReceipt,
    isSuccess: txConfirmed,
    isError: !!chestError,
    receipt,
  };
}

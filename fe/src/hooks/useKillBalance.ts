'use client';

import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http } from 'viem';
import { avalanche } from 'viem/chains';
import { ADDRESSES } from '@/app/constants/address';

// GunniesKiller contract emits TotalKill events with kill counts
// Since the contract is event-based (no view function for kill count),
// we read kill count from the backend API or parse events.
// For now, we use the backend API endpoint.

const gunniesKillerAbi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'from', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'totalKill', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'lastUpdate', type: 'uint256' },
    ],
    name: 'TotalKill',
    type: 'event',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'whitelisted',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const publicClient = createPublicClient({
  chain: avalanche,
  transport: http('https://api.avax.network/ext/bc/C/rpc'),
});

export default function useKillBalance() {
  const { address, isConnected } = useAccount();

  const { data: killCount, isLoading, error, refetch } = useQuery({
    queryKey: ['killBalance', address],
    enabled: isConnected && !!address,
    queryFn: async () => {
      if (!address) return 0;

      try {
        // Try to get kill count from TotalKill events for the user
        const logs = await publicClient.getLogs({
          address: ADDRESSES.GUNNIES_KILLER.AVAX as `0x${string}`,
          event: {
            type: 'event',
            name: 'TotalKill',
            inputs: [
              { indexed: false, name: 'from', type: 'address' },
              { indexed: false, name: 'totalKill', type: 'uint256' },
              { indexed: false, name: 'lastUpdate', type: 'uint256' },
            ],
          },
          fromBlock: 'earliest',
          toBlock: 'latest',
        });

        // Filter logs for the connected user and get the latest total kill
        const userLogs = logs.filter(
          (log: any) => log.args?.from?.toLowerCase() === address.toLowerCase()
        );

        if (userLogs.length === 0) return 0;

        // Get the most recent TotalKill event
        const latestLog = userLogs[userLogs.length - 1] as any;
        return Number(latestLog.args?.totalKill || 0);
      } catch (err) {
        console.error('Error fetching kill balance:', err);
        return 0;
      }
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return {
    killCount: killCount || 0,
    isLoading,
    error,
    refetch,
    isConnected,
  };
}

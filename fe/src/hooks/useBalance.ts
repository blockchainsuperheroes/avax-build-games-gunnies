'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface BalanceResponse {
  status: boolean;
  message?: string;
  result?: any; // Update this with the actual response structure when known
}

/**
 * Hook to fetch user balance/rewards from the Gunnies API
 * @returns Balance data, loading state, error, and refetch function
 */
export const useBalance = () => {
  const { data: session, status: sessionStatus }: any = useSession();

  const { data, isLoading, error, refetch, isError } = useQuery<BalanceResponse>({
    queryKey: ['userBalance'],
    queryFn: async (): Promise<BalanceResponse> => {
      if (!session?.user?.gunnies_access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_GUNNIES_API}/user/rewards/v2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.gunnies_access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BalanceResponse = await response.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to fetch balance');
      }

      return data;
    },
    enabled: sessionStatus === 'authenticated' && !!session?.user?.gunnies_access_token,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  return {
    balance: data?.result,
    data,
    isLoading,
    error: error?.message || null,
    isError,
    refetch,
    isAuthenticated: sessionStatus === 'authenticated',
  };
};

export default useBalance;

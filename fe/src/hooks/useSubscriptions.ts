'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface SubscriptionData {
  object: string;
  data: any[];
  has_more: boolean;
  url: string;
}

interface SubscriptionsResponse {
  status: boolean;
  message?: string;
  result?: SubscriptionData;
}

/**
 * Hook to fetch user subscriptions from the Gunnies API
 * @returns Subscriptions data, loading state, error, and refetch function
 */
export const useSubscriptions = () => {
  const { data: session, status: sessionStatus }: any = useSession();

  const { data, isLoading, error, refetch, isError } = useQuery<SubscriptionsResponse>({
    queryKey: ['userSubscriptions'],
    queryFn: async (): Promise<SubscriptionsResponse> => {
      if (!session?.user?.gunnies_access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_GUNNIES_API}/payment/subscriptions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.gunnies_access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SubscriptionsResponse = await response.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to fetch subscriptions');
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

  const hasSubscription = (data?.result?.data?.length ?? 0) > 0;

  // Extract expiration date from the first subscription's current_period_end
  const getExpirationDate = (): string | null => {
    if (!hasSubscription || !data?.result?.data?.[0]?.items?.data?.[0]?.current_period_end) {
      return null;
    }

    const currentPeriodEnd = data.result.data[0].items.data[0].current_period_end;
    const expirationDate = new Date(currentPeriodEnd * 1000); // Convert Unix timestamp to Date

    // Format as MM/DD/YYYY
    const month = String(expirationDate.getMonth() + 1).padStart(2, '0');
    const day = String(expirationDate.getDate()).padStart(2, '0');
    const year = expirationDate.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const expirationDate = getExpirationDate();

  return {
    subscriptions: data?.result?.data || [],
    hasSubscription,
    expirationDate,
    data,
    isLoading,
    error: error?.message || null,
    isError,
    refetch,
    isAuthenticated: sessionStatus === 'authenticated',
  };
};

export default useSubscriptions;

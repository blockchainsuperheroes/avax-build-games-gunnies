import { useQuery } from '@tanstack/react-query';
import useStore from '@/app/stores/userStore';
import { useSession } from 'next-auth/react';

export const useSyncRewards = () => {
  const { data: session, status: sessionStatus }: any = useSession();
  const fetchRewards = useStore((state: any) => state.fetchRewards);

  return useQuery({
    queryKey: ['rewardsData'],
    enabled: sessionStatus === 'authenticated',
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GUNNIES_API}/chest/eligibility`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.user?.gunnies_access_token}`,
        },
      });
      const result = await response.json();
      fetchRewards(result); // Update the store with fetched data
      return true;
    },
  });
};

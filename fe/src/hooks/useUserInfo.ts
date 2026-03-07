'use client';

import { useGlobalContext } from '@/app/providers/GlobalProvider';

/**
 * Custom hook to access user info from the global context
 * This provides a convenient way to access user data anywhere in the application
 */
export const useUserInfo = () => {
  const { userInfo, isLoadingUserInfo, userInfoError, refetchUserInfo, isAuthenticated } =
    useGlobalContext();

  return {
    userInfo,
    isLoading: isLoadingUserInfo,
    error: userInfoError,
    refetch: refetchUserInfo,
    isAuthenticated,
    // Computed properties for convenience
    isLoggedIn: isAuthenticated && !!userInfo,
    userId: userInfo?.id,
    userEmail: userInfo?.email,
    username: userInfo?.username,
    walletAddress: userInfo?.mm_address,
  };
};

export default useUserInfo;

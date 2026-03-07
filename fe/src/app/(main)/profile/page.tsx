'use client';

import React, { useState, useEffect } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useSyncRewards } from '@/app/components/quests/syncRewards';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/app/constants/routes';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount, useDisconnect } from 'wagmi';
import { ProfileHeader } from '@/app/components/profile/ProfileHeader';
import { KaboomPassSection } from '@/app/components/profile/KaboomPassSection';
import { MembershipSection } from '@/app/components/profile/MembershipSection';
import { RewardsSection } from '@/app/components/profile/RewardsSection';
import { CharacterCardsSection } from '@/app/components/profile/CharacterCardsSection';
import KaboomPassModal from '@/app/components/quests/KaboomPassModal';
import KnowYourRewardsModal from '@/app/components/quests/KnowYourRewardsModal';
import { useGlobalContext } from '@/app/providers/GlobalProvider';
import LoadingScreen from '@/app/components/common/LoadingScreen';

export default function ProfilePage() {
  useSyncRewards();
  const { username, userInfo, isAuthenticated } = useUserInfo();
  const { status: sessionStatus } = useSession();
  const { showLoginModal } = useGlobalContext();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [showKaboomModal, setShowKaboomModal] = useState(false);
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      router.push(ROUTES.ABOUT);
    } else if (sessionStatus === 'authenticated' && !isAuthenticated) {
      // Session exists but no gunnies_access_token, show login modal
      showLoginModal();
    }
  }, [sessionStatus, isAuthenticated, router, showLoginModal]);

  const handleLogout = async () => {
    try {
      // Clear all cached queries
      queryClient.clear();

      // Disconnect wallet if connected
      if (isConnected) {
        disconnect();
      }

      // Sign out from NextAuth
      await signOut({ redirect: false });

      // Force redirect to home page
      router.push(ROUTES.ABOUT);

      // Force page reload to ensure clean state
      window.location.href = ROUTES.ABOUT;
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force page reload
      window.location.href = ROUTES.ABOUT;
    }
  };

  // Show loading screen while checking authentication
  if (sessionStatus === 'loading' || (sessionStatus === 'authenticated' && !isAuthenticated)) {
    return <LoadingScreen />;
  }

  // Don't render content if not authenticated
  if (sessionStatus === 'unauthenticated' || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-[860px] mx-auto">
        <ProfileHeader username={username} userInfo={userInfo} />

        <KaboomPassSection />

        <MembershipSection onViewBenefits={() => setShowRewardsModal(true)} />

        <RewardsSection />

        {/* <CharacterCardsSection /> */}

        {/* Log Out Button */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-[#1CBBBC] hover:bg-[#1CBBBC]/80 transition-colors px-12 py-4 rounded-lg w-full max-w-[400px]"
          >
            <p className="text-white text-lg font-bold font-chakra uppercase text-center">
              LOG OUT
            </p>
          </button>
        </div>
      </div>

      {/* Modals */}
      <KaboomPassModal isOpen={showKaboomModal} onClose={() => setShowKaboomModal(false)} />
      <KnowYourRewardsModal isOpen={showRewardsModal} onClose={() => setShowRewardsModal(false)} />
    </div>
  );
}

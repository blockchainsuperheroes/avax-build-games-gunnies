'use client';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { useGlobalContext } from '@/app/providers/GlobalProvider';
import useClaimAvalanche from '@/hooks/useClaimAvalanche';
import { AvalancheMainnet } from '@/app/constants/chains';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import ModalRequiredLogin from '../common/ModalRequiredLogin';
import { LoadingSpinner } from '../common';
import useStore from '@/app/stores/userStore';
import { CHEST_TYPES, USER_TYPES, ChestUserType } from '@/app/constants/questsConfig';
import { LoginSignUpModal } from '../login/LoginSignUpModal';
import { TypeLoginSignUp } from '@/app/providers/GlobalProvider';

function QuestsCardAvalancheToClaim({
  questKey,
  userType,
  onClaimSuccess,
}: {
  questKey: string;
  userType: ChestUserType;
  onClaimSuccess: (data: any) => void;
}) {
  const { status: sessionStatus }: any = useSession();
  const { switchChainAsync } = useSwitchChain();
  const { handleClaimReward, isChestLoading, isPending, isSuccess } = useClaimAvalanche({
    key: questKey,
    chestType:
      userType === USER_TYPES.PREMIUM_USER
        ? CHEST_TYPES.AVAX_PREMIUM
        : CHEST_TYPES.AVAX_NORMAL,
    onClaimSuccess,
  });

  const chainId = useChainId();
  const { isConnected, address } = useAccount();
  const { showWalletDetectionModal } = useGlobalContext();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isRequiredLoginModalOpen, setIsRequiredLoginModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isAnyCardPending, setIsAnyCardPending } = useStore();
  const [typeLoginSignUp, setTypeLoginSignUp] = useState<TypeLoginSignUp>(TypeLoginSignUp.LOGIN);

  useEffect(() => {
    if (isChestLoading || isPending || isClaiming) {
      setIsAnyCardPending(true);
    } else {
      setIsAnyCardPending(false);
    }
  }, [isChestLoading, isPending, isClaiming, setIsAnyCardPending]);

  const claimRewards = async () => {
    try {
      if (isConnected || address) {
        if (isAnyCardPending) {
          toast.warn('Please wait for the current claim to complete');
          return;
        }
        setIsClaiming(true);
        if (chainId !== AvalancheMainnet.id) {
          await switchChainAsync({ chainId: AvalancheMainnet.id });
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        await handleClaimReward();
      } else {
        showWalletDetectionModal(() => {
          console.log('Wallet connected, ready to claim Avalanche rewards');
        });
      }
    } catch (error) {
      console.error('Error in claimRewards:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  useEffect(() => {
    if (sessionStatus === 'unauthenticated' && isSuccess) {
      setIsRequiredLoginModalOpen(true);
    }
  }, [sessionStatus, isSuccess]);

  const isThisCardPending = isChestLoading || isPending || isClaiming;
  const isDisabled = isThisCardPending || (!isThisCardPending && isAnyCardPending);

  return (
    <>
      <ModalRequiredLogin
        isOpen={isRequiredLoginModalOpen}
        onClose={() => setIsRequiredLoginModalOpen(false)}
        onSignUp={() => {
          setIsLoginModalOpen(true);
          setIsRequiredLoginModalOpen(false);
          setTypeLoginSignUp(TypeLoginSignUp.SIGN_UP);
        }}
      />
      <LoginSignUpModal
        isOpen={isLoginModalOpen}
        handleClose={() => {
          setIsLoginModalOpen(false);
          setTypeLoginSignUp(TypeLoginSignUp.LOGIN_SIGIN_UP);
        }}
        setTypeLoginSignUp={setTypeLoginSignUp}
        typeLoginSignUp={typeLoginSignUp}
      />

      <button className={`relative cursor-pointer`} onClick={claimRewards} disabled={isDisabled}>
        <Image
          className="w-[160px] h-[183px] md:w-[281px] md:h-[323px]"
          src="/images/quests/claim-chest.png"
          alt="Quests card"
          width={281}
          height={323}
        />

        {isThisCardPending ? (
          <div className="absolute bottom-1 md:bottom-4 left-1/2 transform -translate-x-1/2 translate-y-0">
            <LoadingSpinner />
          </div>
        ) : (
          <p className="absolute bottom-1 md:bottom-4 left-1/2 transform -translate-x-1/2 translate-y-0 text-white text-base md:text-[26px] font-bold font-chakra">
            {isConnected ? 'Claim' : 'Connect'}
          </p>
        )}
      </button>
    </>
  );
}

export default QuestsCardAvalancheToClaim;

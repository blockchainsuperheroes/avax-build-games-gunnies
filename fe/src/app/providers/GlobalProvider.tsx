'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  ReactElement,
  useCallback,
  useRef,
} from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { UserInfo, UserInfoResponse, GlobalContextType } from '@/app/types/user';
import { ModalGeneral } from '../components/container';
import { LoginSignUpModal } from '../components/login/LoginSignUpModal';
import { WalletDetectionModal } from '../components/modals/WalletDetectionModal';
import { WalletMismatchModal } from '../components/modals/WalletMismatchModal';
import { useAccount } from 'wagmi';
import KaboomPassModal from '../components/quests/KaboomPassModal';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ButtonIcon, View } from '../components/common';

const DynamicReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const frameUrl = new URL(
  process.env.NEXT_PUBLIC_GUNNIES_XR_SPATIAL_URL || 'https://staging.penxr.io/destinations/gunnies'
);

// PenXRView component moved from SectionTop
const PenXRView = ({ onClose }: { onClose: any }) => {
  const { showSignUpModal } = useGlobalContext();
  const ref = useRef<HTMLIFrameElement>(null);
  const parentUrlParams = typeof window !== 'undefined' ? window.location.search : '';
  const { data: session }: any = useSession();

  const sendParentUrlParams = useCallback(() => {
    console.log('sendParentUrlParams postMessage start ', parentUrlParams);
    if (!parentUrlParams) {
      return;
    }

    if (!ref.current?.contentWindow) {
      console.error('Iframe not ready');
      return;
    }
    console.log('sendParentUrlParams postMessage', parentUrlParams);

    ref.current?.contentWindow?.postMessage(
      JSON.stringify({
        type: 'parentUrlParams',
        parentUrlParams: parentUrlParams,
      }),
      frameUrl.origin
    );
  }, [parentUrlParams]);

  const sendToken = useCallback(() => {
    if (!ref.current?.contentWindow) {
      return;
    }

    if (!session) {
      console.log('No session available to send token');
      ref.current?.contentWindow?.postMessage(
        JSON.stringify({ type: 'gunnies_tokens', pg_access_token: '', gunnies_access_token: '' }),
        frameUrl.origin
      );
      return;
    }

    const pg_access_token = session.token;
    const gunnies_access_token = session.user?.gunnies_access_token;
    if (!pg_access_token && !gunnies_access_token) {
      console.log('No access token available to send');
      ref.current?.contentWindow?.postMessage(
        JSON.stringify({ type: 'gunnies_tokens', pg_access_token: '', gunnies_access_token: '' }),
        frameUrl.origin
      );
      return;
    }

    ref.current?.contentWindow?.postMessage(
      JSON.stringify({ type: 'gunnies_tokens', pg_access_token, gunnies_access_token }),
      frameUrl.origin
    );
  }, [session]);

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== frameUrl.origin) return;

      console.log('handleMessage event checked', event);
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        console.log('handleMessage data', data);
        if (data?.type === 'loading_finish') {
          sendParentUrlParams();
          sendToken();
        } else if (data?.type === 'open_sign_up_modal') {
          showSignUpModal();
          onClose();
        }
      } catch (error) {
        // Silent error handling
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [sendParentUrlParams, sendToken, showSignUpModal, onClose]);

  return (
    <View className="bg-transparent relative w-full flex items-center justify-center lg:pt-1">
      <View className="bg-[#111313] relative w-full lg:max-w-[1528px] lg:w-[calc(100vw*0.8)] h-svh md:h-screen lg:max-h-[925px] lg:h-[calc(100vw*0.5)] 2xl:h-[calc(100vh*0.95)] lg:mt-[8px] lg:mx-2">
        <div id="gunnies-iframe" className="w-full h-svh lg:h-full ">
          <iframe
            ref={ref}
            src={frameUrl.href}
            className="w-full h-svh lg:h-full  border-0"
            allow="xr-spatial-tracking; autoplay; fullscreen; microphone; camera; gyroscope; accelerometer; magnetometer; geolocation; clipboard-read; clipboard-write self https://penxr.io https://staging.penxr.io https://playcanv.as"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation"
            title="Gunnies Game"
          />
          <View className="absolute z-10 right-0.5 top-0.5 lg:right-[-8px] lg:top-[-8px] flex flex-col justify-center items-center">
            <ButtonIcon
              onClick={onClose}
              twBgIcon="bg-ic-close-black"
              className="w-[24px] h-[24px] cursor-pointer"
            />
          </View>
        </div>
      </View>
    </View>
  );
};

// BannerModal component moved from SectionTop
const BannerModal = ({
  isOpen,
  onClose,
  onEnterNow,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEnterNow: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <div
        className="relative bg-transparent md:max-w-[800px] w-[85dvw] mx-4 flex flex-col items-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Text on top */}
        <p className="text-base md:text-[32px] font-chakra text-white text-center mb-4 [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)] leading-tight">
          Spooky November Arrives. <br /> Experience the Spatial & Play to Win.
        </p>

        {/* Banner video with close button */}
        <div className="relative flex items-center justify-center w-full">
          <video
            src="/images/halloween/trailer.mp4"
            autoPlay
            loop
            muted
            playsInline
            controls
            className="w-full h-auto"
          />
          {/* Close button on top right of image */}
          <button
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute -top-2 -right-2 md:-top-4 md:-right-4 md:w-8 md:h-8 w-6 h-6 flex items-center justify-center bg-white rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <svg
              className="md:w-5 md:h-5 w-4 h-4 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Button at bottom */}
        <button
          className="text-white cursor-pointer bg-[#E3891A] px-6 py-3 rounded-lg font-chakra text-sm md:text-[20px] mt-4 hover:bg-[#E89735] transition-colors md:w-[400px] w-[80dvw]"
          onClick={e => {
            e.stopPropagation();
            onEnterNow();
          }}
        >
          Experience The Spatial
        </button>
      </div>
    </div>
  );
};

// Create the context
const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

// Hook to use the global context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

// Global provider component
interface GlobalProviderProps {
  children: ReactNode;
}

export type GeneralModalDataType = {
  title: string;
  content: ReactElement;
  theme: string;
  description: string;
};

export enum TypeLoginSignUp {
  LOGIN_SIGIN_UP = 'LOGIN_SIGIN_UP',
  LOGIN = 'LOGIN',
  SIGN_UP = 'SIGN_UP',
  SIGN_UP_IN_SPATIAL = 'SIGN_UP_IN_SPATIAL',
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const { data: session, status: sessionStatus }: any = useSession();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userInfoError, setUserInfoError] = useState<string | null>(null);
  const [isLoginSignUpModalOpen, setIsLoginSignUpModalOpen] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [isShowStoreMessage, setIsShowStoreMessage] = useState(false);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [typeLoginSignUp, setTypeLoginSignUp] = useState<TypeLoginSignUp>(
    TypeLoginSignUp.LOGIN_SIGIN_UP
  );

  const [generalModalOpen, setGeneralModalOpen] = useState<boolean>(false);
  const [generalModalData, setGeneralModalData] = useState<GeneralModalDataType>({
    title: 'Title',
    content: <div>Content</div>,
    theme: '',
    description: 'Description',
  });

  const [isWalletDetectionModalOpen, setIsWalletDetectionModalOpen] = useState(false);
  const [walletDetectionCallback, setWalletDetectionCallback] = useState<(() => void) | null>(null);
  const [isWalletMismatchModalOpen, setIsWalletMismatchModalOpen] = useState(false);
  const [hasShownMismatchModal, setHasShownMismatchModal] = useState(false);

  // KaboomPass Modal state
  const [isKaboomPassModalOpen, setIsKaboomPassModalOpen] = useState(false);
  const [showKaboomPassPromotion, setShowKaboomPassPromotion] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // PenXR Modal state (moved from SectionTop)
  const [isPopupPenXROpen, setIsPopupPenXROpen] = useState(false);

  // Get current connected wallet address
  const { address: connectedAddress, isConnected } = useAccount();

  // Get current route pathname
  const pathname = usePathname();

  // Handle client-side mounting for video player
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Show promotion banner on non-home routes
  useEffect(() => {
    if (pathname && pathname !== '/') {
      // Check if promotion was already shown for this route
      const promotionShownKey = `kaboomPromotionShown_${pathname}`;
      const hasShownForRoute = sessionStorage.getItem(promotionShownKey);

      if (!hasShownForRoute) {
        // Small delay to ensure page is loaded
        const timer = setTimeout(() => {
          setShowKaboomPassPromotion(true);
          sessionStorage.setItem(promotionShownKey, 'true');
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [pathname]);

  // Check if user is authenticated
  const isAuthenticated =
    sessionStatus === 'authenticated' && !!session?.user?.gunnies_access_token;

  // Fetch user info from the Gunnies API
  const {
    data: userInfoData,
    isLoading: isLoadingUserInfo,
    error,
    refetch: refetchUserInfo,
    isError,
  } = useQuery({
    queryKey: ['userInfo'],
    queryFn: async (): Promise<UserInfoResponse> => {
      if (!session?.user?.gunnies_access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_GUNNIES_API}/user/info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.gunnies_access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UserInfoResponse = await response.json();

      if (!data.status) {
        throw new Error(data.message || 'Failed to fetch user info');
      }

      return data;
    },
    enabled: isAuthenticated, // Only run query when user is authenticated
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });

  // Update user info state when data changes
  useEffect(() => {
    if (userInfoData?.result) {
      setUserInfo(userInfoData.result);
      setUserInfoError(null);
    }
  }, [userInfoData]);

  // Handle errors
  useEffect(() => {
    if (isError && error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user info';
      setUserInfoError(errorMessage);
      console.error('User info fetch error:', error);

      // Show toast notification for critical errors only
      if (errorMessage.includes('401') || errorMessage.includes('403')) {
        signOut({ redirect: false });
      }
    }
  }, [isError, error]);

  // Reset user info when session ends
  useEffect(() => {
    if (sessionStatus === 'unauthenticated') {
      setUserInfo(null);
      setUserInfoError(null);
    }
  }, [sessionStatus]);

  // LoginSignUpModal functions
  const showLoginSignUpModal = () => setIsLoginSignUpModalOpen(true);

  const hideLoginSignUpModal = () => {
    setIsLoginSignUpModalOpen(false);
    setPendingCallback(null);
    setTypeLoginSignUp(TypeLoginSignUp.LOGIN_SIGIN_UP);
    setIsShowStoreMessage(false);
  };

  const showSignUpModal = (isInSpatial: boolean = false) => {
    setTypeLoginSignUp(!isInSpatial ? TypeLoginSignUp.SIGN_UP : TypeLoginSignUp.SIGN_UP_IN_SPATIAL);
    setIsLoginSignUpModalOpen(true);
  };

  const showLoginModal = () => {
    setTypeLoginSignUp(TypeLoginSignUp.LOGIN);
    setIsLoginSignUpModalOpen(true);
  };

  const showSignUpModalWithStoreMessage = () => {
    setIsShowStoreMessage(true);
    setIsLoginSignUpModalOpen(true);
  };

  // Banner Modal functions
  const showBannerModal = () => setIsBannerModalOpen(true);
  const hideBannerModal = () => setIsBannerModalOpen(false);
  
  // Handle Enter Now action (moved from SectionTop)
  const handleEnterNow = () => {
    hideBannerModal();
    setIsPopupPenXROpen(true);
  };

  // Wallet Detection Modal functions
  const showWalletDetectionModal = (onConnect?: () => void) => {
    if (onConnect) {
      setWalletDetectionCallback(() => onConnect);
    }
    setIsWalletDetectionModalOpen(true);
  };

  const hideWalletDetectionModal = () => {
    setIsWalletDetectionModalOpen(false);
    setWalletDetectionCallback(null);
  };

  // Wallet Mismatch Modal functions
  const showWalletMismatchModal = () => {
    setIsWalletMismatchModalOpen(true);
  };

  const hideWalletMismatchModal = () => {
    setIsWalletMismatchModalOpen(false);
  };

  const handleWalletSwitch = () => {
    // Reset the flag so modal can show again if needed
    setHasShownMismatchModal(false);
    // Refetch user info to get updated wallet address
    refetchUserInfo();
  };

  // KaboomPass Modal functions
  const showKaboomPassModal = () => {
    setIsKaboomPassModalOpen(true);
    setShowKaboomPassPromotion(false);
  };

  const hideKaboomPassModal = () => {
    setIsKaboomPassModalOpen(false);
    // Show promotion banner after closing modal
    setShowKaboomPassPromotion(true);
  };

  const hideKaboomPassPromotion = () => {
    setShowKaboomPassPromotion(false);
    // Show promotion again after 10 seconds
    setTimeout(() => {
      setShowKaboomPassPromotion(true);
    }, 10000);
  };

  const requireLogin = (callback: () => void) => {
    if (isAuthenticated) {
      // User is already logged in, execute callback immediately
      callback();
    } else {
      // User is not logged in, show login modal and store callback
      setPendingCallback(() => callback);
      setIsLoginSignUpModalOpen(true);
    }
  };

  // Handle successful login - execute pending callback if exists
  useEffect(() => {
    if (isAuthenticated && pendingCallback) {
      pendingCallback();
      setPendingCallback(null);
      setIsLoginSignUpModalOpen(false);
    }
  }, [isAuthenticated, pendingCallback]);

  // Check for wallet address mismatch
  useEffect(() => {
    if (
      isAuthenticated &&
      isConnected &&
      connectedAddress &&
      userInfo?.mm_address &&
      !hasShownMismatchModal
    ) {
      const profileAddress = userInfo.mm_address.toLowerCase();
      const currentAddress = connectedAddress.toLowerCase();

      if (profileAddress !== currentAddress) {
        setHasShownMismatchModal(true);
        showWalletMismatchModal();
      }
    }
  }, [isAuthenticated, isConnected, connectedAddress, userInfo?.mm_address, hasShownMismatchModal]);

  // Reset mismatch modal flag when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setHasShownMismatchModal(false);
      setIsWalletMismatchModalOpen(false);
    }
  }, [isConnected]);

  // Context value
  const contextValue: GlobalContextType = {
    userInfo,
    isLoadingUserInfo,
    userInfoError,
    refetchUserInfo,
    isAuthenticated,
    showLoginSignUpModal,
    hideLoginSignUpModal,
    isLoginSignUpModalOpen,
    requireLogin,
    showLoginModal,
    showSignUpModal,
    showSignUpModalWithStoreMessage,
    typeLoginSignUp,
    setTypeLoginSignUp,
    showBannerModal,
    hideBannerModal,
    isBannerModalOpen,
    handleEnterNow,
    generalModalOpen,
    setGeneralModalOpen,
    setGeneralModalData,
    showWalletDetectionModal,
    hideWalletDetectionModal,
    isWalletDetectionModalOpen,
    showWalletMismatchModal,
    hideWalletMismatchModal,
    isWalletMismatchModalOpen,
    // KaboomPass Modal functions
    showKaboomPassModal,
    hideKaboomPassModal,
    isKaboomPassModalOpen,
    showKaboomPassPromotion,
    hideKaboomPassPromotion,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
      <LoginSignUpModal
        isOpen={isLoginSignUpModalOpen}
        handleClose={hideLoginSignUpModal}
        typeLoginSignUp={typeLoginSignUp}
        setTypeLoginSignUp={setTypeLoginSignUp}
        isShowStoreMessage={isShowStoreMessage}
        setIsShowStoreMessage={setIsShowStoreMessage}
      />
      <ModalGeneral
        setModalOpen={setGeneralModalOpen}
        theme={generalModalData?.theme}
        modalOpen={generalModalOpen}
        modalTitle={generalModalData.title}
        modalDescription={generalModalData.description}
        modalBody={generalModalData?.content}
      />
      <WalletDetectionModal
        isOpen={isWalletDetectionModalOpen}
        onClose={hideWalletDetectionModal}
        onConnect={() => {
          if (walletDetectionCallback) {
            walletDetectionCallback();
          }
        }}
      />
      <WalletMismatchModal
        isOpen={isWalletMismatchModalOpen}
        onClose={hideWalletMismatchModal}
        connectedAddress={connectedAddress || ''}
        profileAddress={userInfo?.mm_address || ''}
        onSwitch={handleWalletSwitch}
      />
      <KaboomPassModal isOpen={isKaboomPassModalOpen} onClose={hideKaboomPassModal} />
      <BannerModal
        isOpen={isBannerModalOpen}
        onClose={hideBannerModal}
        onEnterNow={handleEnterNow}
      />
      <ModalGeneral
        modalOpen={isPopupPenXROpen}
        modalBody={<PenXRView onClose={() => setIsPopupPenXROpen(false)} />}
        modalTitle={undefined}
        modalDescription={undefined}
        setModalOpen={setIsPopupPenXROpen}
        theme="w-full lg:max-w-[1544px] lg:w-[calc(100vw*0.8+16px)] bg-transparent rounded-none"
        isPadding={false}
      />
      {/* KaboomPass Promotion Banner */}
      {showKaboomPassPromotion && (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
          <div className="relative w-24 md:w-[150px]">
            <div className="relative z-10 rounded-xl overflow-hidden">
              {isMounted && (
                <div
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={showKaboomPassModal}
                >
                  <DynamicReactPlayer
                    playing
                    url="/assets/gunnies-nft.webm"
                    width="100%"
                    height="100%"
                    controls={false}
                    loop
                    muted
                  />
                  <Image
                    src="/images/kaboom-pass.gif"
                    alt="Kaboom Pass"
                    width={142}
                    height={28}
                    className="w-[142px] h-[28px]"
                    unoptimized
                  />
                  <p className="text-white text-[8px] md:text-[10px] font-chakra font-semibold uppercase px-4 py-2 rounded-full border border-white bg-black hover:bg-[#1CBBBB] hover:border-[#1CBBBB] transition-colors">
                    Learn more
                  </p>
                </div>
              )}
              <button
                onClick={e => {
                  e.stopPropagation();
                  hideKaboomPassPromotion();
                }}
                className="absolute top-2 right-2 z-20 bg-black/70 hover:bg-black/90 text-white rounded-full p-1.5 transition-colors"
                aria-label="Close promotion"
              >
                <svg
                  className="w-3 h-3 md:w-4 md:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;

import { Dispatch, SetStateAction } from 'react';
import { GeneralModalDataType, TypeLoginSignUp } from '../providers/GlobalProvider';

// Types for user info and global context
export interface UserInfo {
  id?: string;
  created_at?: string;
  updated_at?: string;
  stripe_customer_id?: string;
  email?: string;
  is_deleted?: boolean;
  lootlocker_player_id?: string;
  lootlocker_player_ulid?: string;
  lootlocker_wallet_id?: string;
  mm_address?: string;
  metamask_bind?: boolean;
  steam_id?: string;
  user_from?: string;
  username?: string;
}

export interface UserInfoResponse {
  status: boolean;
  message?: string;
  result?: UserInfo;
}

export interface GlobalContextType {
  userInfo: UserInfo | null;
  isLoadingUserInfo: boolean;
  userInfoError: string | null;
  refetchUserInfo: () => void;
  isAuthenticated: boolean;
  // Login Modal functions
  showLoginSignUpModal: () => void;
  hideLoginSignUpModal: () => void;
  isLoginSignUpModalOpen: boolean;
  requireLogin: (callback: () => void) => void;
  showLoginModal: () => void;
  showSignUpModal: () => void;
  showSignUpModalWithStoreMessage: () => void;
  typeLoginSignUp: TypeLoginSignUp;
  setTypeLoginSignUp: Dispatch<SetStateAction<TypeLoginSignUp>>;
  // Banner Modal functions
  showBannerModal: () => void;
  hideBannerModal: () => void;
  isBannerModalOpen: boolean;
  handleEnterNow: () => void;
  generalModalOpen: boolean;
  setGeneralModalOpen: Dispatch<SetStateAction<boolean>>;
  setGeneralModalData: Dispatch<SetStateAction<GeneralModalDataType>>;
  // Wallet Detection Modal functions
  showWalletDetectionModal: (onConnect?: () => void) => void;
  hideWalletDetectionModal: () => void;
  isWalletDetectionModalOpen: boolean;
  // Wallet Mismatch Modal functions
  showWalletMismatchModal: () => void;
  hideWalletMismatchModal: () => void;
  isWalletMismatchModalOpen: boolean;
  // KaboomPass Modal functions
  showKaboomPassModal: () => void;
  hideKaboomPassModal: () => void;
  isKaboomPassModalOpen: boolean;
  showKaboomPassPromotion: boolean;
  hideKaboomPassPromotion: () => void;
}

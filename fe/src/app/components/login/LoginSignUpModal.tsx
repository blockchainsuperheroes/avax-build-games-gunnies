'use client';

import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { EXTERNAL_LINK } from '@/app/constants/external_link';
import { getSession, signIn } from 'next-auth/react';
import { RedirectableProviderType } from 'next-auth/providers/index';
import { toast } from 'react-toastify';
import WalletSection from './WalletSection';
import Modal from '../common/Modal';
import SectionOptions from './SectionOptions';
import SignUpSection from './SignUpSection';
import { SignInSection } from './SignInSection';
import { truncateAddress } from '@/utils';
import { useAccount } from 'wagmi';
import { TypeLoginSignUp } from '@/app/providers/GlobalProvider';
import LoginSignUpSection from './LoginSignUpSection';

interface LoginSignUpModalProps {
  isOpen: boolean;
  handleClose: () => void;
  isShowStoreMessage?: boolean;
  setIsShowStoreMessage?: any;
  typeLoginSignUp: TypeLoginSignUp,
  setTypeLoginSignUp: any
}

interface LoginFormData {
  email: string;
  password: string;
}

export const LoginSignUpModal = ({ 
  isOpen, 
  handleClose, 
  isShowStoreMessage = false, 
  setIsShowStoreMessage,
  typeLoginSignUp,
  setTypeLoginSignUp,
}: LoginSignUpModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: 'onSubmit',
  });
  
  const { address } = useAccount();
  const [isShowOptions, setIsShowOptions] = useState(false);
  // const [isShowStoreMessage, setShowStoreMessage] = useState(showStoreMessage);


  const onClose = () => {
    handleClose();
    setIsShowOptions(false);
    window.scrollTo(0, 1);
  };

  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = (await signIn<RedirectableProviderType | any>('login', {
        username: email,
        password: password,
        signature: '',
        address: '',
        message: '',
        redirect: false,
      })) as any;
      const parseMessageAndSplitByColon = (message: string) => {
        return message.split(`:`);
      };

      if (response?.error === null) {
        await handleLoginSuccess();
        return;
      }
      if (!response) {
        return;
      }

      const parsedMessage = parseMessageAndSplitByColon(response.error);

      if (parsedMessage[0] === 'EMAIL_VERIFICATION') {
        toast.error(`You need to validate your email address to login.`);
        return;
      } else if (parsedMessage[0] === 'REFERRAL_CODE_UNVERIFIED') {
        toast.error(`You need to enter a valid referral code to login.`);
        return;
      }

      if (response.error) {
        toast.error(response.error);
        toast.clearWaitingQueue();
      }
    } catch (e: any) {
      toast.error(e);
      toast.clearWaitingQueue();
    }
  };

  const handleLoginSuccess = async () => onClose();

  const handleLoginFailed = (error: string) => {
    setIsShowOptions(true);
  };

  if (!isOpen) return null;

  const onSignIn = () => {
    setTypeLoginSignUp(TypeLoginSignUp.LOGIN);
    setIsShowStoreMessage(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isShowCloseButton isBorderColor className="md:!max-w-[496px] bg-transparent ">
      {isShowOptions ? (
        <SectionOptions
          onSignUp={() => {
            setTypeLoginSignUp(TypeLoginSignUp.SIGN_UP);
            setIsShowOptions(false);
          }}
          onSkip={onClose}
        />
      ) 
      : typeLoginSignUp == TypeLoginSignUp.LOGIN_SIGIN_UP ? (
        <LoginSignUpSection setTypeLoginSignUp={setTypeLoginSignUp} onClose={onClose} setIsShowStoreMessage={setIsShowStoreMessage}/>
      )
      : typeLoginSignUp == TypeLoginSignUp.SIGN_UP || typeLoginSignUp == TypeLoginSignUp.SIGN_UP_IN_SPATIAL ? (
        <SignUpSection setTypeLoginSignUp={setTypeLoginSignUp} onClose={onClose} setIsShowStoreMessage={setIsShowStoreMessage}/>
      )
      : isShowStoreMessage ?
      <div className="relative bg-[url('/images/Burning-town.png')] bg-center bg-cover py-4 px-6 lg:p-8 lg:px-10">
        {
          address ?
          <div>Please Link this wallet <span>{truncateAddress(address)}</span> by creating a PG account <span onClick={()=>setTypeLoginSignUp(TypeLoginSignUp.SIGN_UP)} className='underline cursor-pointer'>here</span> to purchase in the store.</div>
          : <div>You must be a Gunnies player to checkout. Please <span onClick={onSignIn} className='underline cursor-pointer'>sign in</span> with your wallet.</div>
        }
      </div>
      : typeLoginSignUp == TypeLoginSignUp.LOGIN ? (
        <SignInSection setTypeLoginSignUp={setTypeLoginSignUp} onClose={onClose} setIsShowStoreMessage={setIsShowStoreMessage} />
      ): null}
    </Modal>
  );
}

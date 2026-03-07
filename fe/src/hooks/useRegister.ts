'use client';

import { useSignMessage, useDisconnect } from 'wagmi';
import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function useRegister() {
  const [signature, setSignature] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const Router = useRouter();
  const { update }: any = useSession();
  const { disconnect } = useDisconnect();
  const { data, signMessageAsync } = useSignMessage({
    mutation: {
      onSuccess(data: any, variables: any) {
        setMessage(variables.message);
        setSignature(data);
      },
    },
  });

  /**
   * Create Confirm Password
   * @param options
   */
  const createConfirmPassword = async (options: any) => {
    try {
      const result = await fetch(`/api/confirm-password`, options);
      const json = await result.json();

      if (json.success) {
        toast.success(`Your password has been reset. You can now login!`);
        return true;
      }

      toast.error(`Could not reset password`);

      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  /**
   * Create Register
   * @param options
   * @param email
   * @param password
   */
  const createForgotPassword = async (options: any) => {
    try {
      const result = await fetch(`/api/forgot-password`, options);
      const json = await result.json();

      if (json.success) {
        // toast.success(
        //   `Your password has been reset. Please check your email for further instructions.`
        // );
        return true;
      }

      toast.error(`${json.message ?? 'Could not reset password'}`);

      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  /**
   * Create Register
   * @param options
   * @param email
   * @param password
   */
  const updateEmail = async (options: any) => {
    try {
      const result = await fetch(
        `/api/${process.env.NEXT_PUBLIC_PROXY_PATH}/user/change-email`,
        options
      );

      const json = await result.json();
      if (json.status) {
        toast.success(`Updated! Please validate your email.`);
        toast.clearWaitingQueue();

        setIsProcessing(true);
        Router.push(`/validate-email`);
        setTimeout(() => {
          setIsProcessing(false);
        }, 5000);
        return true;
      }

      toast.error(json.message);
      toast.clearWaitingQueue();
      return true;
    } catch (e) {
      console.log(e);
    }
  };

  const updateTwitter = async (username: string, options: any) => {
    try {
      const result = await fetch(
        `/api/${process.env.NEXT_PUBLIC_PROXY_PATH}/user/auth/twitter`,
        options
      );
      const json = await result.json();
      if (json.status) {
        toast.success(`Updated!.`);
        toast.clearWaitingQueue();
        await update();

        setTimeout(() => {
          setIsProcessing(false);
        }, 5000);
        return true;
      }

      toast.error(json.message);
      toast.clearWaitingQueue();
      return false;
    } catch (e) {
      console.log(e);
    }
  };

  const claimPoint = async (token: string, template_name: string[]) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          template_name,
        }),
      };

      const result = await fetch(`/api/claim-point`, options);
      return result;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  /**
   * Create Register
   * @param options
   * @param email
   * @param password
   */
  const createRegister = async (
    options: any,
    isShowMessage: boolean = true,
  ) => {
    try {
      const result = await fetch(
        `/api/sign-up`,
        options
      );
      const json = await result.json();
      if (json.status || json.success) {
        const body = JSON.parse(options.body);
        let message = `Thanks for registering! Please validate your email address to login. (Check your spam folder)`;
        if (body?.wallet_type == 'ethermail') {
          message = `Thank for registering. Now please sign in with Ethermail.`;
        }
        
        if (!isShowMessage) {
          return true;
        }
        toast.success(
          message
        );
        toast.clearWaitingQueue();

        setIsProcessing(true);
        if (body?.wallet_type !== 'ethermail') {
          Router.push(`/validate-email`);
        } else {
          Router.push(`/sign-in`);
        }
        setTimeout(() => {
          setIsProcessing(false);
        }, 5000);
        return true;
      }

      toast.error(json.message);
      toast.clearWaitingQueue();
      setSignature(null);
      return false;
    } catch (e) {
      console.log(e);
      setSignature(null);
      return false;
    }
  };

  const getMessage = () => {
    return 'Signing up to Avalanche Games';
  };

  const createSignedSignature = () => {
    const message = getMessage();
    return signMessageAsync({ message });
  };

  const validateReferralCode = async (options: any, isShowToast: boolean = true) => {
    try {
      const result = await fetch(`/api/validate-referral-code`, options);
      const json = await result.json();

      if (json.success) {
        return true;
      }

      if (isShowToast) {
        toast.error(`${json.message ?? 'Could not validate referral code'}`);
        toast.clearWaitingQueue();
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const submitReferralCode = async (options: any) => {
    try {
      const result = await fetch(`/api/submit-referral-code`, options);
      const json = await result.json();

      if (json.success) {
        toast.success(json.message);
        toast.clearWaitingQueue();
        return true;
      }

      toast.error(`${json.message ?? 'Could not submit referral code'}`);
      toast.clearWaitingQueue();
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  const getInfluencerList = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: '*/*',
      },
    };
    try {
      const result = await fetch(
        `/api/${process.env.NEXT_PUBLIC_PROXY_PATH}/api/InflunacerWidget/list`,
        options
      );
      const json = await result.json();
      return json;
    } catch (e) {
      console.log(e);
    }
  };

  return {
    createSignedSignature,
    signature,
    message,
    createRegister,
    createForgotPassword,
    createConfirmPassword,
    validateReferralCode,
    submitReferralCode,
    getInfluencerList,
    isProcessing,
    updateEmail,
    updateTwitter,
    claimPoint,
  };
}

'use client';

import { useAccount, useSignMessage } from 'wagmi';
import React, { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { UserRejectedRequestError } from 'viem';

/**
 * Login Hook
 */
export default function useLogin({
  onSuccess,
  onError,
  showSignUpCb,
  isLoginWithWallet = false,
}: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  showSignUpCb?: () => void;
  isLoginWithWallet?: boolean;
}) {
  const { address } = useAccount();
  const [signature, setSignature] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session }: any = useSession();

  const { data, signMessage, isPending, signMessageAsync } = useSignMessage({
    mutation: {
      onSuccess(data: any, variables: any) {
        setMessage(variables.message);
        setSignature(data);
      },
    },
  });

  const getMessage = () => {
    return `Logging into Avalanche Games,${parseInt((new Date().getTime() / 1000).toFixed(0))}`;
  };

  const createSignedSignature = async () => {
    try {
      const message = getMessage();
      console.log('message', message);
      const result = await signMessageAsync({ message });
      console.log('result', result);
    } catch (error: any) {
      if (error instanceof UserRejectedRequestError) {
        toast.error('User rejected request');
        return;
      } else {
        toast.error(error.message || 'Failed to sign message');
        return;
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (signature && message) {
        if (isLoginWithWallet) {
          await createWalletLogin(signature, address as string, message);
        } else {
          const data = JSON.stringify({
            signature: signature,
            address: (address as any).toLowerCase(),
            message: message,
            login_from: `${process.env.NEXT_PUBLIC_USER_FROM}`,
          });
          try {
            setIsLoading(true);
            const loggedIn = await signIn('mm-login', {
              data,
              address,
              redirect: false,
            });

            if (loggedIn?.error === null) {
              console.log('useLogin', 'replace /account');
              if (onSuccess) {
                onSuccess();
              }
              return;
            }

            if (loggedIn?.error) {
              const parseMessageAndSplitByColon = (message: string) => {
                return message.split(`:`);
              };
              const parsedMessage = parseMessageAndSplitByColon(loggedIn?.error);

              console.log('parsedMessage', parsedMessage);

              if (parsedMessage[0] === 'EMAIL_VERIFICATION') {
                toast.error(`You need to validate your email address to login.`);
                return;
              } else if (parsedMessage[0] === 'REFERRAL_CODE_UNVERIFIED') {
                toast.error(`You need to verify your referral code to login.`);
                return;
              } else if (parsedMessage[0] === 'UNAUTHENTICATED_USER') {
                if (showSignUpCb) {
                  showSignUpCb();
                }
                return;
              }

              if (parsedMessage[0] !== 'GUNNIES_USER_NOT_FOUND') {
                toast.error(loggedIn?.error);
                toast.clearWaitingQueue();
              }
              if (onError) {
                onError(loggedIn?.error);
              }
            }
          } catch (e) {
            console.log(e);
          } finally {
            setIsLoading(false);
          }
        }
      }
    })();
  }, [signature, message, isLoginWithWallet]);

  useEffect(() => {
    if (session?.token) {
      const obj = {
        token: session.token,
      };
      localStorage.setItem('bearer_token_bridge', session.token);
    }
  }, [session]);

  const createLoginWithEmail = async (options: any) => {
    const response = await fetch(`/api/login-with-email`, options);

    const res = await response.json();

    return res;
  };

  const createWalletLogin = async (signature: string, address: string, message: string) => {
    try {
      setIsLoading(true);

      const result = await signIn('wallet-login', {
        signature,
        address: address.toLowerCase(),
        message,
        redirect: false,
      });

      if (result?.error === null) {
        console.log('useLogin wallet-login', 'success');
        if (onSuccess) {
          onSuccess();
        }
        return { success: true };
      }

      if (result?.error) {
        const parseMessageAndSplitByColon = (message: string) => {
          return message.split(`:`);
        };
        const parsedMessage = parseMessageAndSplitByColon(result?.error);

        if (parsedMessage[0] === 'EMAIL_VERIFICATION') {
          toast.error(`You need to validate your email address to login.`);
          return { success: false, error: 'EMAIL_VERIFICATION' };
        } else if (parsedMessage[0] === 'REFERRAL_CODE_UNVERIFIED') {
          toast.error(`You need to verify your referral code to login.`);
          return { success: false, error: 'REFERRAL_CODE_UNVERIFIED' };
        } else if (parsedMessage[0] === 'UNAUTHENTICATED_USER') {
          if (showSignUpCb) {
            showSignUpCb();
          }
          return { success: false, error: 'UNAUTHENTICATED_USER' };
        }

        if (parsedMessage[0] !== 'GUNNIES_USER_NOT_FOUND') {
          toast.error(result?.error);
          toast.clearWaitingQueue();
        }

        if (onError) {
          onError(result?.error);
        }

        return { success: false, error: result?.error };
      }

      return { success: false, error: 'Unknown error' };
    } catch (error: any) {
      console.error('Wallet login error:', error);
      toast.error(error.message || 'Wallet login failed');
      if (onError) {
        onError(error.message || 'Wallet login failed');
      }
      return { success: false, error: error.message || 'Wallet login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSignedSignature,
    signature,
    message,
    isLoading: isLoading || isPending,
    createLoginWithEmail,
    createWalletLogin,
  };
}

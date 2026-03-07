"use client";

import debounce from "lodash/debounce";
import { RedirectableProviderType } from "next-auth/providers/index";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAccount as useAccountWagmi, useConnect } from "wagmi";
import {
  Button,
  ButtonType,
  Loader,
  ModalGeneral,
  Text,
  View
} from "../../../";
import { TextType } from "../../../common";
import SectionSignUpView from "../../sign-up/SectionSignUpView/SectionSignUpView";
import { ConnectWalletView } from "./ConnectWalletView";
import { SignInResultView } from "./SignInResultView";
import useIsMounted from "../../../../../../hooks/useIsMounted";
import useLogin from "@/hooks/useLogin";
import { useGlobalContext } from "@/app/providers/GlobalProvider";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { BiWallet } from "react-icons/bi";
import { HiOutlineMail } from "react-icons/hi";

/**
 * Row
 * @param label
 * @param value
 * @constructor
 */

export const Row = ({
  label,
  value,
  info,
  isDisable,
}: {
  info?: string;
  label: string;
  value: string | JSX.Element;
  isDisable?: boolean;
}) => {
  return (
    <div
      className={`pt-3 flex flex-col space-y-1.5 ${
        isDisable ? 'opacity-60' : ''
      }`}
    >
      <div className={`flex flex-col text-white`}>
        <span className='font-sora text-[14px] leading-[22px]'>
          {label}
        </span>
        {info && <span className={`text-[10px] text-cinder-100`}>{info}</span>}
      </div>
      <div className={``}>{value}</div>
    </div>
  );
};

export const SectionSignInWidget = ({ redirectUri }: { redirectUri?: string }) => {
  const isMounted = useIsMounted();
  const { connectors } = useConnect();

  const { status, data: session, update } = useSession();
  const { 
    formState: formStateForm1,
    getValues: getValuesForm1,
    register: registerForm1,
    handleSubmit: handleSubmitForm1,
    setValue: setValueForm1,
  } = useForm();

  const { 
    formState: formStateForm2,
    getValues: getValuesForm2,
    register: registerForm2,
    handleSubmit: handleSubmitForm2,
    setValue: setValueForm2,
  } = useForm();

  const { 
    errors: errorsForm1,
    isValid: isValidForm1,
    }: any = formStateForm1;
  const { 
    errors: errorsForm2,
    isValid: isValidForm2,
    }: any = formStateForm2;
  const [noWallet, setNoWallet] = useState<boolean>(false);
  const [username, setUsername] = useState(``);
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [type, setType] = useState("password");
  const [isEyeOff, setIsEyeOff] = useState(true);
  const { isLoading: isProcessing, createLoginWithEmail } = useLogin({
    onSuccess: async () => {
      // if (handleLoginSuccess) {
      //   handleLoginSuccess();
      // }
    },
    onError: (error: string) => {
      // if (handleLoginFailed) {
      //   handleLoginFailed(error);
      // }
    },
    isLoginWithWallet: true,
    // showSignUpCb,
  });

  const [isLoginWithEmail, setIsLoginWithEmail] = useState<boolean | undefined>();

  const { openConnectModal } = useConnectModal();

  const [isLogging, setIsLogging] = useState(false);
  const [isLoggingWithEmail, setIsLoggingWithEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setGeneralModalOpen, setGeneralModalData } = useGlobalContext();
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  const router = useRouter();
  const params = useSearchParams();
  
  const [isSignInResultViewOpen, setIsSignInResultViewOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(false);
  const [isConnectWalletViewOpen, setIsConnectWalletViewOpen] = useState(false);
  const [isShowLoginWithEmail, setIsShowLoginWithEmail] = useState(false);
  const [resultDescription, setResultDescription] = useState('');
  const [hasKey, setHasKey] = useState(false);

  const [isNeedVerify, setIsIsNeedVerify] = useState(false);
  const [fromWebsite, setFromWebsite] = useState<string>();

  const onCloseSignInResultView = useCallback(()=>{
    setIsSignInResultViewOpen(false);
    setResultDescription('');
    if(!isShowLoginWithEmail && isSuccess) {
      router.replace("/");
    } else {
      setIsSuccess(undefined);
    }
  }, [isSuccess]);

  const handleToggle = () => {
    if (type === "password") {
      setIsEyeOff(false);
      setType("text");
    } else {
      setIsEyeOff(true);
      setType("password");
    }
  };

  const loginWithToken = async (token: string, isNeedToShowResult: boolean = true) => {
    setIsLoading(true);
    const data = JSON.stringify({
      token,
    });
    try {
      const loggedIn = await signIn("token-login", {
        data,
        redirect: false,
      });

      if (loggedIn?.error === null) {
        console.log("SectionAirdripWidget", "replace /account");
        setIsLoading(true);
        // router.replace("/account");
        if (isNeedToShowResult && fromWebsite != 'spatial') {
          setIsSuccess(true);
          setIsSignInResultViewOpen(true);
        }
        setTimeout(() => {
          setIsLoading(false);
        }, 6000);
        localStorage.setItem("token-login", "true");
        localStorage.removeItem("bearer_token");
        return;
      }
      if (loggedIn?.error) {
        toast.error(`There was an issue logging you in`);
        console.log(loggedIn);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };


  const handleValidateEmail = useCallback(async (key: string) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      };

      const result = await fetch(
        `/api/${process.env.NEXT_PUBLIC_PROXY_PATH}/user/validate_email/v2`,
        options
      );

      console.log("handleValidateEmail result", result);

      const json = await result.json();

      console.log("handleValidateEmail json", json);

      if (json.status) {
        loginWithToken(json.result.access_token, false);
      } else {
        const message = json?.detail ? json.detail : 'There was an issue validating email'
        toast.error(`${message}`);
      }
    } catch (e) {
      console.log("error");
      console.log(e);
    }
  }, []);

  const callValidateEmail = useCallback(debounce(handleValidateEmail, 500), []);

  useEffect(() => {
    if(isShowLoginWithEmail) {
      setPassword("");
      setValueForm1('password', "");
    }
  }, [isShowLoginWithEmail]);

  useEffect(() => {
    const key = params?.get("key");
    setHasKey(key ? true : false);
    const verify = params?.get("verify");
    const fromWebsiteValue = params?.get("from_website") || '';
    setFromWebsite(fromWebsiteValue);
    if (key && verify) {
      setIsIsNeedVerify(true);
      callValidateEmail(key);
      // router.replace(`/account`);
    } else if (key) {
      loginWithToken(key, fromWebsiteValue != 'spatial');
    }
  }, []);

  const resendVerificationEmail = async (jwt: string) => {
    const response = await fetch(
      `/api/${process.env.NEXT_PUBLIC_PROXY_PATH}/user/resend_verify_email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    const json = await response.json();

    if (json?.status) {
      toast.success(`Email Sent!`);
      await update();
      setGeneralModalOpen(false);
      return;
    }

    toast.error(`Error sending email.`);
    return;
  };

  const onSubmitWithUsernamePassword = async (data: any, e: any) => {
    setIsShowLoginWithEmail(false);
    setIsLogging(true);
    e.preventDefault();
    try {
          console.log('onSubmit username', username);
          console.log('onSubmit email', email);
          console.log('onSubmit password', password);
      if (username && password) {
        const response = (await signIn<RedirectableProviderType | any>("login", {
          username: username,
          password: password,
          signature: "",
          address: "",
          message: "",
          redirect: false,
        })) as any;
        const parseMessageAndSplitByColon = (message: string) => {
          return message.split(`:`);
        };

        console.log("SectionSignInWidget response", response);

        if (response?.error === null) {
          setIsLoading(true);
          if (!redirectUri) {
              const redirectUrl = params?.get("redirectUrl");
              if (!redirectUrl) {
                // router.push("/account");
                setIsSuccess(true);
                setIsSignInResultViewOpen(true);
              } else {
                window.location.replace(redirectUrl);
              }
          }
          return;
        }
        if (!response) {
          return;
        }

        const parsedMessage = parseMessageAndSplitByColon(response.error);

        console.log(response);

        if (parsedMessage[0] === "EMAIL_VERIFICATION") {
          toast.error(`You need to validate your email address to login.`);

          setGeneralModalOpen(true);
          setGeneralModalData({
            theme: `max-w-xl bg-cinder-400 w-full text-white`,
            title: `You need to validate your email address to login.`,
            content: (
              <div className={`flex justify-center mx-auto p-4`}>
                <Button
                  onClick={() => {
                    resendVerificationEmail(parsedMessage[1]?.trim());
                  }}
                  btnType={ButtonType.ghost}
                  label="Send Validation Email"
                ></Button>
              </div>
            ),
            description: "Click the button below to send a new validation email.",
          });

          return;
        } else if (parsedMessage[0] === "REFERRAL_CODE_UNVERIFIED") {
          localStorage.setItem("bearer_token", parsedMessage[1]?.trim());
          setIsLoading(true);
          router.push("/enter-referral-code");
          return;
        }

        if (response.error) {
          setIsSuccess(false);
          setResultDescription(response.error);
          setIsSignInResultViewOpen(true);
        }
      }
    } catch (e: any) {
      setIsSuccess(false);
      setResultDescription(`${e}`);
      setIsSignInResultViewOpen(true);
    } finally {
      setIsLogging(false);
    }

    return true;

  }

  const onSubmitWithEmail = async (data: any, e: any) => {
    setIsShowLoginWithEmail(true);
    setIsLoggingWithEmail(true);
    e.preventDefault();
    try {
          console.log('onSubmit username', username);
          console.log('onSubmit email', email);
          console.log('onSubmit password', password);
      if (email) { // Login with magic link
          console.log('login with magic link by email', email);
        const data: any = {
          email: email,
          login_from: `${process.env.NEXT_PUBLIC_USER_FROM}`,
        }
        console.log('onSubmit data', data);
        const options = {
          method: "POST",
          body: JSON.stringify(data),
        };

        const result = await createLoginWithEmail(options);
        console.log('onSubmitWithEmail result', result);
        if (result.success) {
          setIsSuccess(true);
          setResultDescription(`Please check your inbox and complete verification. Contact us if you encounter any problems.`);
          setIsSignInResultViewOpen(true);
          setEmail('');
          setValueForm2('email', '');
        } else {
          if (result.error) {
            setIsSuccess(false);
            setResultDescription(`${result.message}`);
            setIsSignInResultViewOpen(true);
          }
        }
      }
    } catch (e: any) {
      setIsSuccess(false);
      setResultDescription(`${e}`);
      setIsSignInResultViewOpen(true);
    } finally {
      setIsLoggingWithEmail(false);
    }

    return true;
  }


  useEffect(() => {
    console.log("SectionSigInWidget session", session);
    if ((session as any)?.token) {
      console.log("SectionSigInWidget redirect to /account");
        const redirectUrl = params?.get("redirectUrl");
        if (!redirectUrl) {
          // if (!isNeedVerify) {
          //   router.replace("/");
          // } else {
          //   router.replace("/");
          //   // router.replace("/account");
          // }
          if (fromWebsite == 'spatial') {
            router.replace(`/?show-open-spatial=true`);
          } else {
            router.replace("/");
          }
        } else {
          window.location.replace(redirectUrl);
        }
    }
  }, [(session as any)?.token, isNeedVerify, fromWebsite]);

  const onSetUsername = (e: any) => {
    setUsername(e.target.value);
    setValueForm1('username', e.target.value);
  }

  const onSetEmail = (e: any) => {
    setEmail(e.target.value);
    setValueForm2('email', e.target.value);
  }

  const onSetPassword = (e: any) => {
    setPassword(e.target.value);
    setValueForm1('password', e.target.value);
  }

  const handleLoginSuccess = async () => {
    setIsConnectWalletViewOpen(false);
  };

  const handleLoginFailed = (error: string) => {
    // setIsShowOptions(true);

  };

  const openConnectWalletToLogin = ()=>{
    setIsConnectWalletViewOpen(true);
    if (openConnectModal) {
      openConnectModal();
    }
  }


  return (
    <>
       <SectionSignUpView
      classView={`max-w-[479px] h-fit lg:h-fit mt-5 md:mt-10 lg:mt-[40px] ${isSignInResultViewOpen || isSuccess || isConnectWalletViewOpen ? 'hidden' : ''}`}
      classViewBG="h-fit backdrop-blur-[32px] bg-[linear-gradient(180deg,rgba(14,12,21,0.9)_0%,rgba(14,12,21,0)_100%)] flex flex-col px-5 lg:!px-[48px] rounded-[20px] py-[26px] lg:!py-[36px]"
      classHight="h-[1000px] md:min-h-[calc(100vh-60px)]"
      >
      {isMounted && !isLoading && !isProcessing && !hasKey ? (
        <>
          {
            isLoginWithEmail != undefined ?
              <div 
                onClick={()=>setIsLoginWithEmail(undefined)}
              className="absolute cursor-pointer left-8 top-3 font-sora text-[14px] leading-[22px] text-white" >{`< BACK`}</div>
            : null
          }
          {!redirectUri ? 
            isLoginWithEmail == undefined ? (
            <Text
              label='Choose Your Login Method'
              className='w-full text-center font-chakra-petch font-semibold text-[24px] leading-[32px]'
            />
          ) : (
            <Text type={TextType.HeadingH3} label='LOGIN' className='mt-6' />
          )
          : null}
          <div>
            {
              redirectUri ?
                <View className="flex flex-col items-center">
                  <Image
                    src="/assets/images/pg-logo.svg"
                    alt="view"
                    width={100}
                    height={64}
                  />
                  <Text label="SIGN-IN" className="mt-6 text-center font-chakra-petch font-bold text-[48px]" />
                  <Text className="text-center font-sora font-bold text-[24px] leading-[40px]" >To <span className="text-[#5E67FB]">{redirectUri}</span></Text>
                  <Text label={`This allows read only access of your PG account to use the $PC faucet`} className="mt-4 text-center uppercase font-chakra-petch font-bold text-[20px]" />
                </View>
                : null
            }
            {isLoginWithEmail == undefined ? (
                <>
                  <Button
                    onClick={() =>
                      setIsLoginWithEmail(false)
                    }
                    btnType={ButtonType.magic}
                    className='mt-4 w-full !h-[60px] flex items-center flex-row justify-center gap-3'
                  >
                    <Image
                      width={24}
                      height={24}
                      objectFit='contain'
                      src='/assets/icons/ic-pen.svg'
                      alt=''
                    />{' '}
                    <span className='font-sora font-normal text-[16px]'>
                      Username/Email & Password
                    </span>
                  </Button>
                  <Button
                    onClick={() => setIsLoginWithEmail(true)}
                    btnType={ButtonType.magic}
                    className='mt-4 w-full !h-[60px] flex items-center flex-row justify-center gap-3'
                  >
                    <HiOutlineMail className='text-white text-[24px]' />{' '}
                    <span className='font-sora font-normal text-[16px]'>
                      Send me a magic link
                    </span>
                  </Button>
                  <Button
                    onClick={openConnectWalletToLogin}
                    btnType={ButtonType.magic}
                    className='mt-4 w-full !h-[60px] flex items-center flex-row justify-center gap-3'
                  >
                    <BiWallet className='text-white text-[24px]' />{' '}
                    <span className='font-sora font-normal text-[16px]'>
                      Use my web3 wallet!
                    </span>
                  </Button>
                  <div className='mt-3 font-sora text-[14px] leading-[22px] text-white text-center'>
                    No account, need to create one?{' '}
                    <Link
                      href={`/sign-up`}
                      className="inline-block text-gunnies-purple font-bold cursor-pointer ">Sign up</Link>
                  </div>
                  <div className='mt-3 w-full flex justify-center'>
                    <Image
                      width={180}
                      height={42}
                      objectFit='contain'
                      src='/images/header-text-avalanche-games.png'
                      alt=''
                    />
                  </div>
                </>
              ) : isLoginWithEmail == false ? (
                <>
                  <form
                    onSubmit={handleSubmitForm1(onSubmitWithUsernamePassword)}
                  >
                    <Row
                      label={'Username or Email'}
                      value={
                        <div className={``}>
                          <input
                            {...registerForm1('username', {
                              required: {
                                value: true,
                                message: ` Username or Email is required`,
                              },
                            })}
                            onChange={onSetUsername}
                            className={`input !h-[48px] focus:!border-white !font-sora`}
                            type='text'
                            name='username'
                            placeholder={'Username or Email'}
                          />
                          {errorsForm1.username && (
                            <div className='text-red-600 mt-2 text-sm font-bold'>
                              {errorsForm1.username.message}
                            </div>
                          )}
                        </div>
                      }
                    />
                    <Row
                      label={`Password`}
                      value={
                        <div>
                          <div className='flex flex-row'>
                            <input
                              {...registerForm1('password', {
                                required: {
                                  value: true,
                                  message: 'Password is required',
                                },
                                minLength: {
                                  value: 8,
                                  message:
                                    'Password must have at least 8 characters',
                                },
                              })}
                              className='input !h-[48px] focus:!border-white !font-sora'
                              name='password'
                              type={type}
                              value={password}
                              onChange={onSetPassword}
                              placeholder='Password'
                            />
                            <span
                              className='flex cursor-pointer justify-around items-center text-white mb-2 mr-1  mt-2.5'
                              onClick={handleToggle}
                            >
                              {isEyeOff ? (
                                <Image
                                  className='absolute mr-10'
                                  width={20}
                                  height={20}
                                  objectFit='contain'
                                  src='/assets/icons/ic-eye-off-2.svg'
                                  alt=''
                                />
                              ) : (
                                <Image
                                  className='absolute mr-10'
                                  width={17}
                                  height={12}
                                  objectFit='contain'
                                  src='/assets/icons/ic-eye-on-2.svg'
                                  alt=''
                                />
                              )}
                            </span>
                          </div>
                          {errorsForm1.password && (
                            <div className='text-red-600 mt-2 text-sm font-bold'>
                              {errorsForm1.password.message}
                            </div>
                          )}
                        </div>
                      }
                    />

                    <View className='w-full flex justify-center mt-3'>
                      {!isLogging ? (
                        <input
                          type='submit'
                          value='ENTER'
                          className={`btn-magic w-full`}
                        />
                      ) : (
                        <div className='flex h-[58px]'>
                          <img
                            className={`w-20 mx-auto`}
                            src='/assets/icons/loader.svg'
                            alt=''
                          />
                        </div>
                      )}
                    </View>
                    <View className={`flex mt-3 justify-center`}>
                      <Link href={`/forgot-password`}>
                        <Text
                          type={TextType.BodySmallRegular}
                          className='!text-white cursor-pointer hover:underline'
                          label='Forgot Password?'
                        />
                      </Link>
                    </View>
                  </form>
                  <div className='mt-3 w-full flex justify-center'>
                    <Image
                      width={180}
                      height={42}
                      objectFit='contain'
                      src='/images/header-text-avalanche-games.png'
                      alt=''
                    />
                  </div>
                </>
              ) : isLoginWithEmail ? (
                <>
                  <form onSubmit={handleSubmitForm2(onSubmitWithEmail)}>
                    <Row
                      label={'Login via Magic Link'}
                      value={
                        <div className={``}>
                          <input
                            {...registerForm2('email', {
                              required: {
                                value: true,
                                message: `Email is required`,
                              },
                              pattern: {
                                value:
                                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                                message: 'Enter a valid email address',
                              },
                            })}
                            onChange={onSetEmail}
                            className={`input !h-[48px] focus:!border-white !font-sora`}
                            type='text'
                            name='email'
                            placeholder={'Email'}
                          />

                          {errorsForm2.email && (
                            <div className='text-red-600 mt-2 text-sm font-bold'>
                              {errorsForm2.email.message}
                            </div>
                          )}
                        </div>
                      }
                    />
                    <View className='w-full flex justify-center mt-3'>
                      {!isLoggingWithEmail ? (
                        <input
                          type='submit'
                          value='ENTER'
                          className={`btn-magic w-full`}
                        />
                      ) : (
                        <div className='flex h-[58px]'>
                          <img
                            className={`w-20 mx-auto`}
                            src='/assets/icons/loader.svg'
                            alt=''
                          />
                        </div>
                      )}
                    </View>
                  </form>
                  <div className='mt-6 w-full flex justify-center'>
                    <Image
                      width={180}
                      height={42}
                      objectFit='contain'
                      src='/images/header-text-avalanche-games.png'
                      alt=''
                    />
                  </div>
                </>
              ) : null}
          </div>
        </>
      ) : (
        <Loader />
      )}
    {/* </View> */}
    </SectionSignUpView>
    
     <ModalGeneral
            modalOpen={isSignInResultViewOpen}
            modalBody={<SignInResultView
            isSuccess={isSuccess}
            isShowLoginWithEmail={isShowLoginWithEmail}
            description={resultDescription}
            onClose={onCloseSignInResultView}
            />}
            modalTitle={undefined}
            modalDescription={undefined}
            setModalOpen={setIsSignInResultViewOpen}
            theme="w-[calc(100vw-40px)] max-w-[400px] md:max-w-[444px] md:w-[444px] bg-transparent rounded-[20px]"
        />
     <ModalGeneral
            modalOpen={isConnectWalletViewOpen}
            modalBody={<ConnectWalletView
            onClose={()=>setIsConnectWalletViewOpen(false)}
            handleLoginSuccess={handleLoginSuccess}
            handleLoginFailed={handleLoginFailed}
            showSignUpCb={() => {
              // setIsShowSignUp(true);
              // setIsShowOptions(false);
            }}
            />}
            modalTitle={undefined}
            modalDescription={undefined}
            setModalOpen={setIsConnectWalletViewOpen}
            theme="w-[calc(100vw-40px)] max-w-[400px] md:max-w-[432px] md:w-[432px] bg-transparent rounded-[20px]"
        />
    </>
  );
};

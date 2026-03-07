"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Image from "next/image";
import { View, Text, Loader } from "@/app/components";
import useIsMounted from "../../../../../../hooks/useIsMounted";
import useRegister from "@/hooks/useRegister";
import SectionSignUpView from "../../sign-up/SectionSignUpView/SectionSignUpView";

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
      className={`pt-5 flex flex-col space-y-1.5 ${
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

export const SectionForgotPasswordWidget = () => {
  const isMounted = useIsMounted();

  const { formState, getValues, setValue, register, handleSubmit } = useForm();
  const { errors, isValid }: any = formState;
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState(``);
  const { createForgotPassword } = useRegister();
  const router = useRouter();

  const [captcha, setCaptcha] = useState(``);
  const [captchaImage, setCaptchaImage] = useState(``);
  const [captchaId, setCaptchaId] = useState(``);

  const onSubmit = async (data: any, e: any) => {
    setIsProcessing(true);
    e.preventDefault();

    if (!captcha || !email) {
      toast.error(`Form Not Valid`);
      toast.clearWaitingQueue();
      setIsProcessing(false);
      return false;
    }

    const inputData: any = {
      email: email,
      captcha_id: captchaId,
      captcha_answer: captcha,
      user_from: `${process.env.NEXT_PUBLIC_USER_FROM}`,
    }
    console.log('onSubmit inputData', inputData);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    };

    const result = await createForgotPassword(options);
    setIsSuccess(result);

    setIsProcessing(false);
    if (!result) {
      refreshCaptcha();
    }
  };


  const onSetEmail = (e: any) => {
    setEmail(e.target.value);
    setValue('email', e.target.value);
  }

  const onSetCaptcha = (e: any) => {
    setCaptcha(e.target.value);
    setValue('captcha', e.target.value);
  }

  const refreshCaptcha = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const result = await fetch(
        `${process.env.NEXT_PUBLIC_LOGIN_API}/user/captcha/generate`,
        options
      );
      const json = await result.json();

      if (json.status) {
        setCaptchaImage(json.image);
        setCaptchaId(json.captcha_id);
      }
    } catch (e) {
      console.log("error");
      console.log(e);
    }
  }

  useEffect(() => {
    refreshCaptcha();
  }, []);


  return (
    <SectionSignUpView
      classView={`${!isSuccess ? 'mt-10 lg:mt-[80px] max-w-[479px]' : 'max-w-[444px]'}  h-fit lg:h-fit `}
      classViewBG={`${!isSuccess ? 'lg:!px-[48px] lg:!py-[36px]' : 'lg:!px-[28px] lg:!py-10'} h-fit backdrop-blur-[32px] bg-[linear-gradient(180deg,rgba(14,12,21,0.9)_0%,rgba(14,12,21,0)_100%)] flex flex-col`}
    >
      {isMounted ? (
        !isSuccess ?
          <form onSubmit={handleSubmit(onSubmit)}
            className={``}>
            <div className="font-chakra-petch font-bold text-[40px] leading-[48px] text-white">FORGOT PASSWORD</div>
            <Row
              label={`Enter Your Email Address`}
              value={
                <div className={``}>
                  <input
                    {...register("email", {
                      required: {
                        value: true,
                        message: `Email is required`,
                      },
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                        message: "Enter a valid email address",
                      },
                    })}
                    onChange={onSetEmail}
                    className={`input !h-[48px] focus:!border-white !font-sora`}
                    type="text"
                    name="email"
                    placeholder={'Email'}
                  />
                  {errors.email && (
                    <div className="text-red-600 mt-2 text-sm font-bold">
                      {errors.email.message}
                    </div>
                  )}
                </div>
              }
            />
            <View className="w-full flex justify-center mt-[21px]">
              {!isProcessing ? (
                <input
                  type="submit"
                  value="SUBMIT"
                  className={`btn-magic w-full`}
                />
              ) : (
                <img className={`h-[58px] w-20 mx-auto`} src="/assets/icons/loader.svg" alt="" />
              )}
            </View>
            <View className="mt-3 w-full flex justify-center">
              <View className="select-none bg-transparent w-[380px] items-center lg:items-start h-auto lg:h-[120px] flex flex-col p-2 gap-2 justify-center">
                {captchaImage ?
                  <>
                    <View className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-center lg:items-start ">
                      <img
                        className="w-[180px] h-[60px] object-cover"
                        src={`data:image/jpeg;base64,${captchaImage}`}
                        alt=""
                      />
                      <View className="flex-1 flex flex-col">
                        <input
                          {...register("captcha", {
                            required: {
                              value: true,
                              message: "Captcha is required",
                            },
                          })}
                          onChange={onSetCaptcha}
                          className={`input mt-1.5 text-black !border-transparent px-2 w-[140px] py-2 h-[33px] rounded-[2px] bg-white`}
                          type="number"
                          name="captcha"
                          placeholder=""
                          value={captcha}
                        />
                      </View>
                    </View>
                    <View className="flex flex-row gap-2 items-center">
                      <div
                        onClick={refreshCaptcha}
                        className="rounded-[6px] w-[100px] border-[#e3e3e3] border flex justify-center py-1.5 bg-white"
                      >
                        <Text
                          className="!text-black font-bold font-sora text-[12px] leading-[16px] cursor-pointer "
                          label="Refresh"
                        />
                      </div>
                      {errors.captcha && (
                        <div className="text-red-600 font-kristen text-[9px] font-bold">
                          {errors.captcha.message}
                        </div>
                      )}
                    </View>
                  </>
                  : <img className={`w-20 mx-auto`} src="/assets/icons/loader.svg" alt="" />
                }
              </View>
            </View>
          </form>
          :
         <>
         <Text
          className={`w-full text-center font-chakra-petch font-bold text-[30px] leading-[38px] text-white`}
          label={`Email Sent`}
        />
        <View className="mt-4 flex flex-col">
           <Text
            className={`w-full text-center font-sora text-[18px] leading-[26px] text-white`}
            label={`Please check your inbox and complete verification. Contact us if you encounter any problems.`}
          />
        </View>
         </>
      ) : (
        <Loader />
      )}
    </SectionSignUpView>
  );
};

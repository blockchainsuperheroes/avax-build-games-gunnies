"use client";

import useRegister from "@/hooks/useRegister";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Loader, Text, View } from "../../..";
import useIsMounted from "../../../../../../hooks/useIsMounted";
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


export const SectionConfirmPasswordWidget = () => {
  const isMounted = useIsMounted();

  const { formState, getValues, register, handleSubmit } = useForm();
  const { errors, isValid }: any = formState;
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState(``);
  const [password, setPassword] = useState(``);
  const [confirmPassword, setConfirmPassword] = useState(``);
  const [type, setType] = useState("password");
  const [typeConfirmPassword, setTypeConfirmPassword] = useState("password");
  const [isEyeOff, setIsEyeOff] = useState(true);
  const [isEyeOffConfirmPassword, setIsEyeOffConfirmPassword] = useState(true);
  const { createConfirmPassword } = useRegister();
  const router = useRouter();
  const params = useSearchParams()


  const handleToggle = () => {
    if (type === "password") {
      setIsEyeOff(false);
      setType("text");
    } else {
      setIsEyeOff(true);
      setType("password");
    }
  };

  const handleToggleConfirmPassword = () => {
    if (typeConfirmPassword === "password") {
      setIsEyeOffConfirmPassword(false);
      setTypeConfirmPassword("text");
    } else {
      setIsEyeOffConfirmPassword(true);
      setTypeConfirmPassword("password");
    }
  };

  const onSubmit = async (data: any, e: any) => {
    setIsProcessing(true);
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error(`Form Not Valid`);
      toast.clearWaitingQueue();
      setIsProcessing(false);
      return false;
    }

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        resetToken: params?.get('key'),
      }),
    };

    const result = await createConfirmPassword(options);
    if (result) {
      setIsSuccess(result);
      // router.replace("/sign-in");
    }
    setIsProcessing(false);
  };

  return (
    <SectionSignUpView
      classView={`${!isSuccess ? 'max-w-[479px]' : 'max-w-[444px]'}  h-fit lg:h-fit `}
      classViewBG={`${!isSuccess ? '' : 'lg:!px-[28px] lg:!py-10'} h-fit backdrop-blur-[32px] bg-[linear-gradient(180deg,rgba(14,12,21,0.9)_0%,rgba(14,12,21,0)_100%)] flex flex-col`}
    >
      {isMounted ? (
        !isSuccess ?
          <form onSubmit={handleSubmit(onSubmit)} 
            className={``}>
            <div className="font-chakra-petch font-bold text-[40px] leading-[48px] text-white">NEW PASSWORD</div>
            <Row
              label={`Enter Your New Password`}
              value={
                <div>
                  <div className="flex flex-row">
                    <input
                      {...register("password", {
                        required: {
                          value: true,
                          message: "Password is required",
                        },
                        minLength: {
                          value: 8,
                          message: "Password must have at least 8 characters",
                        },
                      })}
                      name="password"
                      type={type}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`input !h-[48px] focus:!border-white !font-sora`}
                      placeholder=""
                    />
                    <span
                      className="flex cursor-pointer justify-around items-center text-white mb-2 mr-1"
                      onClick={handleToggle}
                    >
                      {isEyeOff ? (
                        <Image
                          className="absolute mr-10"
                          width={19}
                          height={16}
                          objectFit="contain"
                          src="/assets/icons/ic-eye-off.svg"
                          alt=""
                        />
                      ) : (
                        <Image
                          className="absolute mr-10"
                          width={19}
                          height={10}
                          objectFit="contain"
                          src="/assets/icons/ic-eye-on.svg"
                          alt=""
                        />
                      )}
                    </span>
                  </div>
                  {errors.password && (
                    <div className="text-red-600 mt-2 text-sm font-bold">
                      {errors.password.message}
                    </div>
                  )}
                </div>
              }
            />
            <Row
              label={`Enter again`}
              value={
                <div>
                  <div className="flex flex-row">
                    <input
                      {...register("confirmpassword", {
                        required: {
                          value: true,
                          message: "Confirm password is required",
                        },
                        minLength: {
                          value: 8,
                          message: "Confirm Password must have at least 8 characters",
                        },
                        validate: (value) => {
                          const { password } = getValues();
                          return password === value || "The password and confirmation password do not match";
                        }
                      })}
                      name="confirmpassword"
                      type={typeConfirmPassword}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`input !h-[48px] focus:!border-white !font-sora`}
                      placeholder=""
                    />
                    <span
                      className="flex cursor-pointer justify-around items-center text-white mb-2 mr-1"
                      onClick={handleToggleConfirmPassword}
                    >
                      {isEyeOffConfirmPassword ? (
                        <Image
                          className="absolute mr-10"
                          width={19}
                          height={16}
                          objectFit="contain"
                          src="/assets/icons/ic-eye-off.svg"
                          alt=""
                        />
                      ) : (
                        <Image
                          className="absolute mr-10"
                          width={19}
                          height={10}
                          objectFit="contain"
                          src="/assets/icons/ic-eye-on.svg"
                          alt=""
                        />
                      )}
                    </span>
                  </div>
                  {errors.confirmpassword && (
                    <div className="text-red-600 mt-2 text-sm font-bold">
                      {errors.confirmpassword.message}
                    </div>
                  )}
                </div>
              }
            />

            <div className="mt-3 font-sora text-[10px] text-white">*At least 8 characters long, must include uppercase & lowercase letters, numbers, and symbols</div>
            <View className="w-full flex justify-center mt-3">
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
          </form>
          :
         <>
          <Text
            className={`w-full text-center font-chakra-petch font-bold text-[30px] leading-[38px] text-white`}
            label={`Your New Password is Reset Successfully`}
          />
          <a href="/sign-in" className="mt-4 btn-magic w-full h-[58px] font-chakra-petch font-bold text-[20px] leading-[58px] flex items-center justify-center cursor-pointer text-white ">
            LOGIN AGAIN
          </a>
         </>
      ) : (
        <Loader />
      )}
    </SectionSignUpView>
  );
};

import useRegister from '@/hooks/useRegister';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiOutlineMail } from 'react-icons/hi';
import { Text, View } from '../common';
import { TypeLoginSignUp } from '@/app/providers/GlobalProvider';

function SignUpSection({
  // setIsShowSignUp,
  setTypeLoginSignUp,
  setIsShowStoreMessage,
  onClose,
}: {
  // setIsShowSignUp: (isShowSignUp: boolean) => void;
  setTypeLoginSignUp: any
  setIsShowStoreMessage: (isShowSignUp: boolean) => void;
  onClose: () => void;
}) {
  const { createRegister, isProcessing } = useRegister();
  const { formState, getValues, setValue, register, handleSubmit } = useForm();
  const { errors, isValid }: any = formState;
  const [isProcessingRegister, setIsProcessingRegister] = useState(false);
  const [email, setEmail] = useState(``);

  const [captcha, setCaptcha] = useState(``);
  const [captchaImage, setCaptchaImage] = useState(``);
  const [captchaId, setCaptchaId] = useState(``);
  const [isEmailSentViewOpen, setIsEmailSentViewOpen] = useState(false);

  const onRegisterSuccess = () => {
    setIsEmailSentViewOpen(true);
  };

  const onSetEmail = (e: any) => {
    setEmail(e.target.value);
    setValue('email', e.target.value);
  };

  const onSubmit = async (data: any, e: any) => {
    setIsProcessingRegister(true);
    e.preventDefault();
    try {
      const { email } = getValues();
      console.log('onSubmit email', email);
      if (email) {
        const data: any = {
          captcha_id: captchaId,
          captcha_answer: captcha,
          email: email,
          user_from: `${process.env.NEXT_PUBLIC_USER_FROM}`,
          from_website: 'spatial',
        };
        console.log('onSubmit data', data);
        const options = {
          method: 'POST',
          body: JSON.stringify(data),
        };

        const result = await createRegister(options, false);
        if (!result) {
          refreshCaptcha();
        } else {
          onRegisterSuccess();
          setEmail('');
          setValue('email', '');
          setCaptcha('');
          setValue('captcha', '');
          refreshCaptcha();
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingRegister(false);
    }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const onSetCaptcha = (e: any) => {
    setCaptcha(e.target.value);
    setValue('captcha', e.target.value);
  };

  const refreshCaptcha = async () => {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
      console.log('error');
      console.log(e);
    }
  };

  return (
    <>
      <View className={`flex items-center justify-center w-[calc(100vw-44px)] p-[1px] max-w-[496px] h-fit lg:h-fit`}>
        <View className="w-full relative h-fit backdrop-blur-[32px] flex flex-col px-5 lg:!px-[48px] rounded-[20px] py-[26px] lg:!py-[36px]">
          {!isEmailSentViewOpen ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="font-chakra-petch font-bold text-[40px] leading-[48px] text-white">
                Sign Up and Dive In!
              </div>
              <div className="mt-4 font-sora font-semibold text-[18px] leading-[26px] text-white">
                Unlock New Adventures
              </div>
              <div className="mt-8 flex w-full flex-col border-b border-b-[#FFFFFF26] py-4 h-[56px] justify-center">
                <div className="flex flex-row items-center">
                  <HiOutlineMail className="text-gunnies-dark-6 text-[24px]" />
                  <input
                    {...register('email', {
                      required: {
                        value: true,
                        message: 'Email is required',
                      },
                    })}
                    className="input font-sora h-[24px] text-[16px] leading-[24px] placeholder:text-gunnies-dark-6 !border-none !border-transparent"
                    onChange={onSetEmail}
                    type="text"
                    name="email"
                    placeholder="Email"
                  />
                </div>
              </div>
              {errors.email && (
                <div className="text-red-600 mt-2 text-sm font-bold">{errors.email.message}</div>
              )}
              <div className="mt-6 w-full flex justify-center h-[58px]">
                {!isProcessingRegister ? (
                  <input type="submit" value="SEND ME MAGIC EMAIL" className={`btn-magic w-full`} />
                ) : (
                  <img className={`w-20`} src="/assets/icons/loader.svg" alt="" />
                )}
              </div>

              <div className="mt-4 font-sora text-[16px] leading-[24px] text-white text-center">
                Already have an account?{' '}
                <div
                  // href={`/sign-in`}
                  onClick={() => setTypeLoginSignUp(TypeLoginSignUp.LOGIN)}
                  className="inline-block text-gunnies-purple font-bold cursor-pointer "
                >
                  Log in
                </div>
              </div>

              <View className="mt-1 w-full flex justify-center">
                <View className="select-none w-[380px] items-center lg:items-start h-auto lg:h-[120px] flex flex-col py-2 gap-2 justify-center">
                  {captchaImage ? (
                    <>
                      <View className="flex flex-col lg:flex-row gap-2 lg:gap-4 items-center lg:items-start">
                        <img
                          className="w-[180px] h-[60px] object-cover"
                          src={`data:image/jpeg;base64,${captchaImage}`}
                          alt=""
                        />
                        <View className="flex-1 flex flex-col">
                          <input
                            {...register('captcha', {
                              required: {
                                value: true,
                                message: 'Captcha is required',
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
                  ) : (
                    <img className={`w-20 mx-auto`} src="/assets/icons/loader.svg" alt="" />
                  )}
                </View>
              </View>
            </form>
          ) : (
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
          )}
        </View>
      </View>
    </>
  );
}

export default SignUpSection;

"use client";

import {
  ButtonIcon,
  Text,
  View
} from "../../..";

export const SignInResultView = ({ onClose, isSuccess, isShowLoginWithEmail, description }: { onClose: any, isSuccess: boolean | undefined, isShowLoginWithEmail: boolean, description: string }) => {

  return (
    <View className="bg-[#111313] w-full flex items-center justify-center">
      <View className={`color-border-bg w-[calc(100vw-40px)] max-w-[400px] md:max-w-[444px] md:w-[444px] h-fit`}>
        <View className="bg-[#111313] w-full h-fit backdrop-blur-[10px] flex flex-col items-center p-5 lg:py-[40px] lg:px-[28px] rounded-[20px]">
       <Text
          className={`w-full text-center font-chakra-petch font-bold text-[30px] leading-[38px] text-white`}
          label={ !isShowLoginWithEmail ? (isSuccess ? 'Login Successful' : 'Login Failed') : (isSuccess ? 'Email Sent' : 'Email Not Detected')}
        />
        {
          description ? 
          <View className="mt-2 flex flex-col">
              <Text
                className={`w-full text-center font-sora text-[18px] leading-[26px] text-white`}
                label={description}
              />
            </View>
            : null
        }
        {/* {
          !isShowLoginWithEmail ?
          (!isSuccess ?
          <View className="mt-2 flex flex-col">
            <Text
              className={`w-full text-center font-sora text-[18px] leading-[26px] text-white`}
              label={!isSuccess ? 'Email and password do not match. Please try again. Contact us if you encounter any problems.' : ''}
            />
          </View>
          : null)
          : (isSuccess ?
          <View className="mt-2 flex flex-col">
            <Text
              className={`w-full text-center font-sora text-[18px] leading-[26px] text-white`}
              label={'Please check your inbox and complete verification. Contact us if you encounter any problems.'}
            />
          </View>
          : null
          )
        } */}
        <View className="absolute right-[8px] top-[8px] flex flex-col justify-center items-center">
          <ButtonIcon
            onClick={onClose}
            twBgIcon="bg-ic-close-black"
            className="w-[24px] h-[24px] cursor-pointer"
          />
        </View>
      </View>
      </View>
    </View>
  )
}

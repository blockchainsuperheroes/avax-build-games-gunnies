"use client";

import { useSession } from "next-auth/react";
import { ButtonIcon, Text, View } from "../common";


export const LoginResultView = ({ isShow, isSuccess, isShowLoginWithEmail, description }: { isShow: boolean, isSuccess: boolean | undefined, isShowLoginWithEmail: boolean, description: string }) => {


  return (
    <View className={`${!isShow ? 'hidden' : ''} p-[1px] w-full h-fit`}>
      <View className=" h-fit backdrop-blur-[10px] flex flex-col items-center p-5 lg:py-[36px] lg:px-[48px] rounded-[20px]">
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
      </View>
      </View>
  )
}

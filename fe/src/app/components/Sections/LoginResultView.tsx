"use client";

import {
  ButtonIcon,
  Text,
  View
} from "../";

export const LoginResultView = ({ onClose, onAction }: { onClose: any, onAction: any }) => {

  return (
    <View className="bg-[#111313] w-full flex items-center justify-center">
      <View className={`color-border-bg w-[calc(100vw-40px)] max-w-[400px] md:max-w-[444px] md:w-[444px] h-fit`}>
        <View className="bg-[#111313] w-full h-fit backdrop-blur-[10px] flex flex-col items-center p-5 lg:py-[40px] lg:px-[28px] rounded-[20px]">
       <Text
          className={`w-full text-center font-chakra-petch font-bold text-[30px] leading-[38px] text-white`}
          label={'Login Successful'}
        />
        <div 
          onClick={onAction}
          className="mt-4 btn-magic w-full">
          RETURN TO SPATIAL
        </div>
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

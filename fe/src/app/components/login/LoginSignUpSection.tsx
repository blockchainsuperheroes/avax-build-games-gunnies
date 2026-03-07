import { TypeLoginSignUp } from '@/app/providers/GlobalProvider';
import { Button, ButtonType, Text, View } from '..';
import Image from "next/image";

function LoginSignUpSection({
  setTypeLoginSignUp,
  setIsShowStoreMessage,
  onClose,
}: {
  setTypeLoginSignUp: any
  setIsShowStoreMessage: (isShowSignUp: boolean) => void;
  onClose: () => void;
}) {

  return (
    <>
      <View className={`p-[1px] w-full h-fit`}>
        <View className=" h-fit bg-[linear-gradient(180deg,rgba(14,12,21,0.9)_0%,rgba(14,12,21,0)_100%)] backdrop-blur-[10px] flex flex-col items-center p-5 lg:py-[36px] lg:px-[48px] rounded-[20px]">
          <div className="w-full flex justify-center">
            <Image
                width={180}
                height={42}
                objectFit="contain"
                src="/images/header-text-avalanche-games.png"
                alt=""
              />
          </div>
          <Text 
            className="mt-6 w-full text-center font-sora text-[14px] leading-[22px] text-white"
            label="Welcome to Avalanche Games Login System"
            />
          <Button
            onClick={()=>setTypeLoginSignUp(TypeLoginSignUp.LOGIN)}
            btnType={ButtonType.magic}
            className="mt-6 w-full !h-[60px]"
            label="LOGIN" />
          <Button
            onClick={()=>setTypeLoginSignUp(TypeLoginSignUp.SIGN_UP)}
            btnType={ButtonType.magic}
            className="mt-4 w-full !h-[60px]"
            label="SIGN UP" />
        </View>
      </View>
    </>
  );
}

export default LoginSignUpSection;

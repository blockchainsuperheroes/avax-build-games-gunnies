"use client";

import clsx from "clsx";

const SectionSignUpView = ({ children, classView, classViewBG, classHight = 'h-[calc(100vh)]' }: { children: any | JSX.Element, classView?: string, classViewBG?: string, classHight?: string }) => {
 
    return (
      <div
      className={`header overflow-hidden w-full ${classHight} lg:max-w-[1906px] lg:min-h-[750px] lg:h-[100vh] flex relative`}>
        <div className="absolute top-0 bottom-0 left-0 right-0 w-full h-full bg-[#000000]/90 flex justify-center">
        <div className={clsx(`flex items-center justify-center lg:mt-[148px] w-[calc(100vw-44px)] max-w-[540px] h-[447px] lg:h-[362px] p-[1px] border-sign-up-and-dive-in`, classView)}>
          <div className={clsx(`w-full h-full backdrop-blur-[32px]  flex flex-col px-8 lg:px-[72px] py-[33px] rounded-[20px]`, classViewBG)}>
            {children}
          </div>
        </div>
        </div>
      </div>
    );
  };
  
  export default SectionSignUpView;

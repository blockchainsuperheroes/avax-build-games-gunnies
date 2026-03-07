'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ButtonIcon, View } from '../common/';
import './header.css';
import { MenuItem } from './MenuItem';
import { MenuMobileItem } from './MenuMobileItem';
import { MenuData } from './MenuData';
import { useInViewport } from './useInViewport';
import { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface HeaderProps {}

export const Header = ({}: HeaderProps) => {
  const [isOpenNav, setIsOpenNav] = useState(false);
  const mobileNavRef = useRef(null);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const isInViewport = useInViewport(ref);

  return (
    <View className="z-20">
      <div ref={ref}></div>
      <header className="tw-header w-full h-[63px] md:h-[84px] lg:h-[calc(100vw*0.052466)] lg:max-h-[100px] 3xl:h-[100px] bg-black  max-w-[1920px] mx-auto">
        {isOpenNav && (
          <div
            ref={mobileNavRef}
            className="absolute z-20  top-[60px] md:top-[110px] pt-6 pb-[70px] md:pb-24 w-full bg-black flex flex-col justify-between items-between "
          >
            {MenuData.map((it: any, index: number) => (
              <MenuMobileItem key={`menu-mobile-it-${index}`} data={it} />
            ))}
            <View className=" w-full flex items-center justify-center">
              <View className=" w-full max-w-[360px] flex flex-row justify-between items-center">
                <View className=" w-[364px] h-[36px] flex flex-row justify-between items-center">
                  <a
                    href={`${process.env.NEXT_PUBLIC_DOWNLOAD_LINK}`}
                    className="flex items-center justify-center
                     text-white border border-white
                      transition-colors transition-transform duration-200
                  hover:border-none 
                  hover:bg-main-green 
                  hover:scale-95
                  hover:shadow-lg  h-[36px]  font-semibold text-[12px] w-[184px] rounded-md "
                    target="_blank"
                  >
                    DOWNLOAD LAUNCHER
                  </a>
                </View>
                <ButtonIcon
                  href="/account"
                  twBgIcon="bg-ic-account"
                  twSize="w-[24px] h-[24px] ml-4"
                />
              </View>
              <View className="h-[calc(100vw*0.305344)] max-h-[120px]" />
            </View>
          </div>
        )}

        <View
          className="
    tw-menu-view 
    flex 
    items-center 
    overflow-x-scroll 
    disable-scrollbars 
    h-full mx-4
  "
        >
          {/* Mobile Logo + Hamburger */}
          <>
            <Link href="/" className="w-full lg:hidden flex items-center justify-start z-20">
              <Image
                width={122}
                height={29}
                objectFit="contain"
                src="/images/logo-light.svg"
                alt=""
              />
            </Link>

            <ButtonIcon
              twBgIcon={`${isOpenNav ? 'bg-ic-close' : 'bg-ic-3lines'}`}
              className="w-[28px] h-5 lg:hidden cursor-pointer"
              onClick={() => setIsOpenNav(!isOpenNav)}
            />
          </>

          {/* Fixed Menu */}

          <div
            className={`
      tw-left-menu 
      ${isInViewport ? ' grid grid-cols-3 w-full items-center' : '!hidden'}
    `}
          >
            <div className="text-left">
              {' '}
              <View className="flex flex-row gap-1.5">
                {MenuData.map((it: any, index: number) => (
                  <MenuItem
                    key={`menu-it-${index}`}
                    data={it}
                    isEnd={index === MenuData.length - 1}
                  />
                ))}
              </View>
            </div>
            <div className="text-center ">
              <Link href="/" className="">
                <View
                  className="
          relative 
          w-[184px] h-[67px]
          lg:w-[calc(100vw*0.125918)] 
          lg:max-w-[240px] 3xl:w-[240px] 
          lg:h-[calc(100vw*0.029381)] 
          lg:max-h-[56px] 3xl:h-[56px]
          mx-auto
        "
                >
                  <Image
                    priority={true}
                    fill={true}
                    objectFit="contain"
                    src="/images/logo-light.svg"
                    alt=""
                  />
                </View>
              </Link>
            </div>
            <div className="grid justify-items-end w-full">
              <a
                href={`${process.env.NEXT_PUBLIC_DOWNLOAD_LINK}`}
                className="
          flex items-center justify-center 
          text-white border border-white 
          transition-colors transition-transform duration-200
                  hover:border-none 
                  hover:bg-main-green 
                  hover:shadow-lg
                                    hover:scale-95

          h-[54px]  font-semibold 
          text-[16px] w-[267px] 
          rounded-md
        "
                target="_blank"
              >
                DOWNLOAD LAUNCHER
              </a>
            </div>
          </div>
        </View>
      </header>
    </View>
  );
};

export const ButtonIconLink = ({
  twBgIcon,
  twSize,
  href,
  target,
}: {
  twBgIcon: string;
  twSize: string;
  href: string;
  target: string;
}) => {
  return (
    <Link rel={target === '_blank' ? 'noreferrer' : ''} href={`${href}`} target={target}>
      <div
        className={`${twBgIcon} ${twSize} w-[36px] h-[36px] cursor-pointer border-transparent bg-transparent bg-contain bg-no-repeat`}
      />
    </Link>
  );
};

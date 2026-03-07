'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { View } from '../common';
import { MenuData as OriginalMenuData, MenuItem } from './MenuData';
import { useSession, signOut } from 'next-auth/react';
import { useResponsiveScale } from '@/hooks/useResponsiveScale';
import clsx from 'clsx';
import { useAccount, useDisconnect } from 'wagmi';
import { truncateAddress } from '@/utils';
import ModalDownload from '../common/ModalDownload';
import Logo from '@/../public/images/header/logo.svg';
import { useGlobalContext } from '@/app/providers/GlobalProvider';
import { SocialTooltip } from './SocialTooltip';
import { SectionSocials } from './SectionSocials';
import { PlayNowDropdown } from './PlayNowDropdown';
import { GameGuideModal } from './GameGuideModal';
import { usePathname, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/app/constants/routes';
import { useQueryClient } from '@tanstack/react-query';

const MenuButton = ({
  item,
  onClick,
  onSocialClick,
  socialButtonRef,
  onPlayNowClick,
  playNowButtonRef,
}: {
  item: MenuItem;
  onClick?: () => void;
  onSocialClick?: () => void;
  socialButtonRef?: React.RefObject<HTMLButtonElement>;
  onPlayNowClick?: () => void;
  playNowButtonRef?: React.RefObject<HTMLButtonElement>;
}) => {
  const buttonContent = (
    <button
      ref={
        item.title === 'Socials'
          ? socialButtonRef
          : item.title === 'Play Now'
            ? playNowButtonRef
            : undefined
      }
      onClick={
        item.title === 'Socials'
          ? onSocialClick
          : item.title === 'Play Now'
            ? onPlayNowClick
            : item.onClick || onClick
      }
      className={item.buttonClass}
    >
      {item.image && (
        <Image
          className={item.imageClass}
          src={item.image}
          alt={item.title}
          width={40}
          height={40}
        />
      )}
      <p className={item.textClass}>{item.title}</p>
    </button>
  );

  const wrappedContent =
    item.route && !item.onClickOnly ? (
      <Link
        href={item.route}
        onClick={onClick}
        className="w-full flex items-center justify-center md:w-[unset] md:block"
        target={item?.target || '_self'}
      >
        {buttonContent}
      </Link>
    ) : (
      buttonContent
    );

  return wrappedContent;
};

export const MainHeader = () => {
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const socialButtonRef = useRef<HTMLButtonElement>(null);
  const playNowButtonRef = useRef<HTMLButtonElement>(null);
  const playNowHoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isOpenNav, setIsOpenNav] = useState(false);
  const [isOpenDownloadModal, setIsOpenDownloadModal] = useState(false);
  const [isSocialTooltipOpen, setIsSocialTooltipOpen] = useState(false);
  const [isPlayNowDropdownOpen, setIsPlayNowDropdownOpen] = useState(false);
  const [isGameGuideModalOpen, setIsGameGuideModalOpen] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const { disconnect } = useDisconnect();
  const ref = useRef<HTMLDivElement>(null);
  const { isScaled } = useResponsiveScale({ ref });
  const { isConnected, address, status: accountStatus } = useAccount();
  const { showLoginSignUpModal, showBannerModal } = useGlobalContext();
  const queryClient = useQueryClient();

  const toggleMenu = () => setIsOpenNav(prev => !prev);
  const toggleSocialTooltip = () => setIsSocialTooltipOpen(prev => !prev);
  const togglePlayNowDropdown = () => setIsPlayNowDropdownOpen(prev => !prev);

  const handlePlayNowMouseEnter = () => {
    if (playNowHoverTimeoutRef.current) {
      clearTimeout(playNowHoverTimeoutRef.current);
    }
    setIsPlayNowDropdownOpen(true);
  };

  const handlePlayNowMouseLeave = () => {
    playNowHoverTimeoutRef.current = setTimeout(() => {
      setIsPlayNowDropdownOpen(false);
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (playNowHoverTimeoutRef.current) {
        clearTimeout(playNowHoverTimeoutRef.current);
      }
    };
  }, []);

  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const mobileNav = mobileNavRef.current;
      const menuButton = menuButtonRef.current;

      if (
        mobileNav &&
        menuButton &&
        !mobileNav.contains(event.target as Node) &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsOpenNav(false);
      }
    }

    if (isOpenNav) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenNav]);

  const MenuData = OriginalMenuData.map(item => {
    return item;
  });

  const isReady = sessionStatus !== 'loading';

  return (
    <View className="z-[50]">
      {/* Promo Sticker Banner */}
      <div
        className="w-full py-2 md:py-4"
        style={{ background: 'linear-gradient(to right, #501F80, #2B084E)' }}
      >
        <div className="max-w-[1920px] mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center gap-2">
            <Image src="/images/halloween/pumpkin.svg" alt="Pumpkin" width={24} height={24} />
            <p className="text-white text-sm md:text-base text-center [text-shadow:1px_1px_2px_rgba(0,0,0,0.5)] font-chakra">
              <span className="text-[#FFA83D]">
                Spooky November Arrives. Experience the Spatial & Play to Win.
              </span>{' '}
              <button
                className="text-white underline cursor-pointer bg-transparent border-none p-0"
                onClick={e => {
                  e.preventDefault();
                  showBannerModal();
                }}
              >
                Enter Now
              </button>
            </p>
            <Image src="/images/halloween/pumpkin.svg" alt="Pumpkin" width={24} height={24} />
          </div>
        </div>
      </div>
      <header
        ref={ref}
        className={clsx(
          'bg-black/70 w-full mx-auto py-4 relative z-[50]',
          isScaled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Desktop Header */}
        <div className="hidden xl:flex items-center disable-scrollbars h-full md:mx-4 overflow-x-hidden relative">
          {/* Logo */}
          <Link href="/" className="mx-4">
            <Image
              priority
              width={186}
              height={71}
              src={Logo}
              alt="Gunnies logo"
              className="object-contain"
            />
          </Link>

          <div className="flex items-center justify-center gap-4 md:gap-5 px-4 md:absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
            {MenuData.slice(0, 5).map(item => (
              <div
                key={item.title}
                className={item.title === 'Play Now' ? 'relative' : ''}
                onMouseEnter={item.title === 'Play Now' ? handlePlayNowMouseEnter : undefined}
                onMouseLeave={item.title === 'Play Now' ? handlePlayNowMouseLeave : undefined}
              >
                <MenuButton
                  item={item}
                  onClick={() => setIsOpenNav(false)}
                  onPlayNowClick={togglePlayNowDropdown}
                  playNowButtonRef={playNowButtonRef}
                />
              </div>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-4 md:gap-4 relative">
            {MenuData.slice(5).map(item => (
              <MenuButton
                key={item.title}
                item={item}
                onClick={() => setIsOpenNav(false)}
                onSocialClick={toggleSocialTooltip}
                socialButtonRef={socialButtonRef}
              />
            ))}

            <ButtonLogin onClick={showLoginSignUpModal} />
            {isReady &&
              isConnected &&
              !session &&
              !(pathname == '/sign-in' || pathname == '/sign-up') && (
                <div className="flex items-center justify-center gap-1 border-white border px-5 py-3 rounded-full hover:bg-[#1CBBBC] hover:border-[#1CBBBC]">
                  <p className="text-sm font-chakra">{truncateAddress(address || '')}</p>

                  <button onClick={() => disconnect()}>
                    <Image
                      src="/images/header/x-circle.svg"
                      width={24}
                      height={24}
                      alt="x circle"
                    />
                  </button>
                </div>
              )}

            {isReady && session && (
              <>
                <Link
                  href={ROUTES.PROFILE}
                  className="flex items-center justify-center border-[#1CBBBB] border rounded-full hover:bg-[#1CBBBB] hover:border-[#1CBBBB] transition-colors w-11 h-11"
                >
                  <Image src="/assets/icons/profile.svg" width={26} height={26} alt="User" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="flex xl:hidden items-center justify-between px-4 relative">
          <Link href="/">
            <Image
              priority
              width={96}
              height={36}
              src="/images/header/logo.svg"
              alt="Gunnies logo"
              className="object-contain"
            />
          </Link>

          <button
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="flex items-center justify-center w-[30px] h-[30px] md:w-[40px] md:h-[40px]"
          >
            {isOpenNav ? (
              <Image src="/images/header/close.svg" alt="Close" width={30} height={24} />
            ) : (
              <Image src="/images/header/hamburger.svg" alt="Hamburger" width={30} height={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpenNav && isReady && (
            <>
              {/* Black transparent overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed left-0 right-0 bottom-0 bg-black/80 z-[90] h-[80%]"
                onClick={() => setIsOpenNav(false)}
              />

              <motion.div
                ref={mobileNavRef}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute top-[68px] left-0 w-full bg-black flex flex-col items-center gap-4 md:gap-6 py-8 z-[100]"
              >
                {MenuData.filter(item => item.title !== 'Socials').map(item => {
                  if (item.title === 'Play Now') {
                    // Mobile Play Now dropdown items
                    const mobileDropdownItems = [
                      {
                        title: 'Know Your Rewards',
                        route: ROUTES.GET_STARTED,
                      },
                      {
                        title: 'Current Event',
                        route: ROUTES.CURRENT_EVENT,
                      },
                      {
                        title: 'Download',
                        route: ROUTES.DOWNLOAD,
                      },
                      {
                        title: 'Line Up & More',
                        route: ROUTES.LINEUP_AND_MORE,
                      },

                      {
                        title: 'Gunnies NFT Cards',
                        route: ROUTES.NFT_CARDS,
                      },
                      {
                        title: 'Line Up & More',
                        route: ROUTES.LINEUP_AND_MORE,
                      },
                      {
                        title: 'Game Guide',
                        onClick: () => {
                          setIsGameGuideModalOpen(true);
                          setIsOpenNav(false);
                          setIsPlayNowDropdownOpen(false);
                        },
                      },
                    ];

                    return (
                      <div
                        key={item.title}
                        className="flex flex-col items-center w-[297px] border border-[#1CBBBC] rounded-lg"
                      >
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            togglePlayNowDropdown();
                          }}
                          className={item.buttonClass}
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={24}
                              height={24}
                              className="w-[30px] h-[30px] md:w-[28px] md:h-[35px]"
                            />
                          )}

                          <p className={item.textClass}>{item.title}</p>

                          <Image
                            src={
                              isPlayNowDropdownOpen
                                ? '/assets/icons/ic-up.svg'
                                : '/assets/icons/ic-down.svg'
                            }
                            alt={isPlayNowDropdownOpen ? 'Close' : 'Open'}
                            width={20}
                            height={20}
                            className="w-5 h-5 transition-transform ml-auto"
                          />
                        </button>
                        <AnimatePresence>
                          {isPlayNowDropdownOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col items-center gap-0 w-full px-4 overflow-hidden"
                            >
                              {mobileDropdownItems.map((dropdownItem, index) => {
                                const itemClassName =
                                  'w-full flex items-center justify-start text-xs text-base font-chakra uppercase hover:text-[#1CBBBC] active:text-[#1CBBBC] h-[28px] touch-manipulation pl-8';

                                if (dropdownItem.route && !dropdownItem.onClick) {
                                  return (
                                    <Link
                                      key={index}
                                      href={dropdownItem.route}
                                      onClick={() => {
                                        setIsOpenNav(false);
                                        setIsPlayNowDropdownOpen(false);
                                      }}
                                      className={itemClassName}
                                    >
                                      {dropdownItem.title}
                                    </Link>
                                  );
                                }

                                return (
                                  <button
                                    key={index}
                                    onClick={dropdownItem.onClick}
                                    className={itemClassName}
                                  >
                                    {dropdownItem.title}
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }
                  return (
                    <MenuButton
                      key={item.title}
                      item={item}
                      onClick={() => setIsOpenNav(false)}
                      onSocialClick={() => {
                        toggleSocialTooltip();
                      }}
                      socialButtonRef={socialButtonRef}
                      onPlayNowClick={togglePlayNowDropdown}
                      playNowButtonRef={playNowButtonRef}
                    />
                  );
                })}

                <ButtonLogin onClick={showLoginSignUpModal} />

                {isConnected && !session && (
                  <div className="flex items-center justify-center gap-1 border-white border px-5 py-3 rounded-full hover:bg-[#1CBBBC] hover:border-[#1CBBBC]">
                    <p className="text-sm font-chakra">{truncateAddress(address || '')}</p>

                    <button onClick={() => disconnect()}>
                      <Image
                        src="/images/header/x-circle.svg"
                        width={24}
                        height={24}
                        alt="x circle"
                      />
                    </button>
                  </div>
                )}

                {session && (
                  <>
                    <Link
                      href={ROUTES.PROFILE}
                      className="flex items-center justify-center border-[#1CBBBB] border rounded-full hover:bg-[#1CBBBC] hover:border-[#1CBBBC] transition-colors w-11 h-11 pr-8"
                    >
                      <Image src="/assets/icons/profile.svg" width={26} height={26} alt="User" />
                    </Link>
                  </>
                )}

                {/* <SectionSocials /> */}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <ModalDownload isOpen={isOpenDownloadModal} onClose={() => setIsOpenDownloadModal(false)} />
      <SocialTooltip
        isOpen={isSocialTooltipOpen}
        onClose={() => setIsSocialTooltipOpen(false)}
        triggerRef={socialButtonRef}
      />
      <PlayNowDropdown
        isOpen={isPlayNowDropdownOpen}
        onClose={() => setIsPlayNowDropdownOpen(false)}
        triggerRef={playNowButtonRef}
        onCurrentEventClick={showBannerModal}
        onItemClick={() => setIsOpenNav(false)}
        onHover={() => {
          if (playNowHoverTimeoutRef.current) {
            clearTimeout(playNowHoverTimeoutRef.current);
          }
        }}
      />
      <GameGuideModal
        isOpen={isGameGuideModalOpen}
        onClose={() => setIsGameGuideModalOpen(false)}
      />
    </View>
  );
};

const ButtonLogin = ({ onClick }: { onClick: () => void }) => {
  const { status: sessionStatus } = useSession();
  const { address } = useAccount();
  const pathname = usePathname();

  if (
    sessionStatus === 'authenticated' ||
    address ||
    pathname == '/sign-in' ||
    pathname == '/sign-up'
  ) {
    return null;
  }

  return (
    <button
      className="flex items-center justify-center gap-2.5 bg-transparent hover:bg-[#1CBBBC] px-12 md:px-6 py-2 rounded-full md:mr-8 border border-white hover:border-[#1CBBBC]"
      onClick={onClick}
    >
      <p className="text-base md:text-lg font-chakra font-bold text-white uppercase">Login</p>
    </button>
  );
};

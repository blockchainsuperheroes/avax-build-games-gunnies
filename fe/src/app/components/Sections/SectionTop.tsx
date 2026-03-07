'use client';

import { ROUTES } from '@/app/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/app/providers/GlobalProvider';
import { ModalGeneral } from '../container';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginResultView } from './LoginResultView';
import PlatformSelectModal from '../PlatformSelectModal';
import { EXTERNAL_LINK } from '@/app/constants/external_link';
import { useInView } from 'react-intersection-observer';
import ModalOverlay from '../common/ModalOverlay';

const DownloadModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      className="md:max-w-[1200px] bg-transparent"
      isShowCloseButton
    >
      <div className="relative bg-transparent w-full flex flex-col items-center">
        {/* Banner image */}
        <div className="relative flex items-center justify-center w-full mb-4 h-full max-h-[630px]">
          <Image
            src="/images/gcc-promo-banner.png"
            alt="Gunnies NFT Cards"
            width={984}
            height={630}
            className="rounded-lg"
            priority
          />
        </div>

        {/* Buttons below image */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-center w-full max-w-[600px]">
          {/* Download Now Button */}
          <Link
            href={ROUTES.DOWNLOAD}
            className="flex items-center justify-center border border-white rounded-lg px-6 py-4 transition-colors w-full md:w-auto min-w-[368px] h-[64px]"
          >
            <span className="text-white uppercase font-semibold text-sm md:text-xl font-chakra">
              DOWNLOAD NOW
            </span>
          </Link>
        </div>
      </div>
    </ModalOverlay>
  );
};

const SectionTop = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { isBannerModalOpen, hideBannerModal, showBannerModal, handleEnterNow } =
    useGlobalContext();
  const [isShowOpenSpatial, setIsShowOpenSpatial] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasBannerBeenInView, setHasBannerBeenInView] = useState(false);

  const { showKaboomPassModal } = useGlobalContext();

  // Use react-intersection-observer to detect when banner scrolls out of view
  const { ref: bannerRef, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  const onViewSpatialPreview = () => {
    console.log('onViewSpatialPreview');
    showBannerModal();
  };

  useEffect(() => {
    const showOpenSpatial = params?.get('show-open-spatial');
    if (showOpenSpatial) {
      setIsShowOpenSpatial(true);
      router.replace('/');
    }
  }, []);

  const onOpenSpatialView = () => {
    setIsShowOpenSpatial(false);
    handleEnterNow();
  };

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 4); // 4 slides for mobile, but desktop will use Math.floor(currentSlide / 2)
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Track if banner has been in view at least once
  useEffect(() => {
    if (inView && !hasBannerBeenInView) {
      setHasBannerBeenInView(true);
    }
  }, [inView, hasBannerBeenInView]);

  // Show KaboomPassModal when banner scrolls out of view (only after it was in view first)
  useEffect(() => {
    // Check if modal was already shown in this session
    const hasShownModal = sessionStorage.getItem('kaboomPassModalShown');
    if (hasShownModal) {
      return;
    }

    // Only trigger modal if:
    // 1. Banner was previously in view (hasBannerBeenInView is true)
    // 2. Banner is now out of view (inView is false)
    if (hasBannerBeenInView && !inView) {
      showKaboomPassModal();
      sessionStorage.setItem('kaboomPassModalShown', 'true');
    }
  }, [inView, hasBannerBeenInView, showKaboomPassModal]);

  return (
    <>
      <section className="relative bg-black pb-4 lg:pb-20 xl:pb-0">
        <div className="relative" ref={bannerRef}>
          <Image
            src="/images/season-1.png"
            alt="logo"
            width={1906}
            height={834}
            className="w-full h-[250px] md:w-[1906px] md:h-[834px]"
          />
          <div className="absolute -bottom-6 md:-bottom-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
            <Link
              href={ROUTES.DOWNLOAD}
              className="flex items-center justify-center group hover:opacity-90 transition-opacity z-10"
            >
              {/* Gradient border wrapper */}
              <div
                className="relative rounded-full pb-[2px]"
                style={{
                  background: 'linear-gradient(90deg, #F1AC26 0%, #DE3327 100%)',
                }}
              >
                {/* Inner black background */}
                <div className="relative flex items-center justify-center bg-black rounded-full px-6 py-1.5 md:px-12 md:py-4 overflow-visible md:h-[76px]">
                  <span className="text-white uppercase tracking-wide whitespace-nowrap font-sora text-xs md:text-[26px] font-semibold">
                    DOWNLOAD THE GAME NOW
                  </span>
                </div>
              </div>
            </Link>

            <p className="text-xs md:text-base font-semibold font-sora text-white text-center mt-2 md:mt-8">
              Sponsored by Sakle Network and Avalanche
            </p>
          </div>
        </div>

        <section className="relative pt-10">
          <div
            className=" text-white
    text-center
    max-w-[337px]
    lg:max-w-[1300px]
    mx-auto w-full"
          >
            <h2 className="linear-grad1 font-bold text-[28px] lg:text-[60px] leading-tight lg:leading-[4rem]">
              SEASON 1 IS LIVE!
              <br />
              SURVIVE THE HORDE
            </h2>
            <div className="font-sora text-sm lg:text-xl my-2 lg:uppercase lg:max-w-[973px] lg:leading-[2.5rem] mx-auto">
              Gunnies is a zany, explosive and chaotic fast-paced third-person shooter combining
              PvPvE deathmatches, dodging traps, surviving hazards, and battling waves of zombified
              bunnies!
            </div>
            <div className="flex flex-row gap-6 mx-auto mt-4 lg:mt-8 mb-6 lg:mb-12 items-center justify-center">
              <Link
                href={ROUTES.CURRENT_EVENT}
                className="flex justify-center items-center rounded-lg bg-[#1CBBBC] w-full lg:w-[460px] h-16 lg:h-[90px] transition-transform duration-200 hover:scale-95"
              >
                <p className="text-black text-lg lg:text-2xl font-chakra uppercase text-center font-semibold">
                  Learn more
                </p>
              </Link>
              {/* <div
                onClick={onViewSpatialPreview}
                className="flex justify-center items-center cursor-pointer rounded-lg bg-[#FFA83D] w-full lg:w-[460px] h-16 lg:h-[90px] transition-transform duration-200 hover:scale-95"
              >
                <p className="text-black text-lg lg:text-2xl cursor-pointer font-chakra uppercase text-center font-semibold">
                  Halloween PenXR Spatial!
                </p>
              </div> */}
            </div>

            <div className="mt-4 md:mt-20">
              <p className="text-[#1CBBBB] text-[28px] lg:text-[58px] font-chakra uppercase text-center mb-4 md:mb-8 font-bold">
                Boom-Boom Bulletin
              </p>

              {/* Slider Container */}
              <div className="relative overflow-hidden">
                {/* Mobile View - Individual Cards */}
                <div className="md:hidden">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {/* Mobile Slide 1: Epic Games */}
                    <div className="w-full flex-shrink-0">
                      <div className="flex justify-center">
                        <div className="flex items-center justify-center gap-4 h-[130px] rounded-2xl border border-white relative p-4 w-full max-w-[400px]">
                          <div className="flex flex-col items-start justify-between h-full flex-1">
                            <div className="mb-2">
                              <p className="text-white uppercase font-chakra text-sm font-semibold leading-tight text-left">
                                GUNNIES IS NOW LIVE ON EPIC GAMES
                              </p>
                            </div>
                            <Link
                              href={EXTERNAL_LINK.EPIC}
                              target="_blank"
                              className="bg-[#FFA83D] hover:bg-[#E89735] transition-colors rounded-lg px-3 py-1.5 text-white uppercase font-chakra font-semibold text-sm"
                            >
                              PLAY NOW
                            </Link>
                          </div>
                          <div className="flex items-center justify-center">
                            <Image
                              src="/images/epic.png"
                              alt="Epic Games"
                              width={90}
                              height={100}
                              className="w-[90px] h-auto"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Slide 2: Steam */}
                    <div className="w-full flex-shrink-0">
                      <div className="flex justify-center">
                        <div className="flex items-center justify-center gap-4 h-[130px] rounded-2xl border border-white relative p-4 w-full max-w-[400px]">
                          <div className="flex flex-col items-start justify-between h-full flex-1">
                            <div className="mb-2">
                              <p className="text-white uppercase font-chakra text-sm font-semibold leading-tight text-left">
                                ADD GUNNIES TO WISHLIST ON STEAM
                              </p>
                            </div>
                            <Link
                              href={EXTERNAL_LINK.STEAM}
                              target="_blank"
                              className="bg-[#FFA83D] hover:bg-[#E89735] transition-colors rounded-lg px-3 py-1.5 text-white uppercase font-chakra font-semibold text-sm"
                            >
                              ADD NOW
                            </Link>
                          </div>
                          <div className="flex items-center justify-center">
                            <Image
                              src="/images/steam-icon.png"
                              alt="Steam"
                              width={90}
                              height={90}
                              className="w-[90px] h-auto"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Slide 3: NFT Cards */}
                    <div className="w-full flex-shrink-0">
                      <div className="flex justify-center">
                        <div className="bg-[url('/images/banner-play-more.png')] bg-cover bg-center flex items-center justify-center gap-4 bg-no-repeat h-[130px] rounded-2xl border border-white relative w-full max-w-[400px]">
                          <div className="w-[132px] h-[87px]">
                            <Image
                              src="/images/cards-shards.png"
                              alt="List card"
                              width={132}
                              height={87}
                              className="w-[132px] h-[87px]"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col absolute bottom-1/2 translate-y-1/2 right-3 w-[55%]">
                              <p
                                className="text-white text-[11px] md:text-[13px] uppercase font-bold"
                                style={{
                                  textShadow:
                                    '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                }}
                              >
                                UNLOCK PERKS WITH GUNNIES CHARACTER NFT CARDS
                              </p>
                              <p
                                className="text-white text-[7px] md:text-[12px] uppercase"
                                style={{
                                  textShadow:
                                    '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                }}
                              >
                                Collect & Upgrade for unique characters, powerful abilities, and
                                rare cosmetics.
                              </p>
                              <button
                                onClick={() => setIsDownloadModalOpen(true)}
                                className="bg-[#FFA83D] hover:bg-[#E89735] transition-colors rounded-lg px-3 py-1.5 text-white uppercase font-chakra font-semibold text-[8px] md:text-sm w-[100px] mt-2 mx-auto"
                              >
                                LEARN MORE
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Slide 4: Halloween Spatial */}
                    <div className="w-full flex-shrink-0">
                      <div className="flex justify-center">
                        <div
                          id="halloween-spatial-mobile"
                          className="bg-[url('/images/halloween/banner.png')] bg-cover bg-center flex items-center justify-center gap-4 bg-no-repeat h-[130px] rounded-2xl border border-white relative w-full max-w-[400px]"
                        >
                          <div className="flex-1">
                            <div className="flex flex-col absolute bottom-1/2 translate-y-1/2 right-3 w-[45%]">
                              <p
                                className="text-white text-[11px] uppercase font-bold"
                                style={{
                                  textShadow:
                                    '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                }}
                              >
                                Spooky November Arrives. Experience the Spatial & Play to Win.
                              </p>
                              <button
                                className="bg-[#FFA83D] px-4 py-1.5 rounded-lg mt-2 w-fit mx-auto"
                                onClick={onViewSpatialPreview}
                              >
                                <p className="text-white text-[8px] font-chakra uppercase font-semibold">
                                  Enter Now
                                </p>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop View - Two Cards Per Slide */}
                <div className="hidden md:block">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${Math.floor(currentSlide / 2) * 100}%)` }}
                  >
                    {/* Desktop Slide 1: Platform Sections */}
                    <div className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-[626px_626px] gap-8 justify-center">
                        {/* Epic Games Section */}
                        <div className="flex items-center justify-center gap-4 h-[268px] rounded-2xl border border-white relative p-10">
                          <div className="flex flex-col items-start justify-between h-full flex-1">
                            <div className="mb-5">
                              <p className="text-white uppercase font-chakra text-[28px] font-semibold leading-tight mb-2 text-left">
                                GUNNIES IS NOW LIVE ON EPIC GAMES
                              </p>
                            </div>
                            <Link
                              href={EXTERNAL_LINK.EPIC}
                              target="_blank"
                              className="bg-[#FFA83D] hover:bg-[#E89735] transition-colors rounded-lg px-6 py-4 text-white uppercase font-chakra font-semibold text-2xl w-[224px]"
                            >
                              PLAY NOW
                            </Link>
                          </div>
                          <div className="flex items-center justify-center">
                            <Image
                              src="/images/epic.png"
                              alt="Epic Games"
                              width={168}
                              height={187}
                              className="w-[168px] h-auto"
                            />
                          </div>
                        </div>

                        {/* Steam Section */}
                        <div className="flex items-center justify-center gap-4 h-[268px] rounded-2xl border border-white relative p-10">
                          <div className="flex flex-col items-start justify-between h-full flex-1">
                            <div className="mb-6">
                              <p className="text-white uppercase font-chakra text-[28px] font-semibold leading-tight mb-2 text-left">
                                ADD GUNNIES TO WISHLIST ON STEAM
                              </p>
                            </div>
                            <Link
                              href={EXTERNAL_LINK.STEAM}
                              target="_blank"
                              className="bg-[#FFA83D] hover:bg-[#E89735] transition-colors rounded-lg px-6 py-4 text-white uppercase font-chakra font-semibold text-2xl w-[224px]"
                            >
                              ADD NOW
                            </Link>
                          </div>
                          <div className="flex items-center justify-center">
                            <Image
                              src="/images/steam-icon.png"
                              alt="Steam"
                              width={168}
                              height={168}
                              className="w-[168px] h-auto"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Slide 2: Game Features */}
                    <div className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-[626px_626px] gap-8 justify-center">
                        <div className="bg-[url('/images/banner-play-more.png')] bg-cover bg-center flex items-center justify-center gap-4 bg-no-repeat h-[268px] rounded-2xl border border-white relative">
                          <div className="w-[273px] h-[199px]">
                            <Image
                              src="/images/cards-shards.png"
                              alt="List card"
                              width={273}
                              height={199}
                              className="w-[273px] h-[199px]"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col absolute bottom-1/2 translate-y-1/2 right-3 w-[55%]">
                              <p
                                className="text-white text-2xl uppercase font-bold"
                                style={{
                                  textShadow:
                                    '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                }}
                              >
                                UNLOCK PERKS WITH GUNNIES CHARACTER NFT CARDS
                              </p>
                              <p
                                className="text-white text-sm uppercase"
                                style={{
                                  textShadow:
                                    '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                }}
                              >
                                Collect & Upgrade for unique characters, powerful abilities, and
                                rare cosmetics.
                              </p>
                              <button
                                onClick={() => setIsDownloadModalOpen(true)}
                                className="bg-[#FFA83D] hover:bg-[#E89735] transition-colors rounded-lg px-6 py-2 text-white uppercase font-chakra font-semibold text-sm w-[143px] mt-4 mx-auto"
                              >
                                LEARN MORE
                              </button>
                            </div>
                          </div>
                        </div>

                        <div
                          id="halloween-spatial"
                          className="bg-[url('/images/halloween/banner.png')] bg-cover bg-center flex items-center justify-center gap-4 bg-no-repeat h-[268px] rounded-2xl border border-white relative"
                        >
                          <div className="flex-1">
                            <div className="flex flex-col absolute bottom-1/2 translate-y-1/2 right-3 w-[45%]">
                              <p
                                className="text-white text-2xl uppercase font-bold"
                                style={{
                                  textShadow:
                                    '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                                }}
                              >
                                Spooky November Arrives. Experience the Spatial & Play to Win.
                              </p>
                              <button
                                className="bg-[#FFA83D] px-4 py-1.5 rounded-lg mt-2 w-fit mx-auto"
                                onClick={onViewSpatialPreview}
                              >
                                <p className="text-white text-sm font-chakra uppercase font-semibold">
                                  Enter Now
                                </p>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center mt-6 md:mt-8 gap-3">
                {/* Mobile: 4 dots for 4 individual cards */}
                <div className="md:hidden flex gap-3">
                  {[0, 1, 2, 3].map(slideIndex => (
                    <button
                      key={slideIndex}
                      onClick={() => setCurrentSlide(slideIndex)}
                      className={`w-5 h-5 rounded-full transition-colors duration-300 ${
                        currentSlide === slideIndex
                          ? 'bg-[#1CBBBB]'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${slideIndex + 1}`}
                    />
                  ))}
                </div>

                {/* Desktop: 2 dots for 2 slides */}
                <div className="hidden md:flex gap-3">
                  {[0, 1].map(slideIndex => (
                    <button
                      key={slideIndex}
                      onClick={() => setCurrentSlide(slideIndex * 2)}
                      className={`w-5 h-5 rounded-full transition-colors duration-300 ${
                        Math.floor(currentSlide / 2) === slideIndex
                          ? 'bg-[#1CBBBB]'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Go to slide ${slideIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[#1CBBBB] text-[28px] lg:text-[58px] font-chakra uppercase text-center mb-4 md:mb-8 font-bold mt-4 md:mt-20">
              Gunnies FOR DUMMIES
            </p>

            {/* Multi-Chain Experience Section */}
            <div className="mt-8 lg:mt-12">
              {/* Header */}
              <div className="relative bg-[url('/images/banner-multichain.png')] bg-cover bg-center rounded-2xl p-6 lg:p-8 border border-[#606060] mb-8">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                    <h2 className="text-[#FFA83D] text-[32px] font-chakra uppercase font-bold mb-4 text-left">
                      A MULTI-CHAIN MAYHEM
                    </h2>
                    <p className="text-white text-sm lg:text-base leading-relaxed text-left">
                      Your Gunnies adventure isn't stuck on one chain. Hop across networks with your
                      loot and stats intact — the only thing you might lose is another gunfight.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full md:w-fit">
                    <Image
                      src="/images/badge-pg.png"
                      alt="PG"
                      width={240}
                      height={60}
                      className="w-full md:w-[240px] h-[60px]"
                    />
                    <Image
                      src="/images/badge-avax.png"
                      alt="Avalanche"
                      width={240}
                      height={62}
                      className="w-full md:w-[240px] h-[62px]"
                    />
                    <Image
                      src="/images/badge-core.png"
                      alt="Avalanche"
                      width={240}
                      height={62}
                      className="w-full md:w-[240px] h-[62px]"
                    />
                    <Image
                      src="/images/badge-pen.png"
                      alt="Pen"
                      width={240}
                      height={60}
                      className="w-full md:w-[240px] h-[60px]"
                    />
                  </div>
                </div>
              </div>

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* PVPVE Chaos */}
                <div className="bg-[url('/images/banner-pvpve-chaos.png')] bg-cover bg-center rounded-2xl p-9 border border-[#606060] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFA83D]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <h3 className="text-[#FFA83D] text-[32px] font-chakra uppercase font-bold mb-4 text-left">
                    PVPVE CHAOS
                  </h3>
                  <p className="text-white text-sm lg:text-base leading-relaxed text-left">
                    It's not just you vs. them. It's you vs. them vs. ZOMBIE BUNKERS. Dodge bullets,
                    survive waves, and secure the extraction.
                  </p>
                </div>

                {/* Kill Count Legacy */}
                <div className="bg-[url('/images/banner-kill-count-legacy.png')] bg-cover bg-center rounded-2xl p-9 border border-[#606060] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFA83D]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <h3 className="text-[#FFA83D] text-[32px] font-chakra uppercase font-bold mb-4 text-left">
                    KILL COUNT LEGACY
                  </h3>
                  <p className="text-white text-sm lg:text-base leading-relaxed text-left">
                    Your kills are tracked forever. Upgrade your character's visual aura by stacking
                    bodies. Flex your stats in the lobby.
                  </p>
                </div>

                {/* Daily Loot */}
                <div className="bg-[url('/images/banner-daily-loot.png')] bg-cover bg-center rounded-2xl p-9 border border-[#606060] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#FFA83D]/20 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
                  <h3 className="text-[#FFA83D] text-[32px] font-chakra uppercase font-bold mb-4 text-left">
                    DAILY LOOT
                  </h3>
                  <p className="text-white text-sm lg:text-base leading-relaxed text-left">
                    Log in. Get paid. Daily free loot boxes drop Coins, Gems, and rare Skill Cards.
                    Play Free, Earn Real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <ModalGeneral
        modalOpen={isShowOpenSpatial}
        modalBody={
          <LoginResultView
            onAction={onOpenSpatialView}
            onClose={() => setIsShowOpenSpatial(false)}
          />
        }
        modalTitle={undefined}
        modalDescription={undefined}
        setModalOpen={setIsShowOpenSpatial}
        theme="w-[calc(100vw-40px)] max-w-[400px] md:max-w-[444px] md:w-[444px] bg-transparent rounded-[20px]"
      />

      {/* Platform Selection Modal */}
      <PlatformSelectModal
        isOpen={isPlatformModalOpen}
        onClose={() => setIsPlatformModalOpen(false)}
        onSteamClick={() => {
          window.open(EXTERNAL_LINK.STEAM, '_blank');
        }}
        onEpicClick={() => {
          window.open(EXTERNAL_LINK.EPIC, '_blank');
        }}
      />

      {/* Download Modal */}
      <DownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </>
  );
};

export default SectionTop;

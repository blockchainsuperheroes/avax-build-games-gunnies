'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ModalDownload from '../components/common/ModalDownload';
import KaboomPassModal from '../components/quests/KaboomPassModal';
import { KaboomPassContentWithLogic } from '../components/quests/KaboomPassContent';
import { KnowYourRewardsContent } from '../components/quests/KnowYourRewardsContent';
import SectionEarlyAccess from '../components/Sections/SectionEarlyAccess';

export default function GetStartedPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [showKaboomModal, setShowKaboomModal] = useState(false);
  const router = useRouter();

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleWeb3LauncherClick = () => {
    setIsDownloadModalOpen(true);
  };

  const handleKaboomPassClick = () => {
    setShowKaboomModal(true);
  };

  const handleEarnRewardClick = () => {
    router.push('/quests');
  };

  const handleLeaderboardClick = () => {
    router.push('/leaderboard');
  };

  return (
    <section className="min-h-[calc(100dvh-300px)]">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-10 md:gap-[60px] py-4 md:py-24 mt-8">
          <div className="mt-6 md:mt-10 relative">
            {/* <Image
              className="absolute -bottom-36 -left-[20dvw]"
              width={725}
              height={881}
              src="/images/Gunny-Bros.png"
              alt="Gunny Bros"
            /> */}
            <Image
              className="absolute -bottom-20 -right-[25dvw]"
              width={760}
              height={902}
              src="/images/Flint.png"
              alt="Flint"
            />
            <p className="text-[#1CBBBB] text-sm md:text-2xl font-chakra uppercase text-center w-full font-bold">
              earn & redeem your way to victory.
            </p>
            <p className="text-[#1CBBBB] text-lg md:text-[58px] md:leading-[64px] font-chakra uppercase text-center w-full font-bold mt-2 mb-10">
              KNOW YOUR rewards
            </p>
            <div className="md:max-w-[1276px] mx-auto mt-6 md:mt-8 px-6 md:px-0">
              <KnowYourRewardsContent />
            </div>
          </div>
          {/* <Image
            width={375}
            height={210}
            src="/images/logo.png"
            alt="Gunnies logo"
            className="w-[196px] md:w-[375px] h-[111px] md:h-[210px]"
          />

          <Image
            width={180}
            height={64}
            src="/images/pgxp-logo-wide.svg"
            alt="Avalanche experience"
          />

          <div className="mt-6 md:mt-20">
            <p className="text-[#1CBBBB] text-xl md:text-[58px] md:leading-[64px] font-chakra uppercase text-center w-full font-bold">
              GUNNIES coming soon ON <br /> STEAM & Epic games
            </p>

            <div className="flex flex-row gap-6 md:gap-[100px] items-center justify-center mt-8 md:mt-16 px-6 md:px-0">
              <Image src="/images/steam.png" alt="Steam" width={385} height={125} />
              <Image src="/images/epic.png" alt="Epic Games" width={161} height={187} />
            </div>
          </div> */}

          {/* <div className="mt-6 md:mt-10">
            <p className="text-[#1CBBBB] text-sm md:text-2xl font-chakra uppercase text-center w-full font-bold">
              READY TO EXPERIENCE THE THRILL?
            </p>
            <p className="text-[#1CBBBB] text-lg md:text-[58px] md:leading-[64px] font-chakra uppercase text-center w-full font-bold mt-2">
              DOWNLOAD WEB3 LAUNCHER & <br /> READ THE GAME GUIDE
            </p>

            <div className="mt-6 md:mt-[42px] flex flex-col gap-4 md:gap-6 items-center justify-center">
              <div className="border-[3px] border-[#F77E1E] rounded-3xl bg-[#00000080] p-4 z-10">
                <div className="bg-[#1CBBBB] rounded-2xl flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 px-8 py-4 md:px-[28px] md:py-[37px] w-[309px] md:w-[814px]">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                    <Image width={40} height={40} src="/images/header/rocket.png" alt="Rocket" />
                    <p className="text-2xl md:text-[28px] font-semibold font-sora text-black">
                      Web3 Launcher
                    </p>
                  </div>

                  <button
                    className="flex items-center justify-center gap-2 hover:bg-[#27B2B2] p-4 rounded-lg"
                    onClick={handleWeb3LauncherClick}
                  >
                    <p className="text-xl font-semibold font-sora text-black uppercase">DOWNLOAD</p>
                    <Image width={28} height={28} src="/images/download.svg" alt="Download" />
                  </button>
                </div>
              </div>

              <div className="border-[3px] border-[#F77E1E] rounded-3xl bg-[#00000080] p-4 z-10">
                <div className="bg-[#1CBBBB] rounded-2xl flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 px-8 py-4 md:px-[28px] md:py-[37px] w-[309px] md:w-[814px]">
                  <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                    <Image
                      width={40}
                      height={40}
                      src="/images/download/game-guide.png"
                      alt="Rocket"
                    />
                    <p className="text-2xl md:text-[28px] font-semibold font-sora text-black">
                      Game Guide.pdf
                    </p>
                  </div>

                  <button
                    className="flex items-center justify-center gap-2 hover:bg-[#27B2B2] p-4 rounded-lg"
                    onClick={() => handleDownload('/downloads/game-guide.pdf', 'Game Guide.pdf')}
                  >
                    <p className="text-xl font-semibold font-sora text-black uppercase">DOWNLOAD</p>
                    <Image width={28} height={28} src="/images/download.svg" alt="Download" />
                  </button>
                </div>
              </div>
            </div>
          </div> */}

          <div className="mt-6 md:mt-20">
            <p className="text-[#1CBBBB] text-sm md:text-2xl font-chakra uppercase text-center w-full font-bold">
              IT'S EASY AS 1-2-3. ALL YOU NEED TO DO IS...
            </p>
            <p className="text-[#1CBBBB] text-lg md:text-[58px] md:leading-[64px] font-chakra uppercase text-center w-full font-bold mt-2">
              SHOOT ➔ LOOT ➔ REPEAT !!!
            </p>
          </div>

          {/* Three Cards Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-[1092px] mx-auto px-4 mt-6">
            {/* Card 1: SHOOT */}
            <div className="relative rounded-3xl overflow-hidden border-[3px] border-[#1CBBBB]">
              {/* Video/Image Section */}
              <div className="relative w-full aspect-video bg-black rounded-t-3xl overflow-hidden">
                <div className="relative">
                  <Image
                    src="/images/get-started/shoot.png"
                    alt="Shoot"
                    width={300}
                    height={300}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col items-center text-center justify-center [background:linear-gradient(180deg,#000000_0%,#0C303E_100%)]">
                <div>
                  <h3 className="text-white text-2xl font-bold font-chakra uppercase mb-4">
                    1. SHOOT
                  </h3>
                  <p className="text-white text-lg font-sora leading-relaxed">
                    Earn stars for each kill (limited per day). Kaboom Pass holders earn more stars!
                  </p>
                </div>

                <button
                  onClick={handleKaboomPassClick}
                  className="mt-5 bg-[#F77E1E] hover:bg-[#ff8f35] transition-colors py-2 rounded-xl w-full"
                >
                  <p className="text-white text-sm md:text-base font-bold font-sora uppercase">
                    WHAT IS KABOOM PASS?
                  </p>
                </button>
              </div>
            </div>

            {/* Card 2: LOOT */}
            <div className="relative rounded-3xl overflow-hidden border-[3px] border-[#FF69B4]">
              {/* Video/Image Section */}
              <div className="relative w-full rounded-t-3xl">
                <div className="relative">
                  <Image
                    src="/images/get-started/loot.png"
                    alt="Loot Chest"
                    width={300}
                    height={300}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col items-center text-center justify-center [background:linear-gradient(180deg,#000000_0%,#240B23_100%)]">
                <div>
                  <h3 className="text-white text-2xl font-bold font-chakra uppercase mb-4">
                    2. LOOT
                  </h3>
                  <p className="text-white text-lg font-sora leading-relaxed">
                    Every chest hides a surprise. Log in daily to claim exclusive gear and rewards!
                  </p>
                </div>

                <button
                  onClick={handleEarnRewardClick}
                  className="mt-5 bg-[#F77E1E] hover:bg-[#ff8f35] transition-colors py-2 rounded-xl w-full"
                >
                  <p className="text-white text-sm md:text-base font-bold font-sora uppercase">
                    CHECK OUT EARN REWARD
                  </p>
                </button>
              </div>
            </div>

            {/* Card 3: REPEAT */}
            <div className="relative rounded-3xl overflow-hidden border-[3px] border-[#4169E1]">
              {/* Video/Image Section */}
              <div className="relative w-full rounded-t-3xl">
                <div className="relative">
                  <Image
                    src="/images/get-started/repeat.png"
                    alt="Repeat"
                    width={300}
                    height={300}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col items-center text-center justify-center [background:linear-gradient(180deg,#000000_0%,#0C303E_100%)]">
                <div>
                  <h3 className="text-white text-2xl font-bold font-chakra uppercase mb-4">
                    3. REPEAT
                  </h3>
                  <p className="text-white text-lg font-sora leading-relaxed">
                    Have endless fun and earn more rewards. Play today & climb the leaderboard now.
                  </p>
                </div>

                <button
                  onClick={handleLeaderboardClick}
                  className="mt-5 bg-[#F77E1E] hover:bg-[#ff8f35] transition-colors py-2 rounded-xl w-full"
                >
                  <p className="text-white text-sm md:text-base font-bold font-sora uppercase">
                    CHECK OUT LEADERBOARD
                  </p>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 md:mt-20 relative">
            <p className="text-[#1CBBBB] text-sm md:text-2xl font-chakra uppercase text-center w-full font-bold">
              Unlock Mayhem. Dominate the Boom.
            </p>
            <p className="text-[#1CBBBB] text-lg md:text-[58px] md:leading-[64px] font-chakra uppercase text-center w-full font-bold mt-2 mb-10">
              MORE FUN WITH KABOOM PASS
            </p>
            <div className="md:scale-125 mt-6 md:mt-24">
              <KaboomPassContentWithLogic isHideButton />
            </div>
            <div className="flex justify-center mt-4 md:mt-16">
              <button
                className="bg-[#F77E1E] hover:bg-[#ff8f35] transition-colors py-8 rounded-xl w-full md:max-w-[600px]"
                onClick={handleKaboomPassClick}
              >
                <p className="text-white text-base md:text-2xl font-bold font-sora uppercase">
                  PURCHASE KABOOM pass
                </p>
              </button>
            </div>
          </div>

          {/* <div className="mt-6 md:mt-24 relative">
            <Image
              className="absolute -bottom-36 -left-[20dvw]"
              width={725}
              height={881}
              src="/images/Gunny-Bros.png"
              alt="Gunny Bros"
            />
            <p className="text-[#1CBBBB] text-sm md:text-2xl font-chakra uppercase text-center w-full font-bold">
              earn & redeem your way to victory.
            </p>
            <p className="text-[#1CBBBB] text-lg md:text-[58px] md:leading-[64px] font-chakra uppercase text-center w-full font-bold mt-2 mb-10">
              KNOW YOUR rewards
            </p>
            <div className="md:max-w-[1276px] mx-auto mt-6 md:mt-8 px-6 md:px-0">
              <KnowYourRewardsContent />
            </div>
          </div> */}
        </div>

        <div className="mt-6 md:mt-20">
          <SectionEarlyAccess />
        </div>
      </div>

      <ModalDownload isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
      <KaboomPassModal isOpen={showKaboomModal} onClose={() => setShowKaboomModal(false)} />
    </section>
  );
}

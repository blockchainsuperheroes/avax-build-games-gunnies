'use client';

import Image from 'next/image';
import { useState } from 'react';
import ModalDownload from '../components/common/ModalDownload';

export default function DownloadPage() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="min-h-[calc(100dvh-300px)]">
      <div className="flex flex-col items-center justify-center pt-10">
        <div className="flex flex-col items-center justify-center gap-[43px] py-12 md:py-24">
          <Image
            width={375}
            height={210}
            src="/images/logo.png"
            alt="Gunnies logo"
            className="w-[196px] md:w-[375px] h-[111px] md:h-[210px]"
          />

          <Image
            width={260}
            height={64}
            src="/images/pgxp-logo-wide.svg"
            alt="Avalanche experience"
          />
        </div>

        {/* <h2 className="text-base md:text-2xl text-center text-[#1CBBBB] font-chakra">
          READY TO EXPERIENCE THE THRILL?
        </h2> */}
        <h1 className="text-[28px] md:text-[58px] leading-[32px] md:leading-[64px] font-bold font-chakra uppercase text-center z-10 text-[#1CBBBB] w-2/3 mx-auto">
          BRAND KIT
        </h1>

        {/* <div className="flex flex-col items-center justify-center gap-5 md:gap-8 mt-6 md:mt-12 relative">
          <Image
            className="absolute -left-20 md:-left-72 -top-16 md:-top-48 z-0 w-[223px] md:w-[444px] h-[181px] md:h-[359px]"
            src="/images/air-drop.png"
            width={444}
            height={359}
            alt="Airdrop"
          />

          <p className="text-2xl md:text-3xl font-sora text-center text-white z-10">For Gamers</p>

          <div className="border-[3px] border-[#F77E1E] rounded-3xl bg-[#00000080] p-4 z-10">
            <div
              className="bg-[#1CBBBB] rounded-2xl flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 px-8 py-4 md:px-[28px] md:py-[37px] w-[309px] md:w-[814px]"
            >
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                <Image width={40} height={40} src="/images/header/rocket.png" alt="Rocket" />
                <p className="text-2xl md:text-[28px] font-semibold font-sora text-black">
                  Web3 Launcher
                </p>
              </div>

              <button className="flex items-center justify-center gap-2 hover:bg-[#27B2B2] p-4 rounded-lg" 
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
                <Image width={40} height={40} src="/images/download/game-guide.png" alt="Rocket" />
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
        </div> */}

        <div className="flex flex-col items-center justify-center gap-5 md:gap-8 mt-12 md:mt-24 z-10">
          <p className="text-2xl md:text-3xl font-sora text-center text-white">Brand Assets</p>

          <div className="border-[3px] border-[#F77E1E] rounded-3xl bg-[#00000080] p-4 relative">
            <Image
              className="absolute -left-20 md:-left-72 -top-16 md:-top-48 z-0 w-[223px] md:w-[444px] h-[181px] md:h-[359px]"
              src="/images/air-drop.png"
              width={444}
              height={359}
              alt="Airdrop"
            />
            <div className="bg-[#1CBBBB] rounded-2xl flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 px-8 py-4 md:px-[28px] md:py-[37px] w-[309px] md:w-[814px] relative z-50">
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                <Image width={40} height={40} src="/images/download/logo-assets.png" alt="Rocket" />
                <p className="text-2xl md:text-[28px] font-semibold font-sora text-black">
                  Logo Assets <span className="block md:inline-block">(PNG, SVG)</span>
                </p>
              </div>

              <button
                className="flex items-center justify-center gap-2 hover:bg-[#27B2B2] p-4 rounded-lg"
                onClick={() =>
                  handleDownload('/downloads/logo-assets.zip', 'Logo Assets (PNG, SVG).zip')
                }
              >
                <p className="text-xl font-semibold font-sora text-black uppercase">DOWNLOAD</p>
                <Image width={28} height={28} src="/images/download.svg" alt="Download" />
              </button>
            </div>
          </div>

          <div className="border-[3px] border-[#F77E1E] rounded-3xl bg-[#00000080] p-4">
            <div className="bg-[#1CBBBB] rounded-2xl flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 px-8 py-4 md:px-[28px] md:py-[37px] w-[309px] md:w-[814px]">
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                <Image width={40} height={40} src="/images/download/game-guide.png" alt="Rocket" />
                <p className="text-2xl md:text-[28px] font-semibold font-sora text-black">
                  Logo Guideline.pdf
                </p>
              </div>

              <button
                className="flex items-center justify-center gap-2 hover:bg-[#27B2B2] p-4 rounded-lg"
                onClick={() => handleDownload('/downloads/logo-guide.pdf', 'Logo Guideline.pdf')}
              >
                <p className="text-xl font-semibold font-sora text-black uppercase">DOWNLOAD</p>
                <Image width={28} height={28} src="/images/download.svg" alt="Download" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <p className="text-center text-[10px] md:text-xs font-sora font-light w-full md:w-[600px] mx-auto mt-24 px-8 md:px-0">
        "DISCLAIMER: THE GUNNIES ROADMAP REFLECTS OUR CURRENT PLANS BUT MAY CHANGE BASED ON
        DEVELOPMENT PROGRESS AND COMMUNITY FEEDBACK."
      </p> */}

      {/* Download Modal */}
      <ModalDownload isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
    </section>
  );
}

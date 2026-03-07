'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '../constants/routes';
import SectionEarlyAccess from '../components/Sections/SectionEarlyAccess';

export default function Season1Page() {
  return (
    <section className="min-h-[calc(100dvh-300px)]">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-10 md:gap-[60px] py-12 md:py-24 mt-16 px-4">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-4 md:gap-6 mt-16 md:mt-[600px]">
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
            /> */}

            <div className="text-center mt-6 md:mt-10">
              <p className="linear-grad1 text-4xl md:text-[60px] md:leading-[66px] font-chakra uppercase font-bold">
                Season 1 IS LIVE NOW!
              </p>
              <p className="text-white text-base md:text-xl font-sora mt-4 md:mt-6 max-w-4xl">
                HERE IS THE SIMPLE, DIRECT GUIDE TO EVERYTHING YOU NEED TO KNOW TO COMPETE, WIN, AND
                CLAIM YOUR SHARE OF THE $3,000 PRIZE POOL
              </p>
            </div>
          </div>

          {/* Content Cards Grid */}
          <div className="grid grid-cols-1 gap-6 lg:gap-12 max-w-[600px] mx-auto w-full mt-2 px-2 md:px-0">
            {/* Card 1: Important Dates & Rules */}
            <div className="relative rounded-2xl overflow-hidden border border-[#FF8F00] bg-[#00000066] p-4 md:p-9">
              <h3 className="text-[#FF8F00] text-xl md:text-[28px] font-medium font-chakra mb-4 md:mb-[30px]">
                🗓️ Important Dates & Rules
              </h3>
              <div className="space-y-1.5 text-[#FFFFFFCC] font-sora">
                <div>
                  <span className="font-bold text-base md:text-xl">Season Duration:</span> 6 weeks
                </div>
                <div className="text-base text-[#FFFFFFCC]">
                  Start: <span className="text-[#FF8F00]">January 16, 2026, 2PM UTC</span>
                </div>
                <div className="text-base text-[#FFFFFFCC]">
                  End: <span className="text-[#FF8F00]">March 18, 2026, 2PM UTC</span>
                </div>
              </div>
              <div className="mt-5">
                <span className="font-bold text-base md:text-lg text-[#FF8F00]">
                  To be eligible for prizes, you must keep this in mind:
                </span>
                <ol className="list-none mt-1.5 space-y-1.5 text-[#FFFFFFCC] font-sora">
                  <li className="flex gap-2 text-sm md:text-base">
                    <p className="text-[#FF8F00] w-5 flex-shrink-0">1.</p> Your Avalanche Games
                    account must have a wallet connected.
                  </li>
                  <li className="flex gap-2 text-sm md:text-base">
                    <p className="text-[#FF8F00] w-5 flex-shrink-0">2.</p> Make sure your social
                    media accounts are connected to your Avalanche Games profile.
                  </li>
                  <li className="flex gap-2 text-sm md:text-base">
                    <p className="text-[#FF8F00] w-5 flex-shrink-0">3.</p> We will run a "humanity
                    check" before distributing prizes to filter out bots and fake accounts.
                  </li>
                </ol>
              </div>
            </div>

            {/* Card 2: How to Qualify for the Leaderboard */}
            <div className="relative rounded-2xl overflow-hidden border border-[#FF8F00] bg-[#00000066] p-4 md:p-9">
              <div className="mb-4 md:mb-[30px] space-y-4">
                <h3 className="text-[#FF8F00] text-xl md:text-[28px] font-medium font-chakra">
                  🏆 How to Qualify for the Leaderboard
                </h3>

                <div className="flex items-center justify-start text-xs md:text-xl font-bold font-sora gap-1 md:gap-2">
                  <p className="text-[#FFFFFFCC] font-sora">Your goal is simple: get</p>
                  <Image
                    src="/images/quests/star-circle.png"
                    alt="Stars"
                    width={21}
                    height={24}
                    className="w-4 h-4 md:w-6 md:h-6"
                  />
                  <p className="text-[#FFFFFFCC] font-sora">to determine rank.</p>
                </div>
              </div>

              <div>
                <p className="text-[#FFFFFFCC] font-sora">
                  Stars decide your rank on the leaderboard. You have two ways to get them:
                </p>

                <div className="mt-5">
                  <p className="text-[#FF8F00] font-bold text-base md:text-lg">
                    1. 🔥 Playing "Chaos Mode":
                  </p>
                  <p className="text-[#FFFFFFCC] font-sora">
                    This is where you show your skill. You earn Stars for every kill you make:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 ml-2 text-white font-sora marker:text-[#FF8F00]">
                    <li>
                      {' '}
                      <span className="text-[#FF8F00]">Regular Players:</span> Earn 5 Stars per kill
                      (limit of 3 matches per day)
                    </li>
                    <li>
                      {' '}
                      <span className="text-[#FF8F00]">Kaboom Pass Holders:</span> Earn 5 Stars per
                      kill (limit of 6 matches per day)
                    </li>
                  </ul>
                </div>

                <div className="mt-5">
                  <p className="text-[#FF8F00] font-bold text-base md:text-lg">
                    2. 🧱 Opening Chests:
                  </p>
                  <p className="text-[#FFFFFFCC] font-sora">
                    Every day, you can open free chests on the Avalanche and Avalanche networks. These chests
                    can give you various rewards, including Stars (from 5-40). More chests = more
                    Stars!
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: The Prizes */}
            <div className="relative rounded-2xl overflow-hidden border border-[#FF8F00] bg-[#00000066] p-4 md:p-9">
              <h3 className="text-[#FF8F00] text-xl md:text-[28px] font-medium font-chakra mb-4 md:mb-[30px]">
                💰The Prizes
              </h3>

              <p className="text-[#FFFFFFCC] font-sora mt-4">This is what's at stake:</p>
              <p className="text-[#FFFFFFCC] font-sora text-base md:text-xl font-bold uppercase">
                Total: ~$3,000 worth of prizes
              </p>

              <div className="mt-4 md:mt-[30px]">
                <p className="text-[#FFFFFFCC] font-sora">The pool is split like this:</p>
                <ol className="list-none mt-5 space-y-1.5 font-sora text-sm md:text-base">
                  <li className="flex gap-2 text-[#FF8F00] text-sm md:text-base">
                    <p className="w-5 flex-shrink-0">1.</p> 100,000 $SKL (Avalanche Token)
                  </li>
                  <li className="flex gap-2 text-[#FF8F00] text-sm md:text-base">
                    <p className="w-5 flex-shrink-0">2.</p> 20 $PC (Avalanche Token)
                  </li>
                  <li className="flex gap-2 text-[#FF8F00] text-sm md:text-base">
                    <p className="w-5 flex-shrink-0">3.</p> $500 USDT
                  </li>
                  <li className="flex gap-2 text-[#FF8F00] text-sm md:text-base">
                    <p className="w-5 flex-shrink-0">4.</p> 20 Premium Kaboom NFTs (valued at $50
                    each)
                  </li>
                </ol>
              </div>
            </div>

            {/* Card 4: Prize Distribution */}
            <div className="relative">
              <Image
                className="hidden md:block absolute bottom-8 -right-[40dvw]"
                width={760}
                height={902}
                src="/images/Flint.png"
                alt="Flint"
              />
              <div className="relative rounded-2xl overflow-hidden border border-[#FF8F00] bg-[#00000066] p-4 md:p-9">
                <h3 className="text-[#FF8F00] text-xl md:text-[28px] font-medium font-chakra mb-4">
                  🥳 Prize Distribution
                </h3>

                <p className="text-[#FFFFFFCC] font-sora text-base mt-[30px]">
                  The Pool prize split:{' '}
                </p>

                <hr className="my-[30px] border-[#FFFFFFCC] border-t" />

                <div>
                  <p className="text-white font-sora text-xl">100,000 $SKL + 20 $PC + $500 USDT</p>
                  <div className="flex items-center gap-4 mt-3">
                    <p className="text-[#FFFFFFCC] font-sora text-base">
                      $3,000 worth of prizes, please refer to the leaderboard for more details
                    </p>

                    <Link
                      href={ROUTES.LEADERBOARD}
                      className="py-2 px-5 font-chakra text-sm font-semibold bg-[#FFA83D] text-white rounded-md min-w-[127px] text-center"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>

                <hr className="my-[30px] border-[#FFFFFFCC] border-t" />

                <p className="text-white font-sora text-xl mt-[30px] font-bold">
                  20 Premium Kaboom NFTs
                </p>

                <div className="mt-5 border border-[#FF8F00CC] rounded-xl p-6">
                  <div className="flex items-center gap-2 justify-between pb-2 mb-2">
                    <p className="text-[#FF8F00CC] font-sora text-base">Top 10 Players</p>
                    <p className="text-white font-sora text-base">10</p>
                  </div>
                  <hr className="py-2 border-[#4E4E4E] border-t" />
                  <div className="flex items-center gap-2 justify-between">
                    <p className="text-[#FF8F00CC] font-sora text-base">Top 11 to 50 Players (Raffle Winners)</p>
                    <p className="text-white font-sora text-base">10</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: What is the "Kaboom Pass"? */}
          <div className="relative">
            <Image
              className="hidden md:block absolute -bottom-36 -left-[40dvw]"
              width={725}
              height={881}
              src="/images/Gunny-Bros.png"
              alt="Gunny Bros"
            />

            <div className="rounded-2xl overflow-hidden border border-[#FF8F00] bg-[#00000066] p-4 md:p-9 max-w-[600px] w-full mt-2 mx-auto">
              {/* Header Section */}
              <h3 className="text-[#FF8F00] text-xl md:text-[28px] font-bold font-chakra">
                💣 What is the "Kaboom Pass"?
              </h3>
              <p className="text-[#FF8F00] text-lg md:text-xl lg:text-[28px] font-bold font-chakra mt-1">
                Is it worth it?
              </p>

              {/* Main Description */}
              <p className="text-[#FFFFFFE5] font-bold font-sora text-base md:text-xl mt-4 mb-4 md:mb-[30px]">
                The Kaboom Pass is the official seasonal NFT for Gunnies Season 1
              </p>

              {/* Functions Section */}
              <p className="text-[#FFFFFFCC] font-sora mb-4 text-sm md:text-base">
                It provides three main functions:
              </p>

              <ol className="list-none space-y-2 md:space-y-4 text-[#FFFFFFCC] font-sora text-sm md:text-base">
                <li className="flex gap-2 text-sm md:text-base text-[#FFFFFFCC] font-sora">
                  <span className="text-[#FF8F00] w-6 flex-shrink-0 font-bold">1.</span>
                  <span>
                    It helps you earn Stars faster in Chaos Mode, which is how you climb the
                    leaderboard.
                  </span>
                </li>
                <li className="flex gap-2 text-sm md:text-base text-[#FFFFFFCC] font-sora">
                  <span className="text-[#FF8F00] w-6 flex-shrink-0 font-bold">2.</span>
                  <span>
                    It unlocks 5 extra daily chests on the network where you bought it (either Avalanche
                    or Avalanche). This gives you more chances to get Stars from chests.
                  </span>
                </li>
                <li className="flex gap-2 text-sm md:text-base text-[#FFFFFFCC] font-sora">
                  <span className="text-[#FF8F00] w-6 flex-shrink-0 font-bold">3.</span>
                  <div className="flex-1">
                    <span className="text-[#FFFFFFCC] font-sora">
                      It makes you eligible for an extra set of prizes. Think of the prize pool as
                      having two parts: a "Standard" prize and a "Bonus" prize.
                    </span>
                    <ul className="list-none mt-2 space-y-2 md:space-y-4 text-sm md:text-base">
                      <li className="flex gap-2 text-[#FFFFFFCC] font-sora text-sm md:text-base">
                        <span className="text-[#FFFFFF66] flex-shrink-0">-</span>
                        <span>
                          If you finish in a winning rank without the pass, you receive the Standard
                          prize.
                        </span>
                      </li>
                      <li className="flex gap-2 text-[#FFFFFFCC] font-sora text-sm md:text-base">
                        <span className="text-[#FFFFFF66] flex-shrink-0">-</span>
                        <span>
                          If you finish in that same rank with the pass, you receive the Standard
                          prize PLUS the Bonus prize.
                        </span>
                      </li>
                    </ul>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-6 md:mt-20">
            <SectionEarlyAccess />
          </div>
        </div>
      </div>
    </section>
  );
}

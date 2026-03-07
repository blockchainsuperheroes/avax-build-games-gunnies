import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Page() {
  return (
    <main className="min-h-[calc(100dvh_-_64px)] bg-black text-white ">
      <SectionSteam />
    </main>
  );
}

/* ----------------- SectionSteam (Parent Component) ----------------- */
function SectionSteam() {
  return (
    <section
      className="z-1 relative mt-10 lg:mt-32  mx-auto
        max-w-[341px] lg:max-w-[1200px] lg:mx-auto "
    >
      <Image
        src={'/images/gunny-greyed.svg'}
        alt="logo"
        width={712}
        height={71}
        className="absolute w-[228px] lg:w-[712px] top-[80%] left-1/2 lg:-top-[0%] -translate-x-1/2 translate-y-0 max-w-none opacity-50 z-0"
      />

      <div className="mx-auto">
        <TitleLine />
        <div className="flex flex-col lg:flex-row gap-4 mt-4 lg:justify-center">
          <SteamWishlist />
          <PlayerCommunity />
        </div>
      </div>
    </section>
  );
}

/* ----------------- Sub-Component: Title Line ----------------- */
function TitleLine() {
  return (
    <div
      className="
        font-bold
        text-main-green
        text-[28px]
        lg:text-[58px]
        lg:leading-[4rem]
        lg:text-center
        lg:mx-auto
        max-w-[850px]
        mb-12
      "
    >
      <span>GUNNIES GAME PAGE IS NOW LIVE ON </span>
      <Image
        src="/images/logo-steam.png"
        alt="Steam logo"
        width={45}
        height={71}
        className="inline relative align-middle -top-[0.2rem]"
      />
      <span> STEAM!</span>
    </div>
  );
}

/* ----------------- Sub-Component: SteamWishlist ----------------- */
function SteamWishlist() {
  return (
    <div className="relative z-10">
      <Image
        src="/images/add-to-steam.png"
        alt="Steam logo"
        width={538}
        height={71}
        className="mx-auto"
      />

      <div className="flex flex-col lg:flex-row gap-4 mt-10">
        {/* Add to Steam Wishlist */}
        <div className="flex flex-col lg:items-center uppercase">
          <h4 className="text-[20px] font-bold lg:font-medium mb-2 font-sora">
            Add to STEAM Wishlist
          </h4>
          <Link
            className="
              border border-white/50
              rounded-lg
              w-full lg:w-[258px]
              flex
              px-4 py-2
              lg:flex-col
              lg:pt-0
              lg:pb-2
              lg:px-0
              items-center
              justify-between
              font-sora
              transition-colors transition-transform duration-200
                  hover:border-none 
                  hover:bg-main-green 
                  hover:scale-95
                  hover:shadow-lg
            "
            href="https://store.steampowered.com/app/3323030/Gunnies"
            target="_blank"
          >
            <Image
              src="/images/steam.svg"
              alt="Steam logo"
              width={45}
              height={71}
              className="lg:mx-auto my-0 lg:my-2 lg:pb-2"
            />
            <span className="font-sora text-xs">Add to STEAM Wishlist</span>
          </Link>
        </div>

        {/* Gunnies X */}
        <div className="flex flex-col lg:items-center uppercase">
          <h4 className="text-[20px] font-bold lg:font-medium mb-2 font-sora">GUNNIES X</h4>
          <Link
            className="
              border border-white/50
              rounded-lg
              w-full lg:w-[258px]
              flex
              px-4 py-2
              lg:flex-col
              lg:pt-0
              lg:pb-2
              lg:px-0
              items-center
              justify-between
              font-sora
              transition-colors transition-transform duration-200
                  hover:border-none 
                  hover:bg-main-green 
                  hover:scale-95
                  hover:shadow-lg
            "
            href="https://x.com/GunniesXP"
            target="_blank"
          >
            <Image
              src="/images/x.svg"
              alt="X logo"
              width={45}
              height={71}
              className="lg:mx-auto my-0 lg:my-2 lg:pb-2"
            />
            <span className="font-sora text-xs">Gunnies X</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Sub-Component: PlayerCommunity ----------------- */
function PlayerCommunity() {
  return (
    <div className="relative z-10">
      <Image
        src="/images/live-on-steam.png"
        alt="Steam logo"
        width={538}
        height={71}
        className="mx-auto mt-5 lg:mt-0"
      />

      <div className="mt-10">
        <h4 className="text-[20px] font-bold lg:font-medium lg:text-center mb-2 font-sora">
          JOIN THE GUNNIES PLAYERS COMMUNITY
        </h4>

        <div className="flex flex-col lg:flex-row gap-4 mt-2">
          {/* Telegram Announcements */}
          <div className="flex flex-col lg:items-center uppercase">
            <Link
              className="
                border border-white/50
                rounded-lg
                w-full lg:w-[170px]
                flex
                px-4 py-4
                lg:flex-col
                lg:pt-0
                lg:pb-2
                lg:px-0
                items-center
                justify-between
                p-2
                font-sora
                 transition-colors transition-transform duration-200
                  hover:border-none 
                  hover:bg-main-green 
                  hover:scale-95
                  hover:shadow-lg
              "
              href="https://t.me/AvalancheGamesOfficial"
              target="_blank"
            >
              <Image
                src="/images/tg.svg"
                alt="Telegram logo"
                width={34}
                height={71}
                className="lg:mx-auto my-0 lg:my-3"
              />
              <span className="text-xs text-center">Telegram Announcements</span>
            </Link>
          </div>

          {/* Telegram Chat */}
          <div className="flex flex-col lg:items-center uppercase">
            <Link
              className="
                border border-white/50
                rounded-lg
                w-full lg:w-[170px]
                flex
                px-4 py-4
                lg:flex-col
                lg:pt-0
                lg:pb-2
                lg:px-0
                items-center
                justify-between
                p-2
                font-sora
                transition-colors transition-transform duration-200
                  hover:border-none 
                  hover:bg-main-green 
                  hover:scale-95
                  hover:shadow-lg
              "
              href="https://t.me/AvalancheGamesXP"
              target="_blank"
            >
              <Image
                src="/images/tg.svg"
                alt="Telegram logo"
                width={34}
                height={71}
                className="lg:mx-auto my-0 lg:my-3 lg:pb-4"
              />
              <span className="text-xs text-center">Telegram Chat</span>
            </Link>
          </div>

          {/* Discord */}
          <div className="flex flex-col lg:items-center uppercase">
            <Link
              className="
                border border-white/50
                rounded-lg
                w-full lg:w-[170px]
                flex
                px-4 py-4
                lg:flex-col
                lg:pt-0
                lg:pb-2
                lg:px-0
                items-center
                justify-between
                p-2
                font-sora
                transition-colors transition-transform duration-200
                  hover:border-none 
                  hover:bg-main-green 
                  hover:scale-95
                  hover:shadow-lg
              "
              href="https://discord.gg/avalanchegamesxp"
              target="_blank"
            >
              <Image
                src="/images/discord.svg"
                alt="Discord logo"
                width={36}
                height={71}
                className="lg:mx-auto my-0 lg:my-3 lg:pb-4"
              />
              <span className="text-xs text-center">Discord</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

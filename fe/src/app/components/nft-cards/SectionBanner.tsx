import React from 'react';
import Image from 'next/image';

export default function SectionBanner() {
  return (
    <div className="flex flex-col items-center justify-center pt-20">
      <Image
        width={210}
        height={118}
        src="/images/logo.png"
        alt="Gunnies logo"
        className="w-[196px] md:w-[210px] h-[111px] md:h-[118px]"
      />

      <h1 className="text-[36px] md:text-[60px] leading-[32px] md:leading-[64px] font-bold font-chakra uppercase text-white mb-4 mx-auto mt-2 md:mt-6">
        Gunnies NFT CardS
      </h1>

      <div>
        <p className="text-[#1CBBBB] text-[28px] md:text-[58px] md:leading-[64px] font-chakra font-bold text-center mt-4 md:mt-20 mb-5 md:mb-6 uppercase">
          LEVEL UP THE GAME WITH <br /> The Gunnies NFT Cards!
        </p>

        <Image
          width={800}
          height={534}
          src="/images/nft-cards/banner.png"
          alt="Gunnies NFT Cards"
          className="w-[348px] md:w-[800px] h-[232px] md:h-[534px]"
        />

        <p className="text-white text-base md:text-xl max-w-3xl mx-auto text-center mt-4 px-4">
          Gunnies is launching 7 new NFT character cards with a tiered upgrade system. Start with
          Standard cards and climb your way to the top.
        </p>
      </div>
    </div>
  );
}

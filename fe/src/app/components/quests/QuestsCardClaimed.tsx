'use client';

import React from 'react';

import Image from 'next/image';

function QuestsCardClaimed() {
  return (
    <div className="relative cursor-pointer">
      <Image
        className="w-[160px] h-[183px] md:w-[281px] md:h-[323px]"
        src="/images/quests/claimed-chest.png"
        alt="Quests card"
        width={281}
        height={323}
      />
      <p className="absolute bottom-1 md:bottom-4 left-1/2 transform -translate-x-1/2 translate-y-0 text-white text-base md:text-[26px] font-bold font-chakra">
        Claimed
      </p>
    </div>
  );
}

export default QuestsCardClaimed;

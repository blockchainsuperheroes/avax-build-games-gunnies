import React from 'react';
import Image from 'next/image';

function PrimeCard() {
  return (
    <div className="relative cursor-pointer">
      <Image
        className="w-[160px] md:w-[281px]"
        src="/images/quests/lock.png"
        alt="lock card"
        width={281}
        height={323}
      />
      <p className="absolute bottom-1 md:bottom-4 left-1/2 transform -translate-x-1/2 translate-y-0 text-[#FFA100] text-base md:text-[26px] font-bold font-chakra">
        Prime
      </p>
    </div>
  );
}

export default PrimeCard;

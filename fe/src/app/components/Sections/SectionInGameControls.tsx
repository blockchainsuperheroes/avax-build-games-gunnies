import React from 'react';

import Image from 'next/image';

function SectionInGameControls() {
  return (
    <div className="flex flex-col items-center gap-4 lg:gap-8 mt-8 lg:mt-[114px] relative px-6">
      <p className="text-2xl lg:text-[58px] font-chakra text-[#1CBBBB] uppercase text-center font-bold">
        IN-GAME CONTROLS
      </p>

       <Image
        src={'/images/kick-in-head-bg.png'}
        alt="Burning town"
        width={612}
        height={641}
        className="hidden xl:block absolute top-32 left-[13%] z-0"
      />

      <Image
        src={'/images/Burning-town.png'}
        alt="Burning town"
        width={720}
        height={405}
        className="hidden xl:block absolute top-[40%] right-4 scale-x-[-1] z-0"
      />

      <Image className='relative z-10' src="/images/in-game-controls.png" width={475} height={615} alt="In game controls" />
    </div>
  );
}

export default SectionInGameControls;

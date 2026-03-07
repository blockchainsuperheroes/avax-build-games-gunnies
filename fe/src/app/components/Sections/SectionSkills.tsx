import Image from 'next/image';
import GameItems from '@components/partials/GameItems';

export default function SectionSkills() {
  return (
    <section className="relative mt-32 lg:mt-[121px] mx-2">
      <Image
        src={'/images/Gunny-Bros.png'}
        alt="logo"
        width={444}
        height={71}
        className="absolute -top-[10rem]  w-1/2 lg:w-[444px] left-[20%] lg:-left-[4rem] max-w-none z-0"
      />

      <div className=" max-w-[341px] lg:max-w-[1097px] mx-auto">
        <h1 className="font-bold text-main-green leading-[2.2rem] lg:leading-[4rem] lg:text-center  lg:max-w-[1097] lg:mx-auto lg:my-8  text-[28px]     lg:text-[58px] z-10 relative">
          SKILL CARDS, CUSTOMIZABLE CHARACTERS & WEAPON SKINS
        </h1>
        <div className="flex  flex-col lg:flex-row gap-6 lg:gap-8 mt-4 items-center lg:items-stretch lg:justify-center z-10 relative ">
          <GameItems
            title="SKILL CARDS"
            description="Unlock unique perks like custom multi-kill voice announcements, visible health bars, and extra visual effects, gaining a tactical edge."
            img="/images/skillcards.png?1"
            imgWidth={546}
            boxClass="max-w-[346px]"
            bgGradClass="blue-grad"
            titleClass="text-[24px] "
            descriptionClass="text-base px-3"
          />
          <GameItems
            title="CUSTOMIZABLE CHARACTERS "
            description="Make your bunny truly yours with a wide range of cosmetics and fashion customization options."
            img="/images/chars.png?1"
            imgWidth={546}
            boxClass="max-w-[346px]"
            bgGradClass="pink-grad"
            titleClass="text-[24px] "
            descriptionClass="text-base px-3"
          />
          <GameItems
            title="WEAPON SKINS "
            description="Show off your flair with playful or sleek skins with every shot."
            img="/images/skins.png?1"
            imgWidth={546}
            boxClass="max-w-[346px]"
            bgGradClass="black-grad"
            titleClass="text-[24px] mt-6"
            descriptionClass="text-base px-2 mb-8"
          />
        </div>
      </div>
    </section>
  );
}

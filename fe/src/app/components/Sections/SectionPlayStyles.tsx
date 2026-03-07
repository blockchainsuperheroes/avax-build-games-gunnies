import Image from 'next/image';
import GameItems from '@components/partials/GameItems';

export default function SectionIntro() {
  return (
    <section className="relative mt-10 mx-2">
      <div className="max-w-[341px] lg:max-w-[1200px] mx-auto">
        <h1 className="font-bold text-main-green lg:leading-[4rem] lg:text-center   lg:max-w-[735px] lg:mx-auto lg:my-10  text-[28px]  lg:text-[58px] ">
          EMBRACE THE MADNESS & UNIQUE PLAYSTYLES
        </h1>
        <div className="flex  flex-col lg:flex-row gap-8   mt-4 items-center lg:justify-center lg:items-stretch">
          <GameItems
            title="Dynamic Arenas"
            description="Maps come alive with special traps and random special events like exploding carrots only modes or hidden pitfalls keeping every match unpredictable."
            img="/images/dynamic-arena.png?1"
            imgWidth={546}
            boxClass="max-w-[343px] lg:max-w-[532px]"
            bgGradClass="blue-grad"
            titleClass="text-base lg:text-[28px] "
            descriptionClass="text-sm lg:text-lg px-3 lg:px-7 lg:mb-8"
          />
          <GameItems
            title="Quirky Weapons "
            description="Choose from unique weapons tailored to different playstyles. Go stealthy, loud, or explosive for more chaos!"
            img="/images/quirky-weapons.png?1"
            imgWidth={546}
            boxClass="max-w-[343px] lg:max-w-[532px]"
            bgGradClass="pink-grad"
            titleClass="text-base lg:text-[28px] "
            descriptionClass="text-sm lg:text-lg px-2 lg:px-16 lg:mb-8"
          />
        </div>
      </div>
    </section>
  );
}

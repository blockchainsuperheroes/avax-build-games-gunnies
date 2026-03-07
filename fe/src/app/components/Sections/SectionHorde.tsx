import Image from 'next/image';

export default function SectionHorde() {
  return (
    <section className="mt-40 lg:mt-16">
      <div className="flex max-w-[1146px] mx-auto relative z-24 justify-center">
        <Image
          src="/images/horde.png"
          alt="logo"
          width={1497}
          height={71}
          className="mx-auto  z-2"
        />
        <div className="max-w-[341px] lg:max-w-[538px] absolute z-24 -top-[6rem] lg:left-0 lg:top-[2rem]">
          <h1 className="font-bold text-main-green lg:leading-[4rem]      text-[28px]     lg:text-[58px] lg:max-w-[415px] lg:text-left ">
            FACE THE ZOMBUNNY HORDE
          </h1>
          <div className="font-sora text-white font-normal text-sm lg:text-xl mt-4 lg:leading-loose">
            Relentless, Zombified bunnies spawn throughout the map, adding an extra layer of
            challenge.
          </div>
        </div>

        <div className=""></div>
      </div>
    </section>
  );
}

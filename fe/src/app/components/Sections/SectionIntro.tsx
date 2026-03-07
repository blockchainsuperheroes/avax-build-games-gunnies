import Image from 'next/image';

export default function SectionIntro() {
  return (
    <section className="relative mt-10 mx-2">
      <Image
        src={'/images/Flint.png'}
        alt="logo"
        width={444}
        height={71}
        className="absolute top-[34rem] lg:top-[26rem] w-1/2 lg:w-[444px] -right-[6rem] max-w-none z-0"
      />
      <div className="flex flex-col lg:flex-row max-w-[1200px] mx-auto">
        <div className="max-w-[341px] lg:max-w-[538px] mx-auto lg:mx-none">
          <h1 className="font-bold text-main-green leading-tight lg:leading-[4rem] lg:text-left  text-[28px]     lg:text-[58px] ">
            INTRODUCING THE GUNNIES IP, MORE THAN JUST A GAME!
          </h1>
          <div className="font-sora text-white text-sm lg:text-xl  font-normal mt-4 lg:leading-loose">
            Developed by a team with experience at Marvel, DC and Cartoon Network, delivering
            creativity at the highest level. Express yourself as a naughty, crazy, whimsical cartoon
            bunny in epic battles, creating a unique experience beyond traditional FPS games.{' '}
          </div>
        </div>
        <div className=" max-w-[677px] z-10">
          <Image
            src="/images/in-game-shots.png"
            alt="logo"
            width={677}
            height={71}
            className="mx-auto"
          />
        </div>
      </div>
    </section>
  );
}

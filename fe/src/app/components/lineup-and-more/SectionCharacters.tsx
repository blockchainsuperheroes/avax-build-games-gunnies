import { useCallback, useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const ITEMS_DATA = [
  {
    name: 'Dustin',
    fullName: 'a.k.a. Dust Bunny',
    description: `Age: 4 
                    Height: 2'1" 
                    Favorite Food: Trail mix (emphasis on trail) 
                    Pet Peeves: Being slowed down, small talk, people who can't keep up `,
    more: `A feral recluse who thrives in filth. Dustin has a sixth sense for clutter and a hoarder's heart of gold (sometimes literally—he finds a lot of weird stuff). Doesn't speak much… just coughs up lint balls.`,
    // Turn off auto height
    // isMoreHeigh: true,
    backgroundBg: 'lg:mt-[92px] bg-img-character-1-bg-md lg:bg-img-character-1-bg',
    imageBg:
      'lg:w-[684px] lg:max-w-[684px] lg:h-[587px] lg:max-h-[587px] bg-img-character-1-md lg:bg-img-character-1 lg:right-[-45px]',
    classNameDescription: 'lg:max-w-[563px]',
    classNameMore: 'lg:max-w-[523px]',
    icBg: 'bg-ic-character-1',
  },
  // Hide other characters
  {
    name: 'Jen',
    fullName: 'a.k.a. Degen',
    description: `Age: Unknown (lives in the moment)
  Height: 2'4"
  Favorite Food: Energy drinks and questionable sushi
  Pet Peeves: Bedtimes, authority, being told “this is a bad idea”`,
    more: `Chaos incarnate. Degen lives on pure impulse—whether it's gambling snack rations, jumping into a pond labeled “Toxic,” or licking mysterious buttons. Somehow, he's not only still alive, but thriving in disasters.`,
    backgroundBg: 'lg:mt-[74px] bg-img-character-2-bg-md lg:bg-img-character-2-bg',
    imageBg:
      'lg:w-[658px] lg:max-w-[658px] lg:h-[564px] lg:max-h-[564px] bg-img-character-2-md lg:bg-img-character-2 lg:right-[-61px]',
    classNameDescription: 'lg:max-w-[483px]',
    classNameMore: 'lg:max-w-[483px]',
    icBg: 'bg-ic-character-2',
  },
  {
    name: 'Teala',
    fullName: 'a.k.a. Twitch',
    description: `Age: 3 (in rabbit years... or maybe caffeine years)
  Height: 2'0" (taller when vibrating)
  Favorite Food: Sugar cubes and cold brew concentrate
  Pet Peeves: Slow talkers, reflective surfaces, silence`,
    more: `A jittery, bug-eyed bundle of nerves. Twitch is constantly mid-breakdown and might be part Wi-Fi signal. Communicates mostly in beeps and rapid blinking. Surprisingly good at surveillance.`,
    backgroundBg: 'lg:mt-[71px] bg-img-character-3-bg-md lg:bg-img-character-3-bg',
    imageBg:
      'lg:w-[618px] lg:max-w-[618px] lg:h-[555px] lg:max-h-[555px] bg-img-character-3-md lg:bg-img-character-3 lg:right-[-45px]',
    classNameDescription: 'lg:max-w-[483px]',
    classNameMore: 'lg:max-w-[483px]',
    icBg: 'bg-ic-character-3',
  },
  {
    name: 'Sunny',
    fullName: 'a.k.a. SunSET',
    description: `Age: 6
  Height: 2'2"
  Favorite Food: Anything spicy, preferably on fire
  Pet Peeves: Damp weather, dim lighting, lukewarm opinions`,
    more: `Hot-headed and proud. Sunset thinks everything looks better scorched—snacks, fashion, relationships. Has a flair for dramatic exits and once burned a bridge just to say she did. Literally.`,
    backgroundBg: 'lg:mt-[68px] bg-img-character-4-bg-md lg:bg-img-character-4-bg',
    imageBg:
      'lg:w-[618px] lg:max-w-[618px] lg:h-[555px] lg:max-h-[555px] bg-img-character-4-md lg:bg-img-character-4 lg:right-[-16px]',
    classNameDescription: 'lg:max-w-[483px]',
    classNameMore: 'lg:max-w-[483px]',
    icBg: 'bg-ic-character-4',
  },
  {
    name: 'Veronica ',
    fullName: 'a.k.a. Sweet Vengeance',
    description: `Age: 3
  Height: 2'3"
  Favorite Food: Red velvet cupcakes (with a secret)
  Pet Peeves: Unpunished rudeness, messy bows, being underestimated`,
    more: `Smiles sweetly while plotting your downfall. Sweet V is the queen of passive-aggressive revenge, wrapped in lace and sugar. If you wrong her, don't worry—she'll remember. Forever.`,
    backgroundBg: 'lg:mt-[64px] bg-img-character-5-bg-md lg:bg-img-character-5-bg',
    imageBg:
      'lg:w-[618px] lg:max-w-[618px] lg:h-[555px] lg:max-h-[555px] bg-img-character-5-md lg:bg-img-character-5 lg:right-[9px]',
    classNameDescription: 'lg:max-w-[483px]',
    classNameMore: 'lg:max-w-[463px]',
    icBg: 'bg-ic-character-5',
  },
  {
    name: 'Connor',
    fullName: 'a.k.a. Mint Condition',
    description: `Age: 0 (never opened)
  Height: 2'1"
  Favorite Food: Frosted memories and nostalgia
  Pet Peeves: Fingerprints on plastic, loud kids, expiration dates`,
    more: `A bunny trapped in pristine packaging… until someone tore the seal. Mint is part ghost, part collectible, and all attitude. She's cute, cold, and mildly cursed—but still photogenic.`,
    backgroundBg: 'lg:mt-[64px] bg-img-character-6-bg-md lg:bg-img-character-6-bg',
    imageBg:
      'lg:w-[618px] lg:max-w-[618px] lg:h-[555px] lg:max-h-[555px] bg-img-character-6-md lg:bg-img-character-6 lg:right-[9px]',
    classNameDescription: 'lg:max-w-[443px]',
    classNameMore: 'lg:max-w-[443px]',
    icBg: 'bg-ic-character-6',
  },
  {
    name: 'BOBBI',
    fullName: 'a.k.a. Butterknife',
    description: `Age: 4
  Height: 2'2"
  Favorite Food: Toast. With surgical precision.
  Pet Peeves: Crumbs, dull blades, sloppy execution`,
    more: `The soft-spoken psycho. Butterknife never raises her voice—just her standards. She can slice toast so cleanly it's considered an art form. You'll never see her snap… until the final panel.`,
    backgroundBg: 'lg:mt-[71px] bg-img-character-7-bg-md lg:bg-img-character-7-bg',
    imageBg:
      'lg:w-[658px] lg:max-w-[658px] lg:h-[564px] lg:max-h-[564px] bg-img-character-7-md lg:bg-img-character-7 lg:right-[-27px]',
    classNameDescription: 'lg:max-w-[475px]',
    classNameMore: 'lg:max-w-[443px]',
    icBg: 'bg-ic-character-7',
  },
];

const ItemView = ({ item, onUpdateAutoHeight }: { item: any; onUpdateAutoHeight: any }) => {
  const [isShowMore, setIsShowMore] = useState(false);

  const onShowMore = useCallback(() => {
    console.log('onShowMore');
    setIsShowMore(true);
    // Turn off auto height
    // onUpdateAutoHeight();
  }, [onUpdateAutoHeight]);

  const onClose = useCallback(() => {
    console.log('onClose');
    setIsShowMore(false);
    // Turn off auto height
    // onUpdateAutoHeight();
  }, [onUpdateAutoHeight]);

  return (
    <div
      className={`relative w-[calc(100vw*0.8855)] max-w-[348px] min-h-[460px] lg:w-[1095px] lg:max-w-[1095px] lg:h-[576px] lg:max-h-[576px] flex flex-col `}
    >
      <div
        className={`w-[calc(100vw*0.7074)] lg:z-10  max-w-[278px] h-[238px] absolute top-0 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:mx-0 lg:left-auto lg:top-0 ${item.imageBg} bg-no-repeat bg-contain`}
      />
      <div
        className={`mt-[81px] lg:self-center flex flex-col justify-between bg-[#ffffff80] w-[calc(100vw*0.8855)] max-w-[348px] ${isShowMore && item.isMoreHeigh ? 'h-[440px]' : 'h-[379px]'}  lg:w-[887px] lg:max-w-[887px] lg:h-[484px] lg:max-h-[484px] rounded-[16px] lg:rounded-[40px] px-6 lg:px-[44px] pb-[26px] pt-[161px] lg:py-[36px] ${item.backgroundBg} bg-no-repeat bg-cover lg:bg-contain`}
      >
        <div className="flex flex-col">
          <p className="font-chakra font-bold text-[32px] lg:text-[48px] leading-[32px] lg:leading-[48px] uppercase text-white text-center lg:text-left">
            {item.name}
          </p>
          <p className="font-chakra text-[19px] lg:text-[20px] leading-[20px] uppercase text-white text-center lg:text-left">
            ({item.fullName})
          </p>
        </div>
        {!isShowMore ? (
          <div className="flex flex-col">
            <p
              className={`w-[calc(100vw-48px)] max-w-[300px] ${item.classNameDescription} font-sora text-[12px] lg:text-[24px] leading-[15px] lg:leading-[36px] text-white text-center lg:text-left whitespace-pre-line `}
            >
              {item.description}
            </p>
            <div
              onClick={onShowMore}
              className="mt-2.5 w-[calc(100vw-48px)] max-w-[300px] lg:w-[164px] h-[32px] lg:h-[52px] cursor-pointer rounded-[8px] lg:rounded-[12px] bg-[#2e2e2e] hover:bg-[#4c4c4c] flex items-center justify-center font-sora font-bold text-[13px] lg:text-[20px] leading-[32px] lg:leading-[52px]"
            >
              + MORE
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            <p
              className={`w-[calc(100vw-48px)] max-w-[300px] ${item.classNameMore} font-sora text-[12px] lg:text-[16px] leading-[15px] lg:leading-[28px] text-white text-center lg:text-left whitespace-pre-line `}
            >
              {item.more}
            </p>
            <div
              onClick={onClose}
              className="mt-2.5 w-[calc(100vw-48px)] max-w-[300px] lg:w-[164px] h-[32px] lg:h-[52px] cursor-pointer rounded-[8px] lg:rounded-[12px] bg-[#2e2e2e] hover:bg-[#4c4c4c] flex items-center justify-center font-sora font-bold text-[13px] lg:text-[20px] leading-[32px] lg:leading-[52px]"
            >
              CLOSE
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const SectionCharacters = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [allowSlideNext, setAllowSlideNext] = useState(true);
  const [allowSlidePrev, setAllowSlidePrev] = useState(false);

  const prevSlide = useCallback(() => {
    (swiperRef?.current as any)?.swiper?.slidePrev();
  }, [swiperRef]);

  const nextSlide = useCallback(() => {
    (swiperRef?.current as any)?.swiper?.slideNext();
  }, [swiperRef]);

  const onSlideTo = useCallback(
    (index: number) => {
      (swiperRef?.current as any)?.swiper?.slideTo(index);
    },
    [swiperRef]
  );

  const onUpdateAutoHeight = useCallback(() => {
    (swiperRef?.current as any)?.swiper?.updateAutoHeight();
    setTimeout(() => {
      onSlideTo(activeIndex);
    }, 100);
  }, [swiperRef, activeIndex]);

  useEffect(() => {
    console.log('activeIndex', activeIndex);
    setAllowSlidePrev(activeIndex > 0);
    setAllowSlideNext(activeIndex < 6);
  }, [activeIndex]);

  return (
    <>
      <div className="flex flex-col lg:gap-[25px] w-full items-center justify-center mt-[calc(100vw*0.0992)] xs:mt-[39px]  lg:mt-[calc(100vw*0.054)] 3xl:mt-[103px] ">
        <div className="w-[196px] h-[111px] lg:w-[210px] lg:h-[118px] bg-gunnies-logo-hz bg-no-repeat bg-contain" />
        <h1 className="color-text font-chakra font-bold text-[36px] leading-[66px] lg:text-[60px] lg:leading-[77px] uppercase text-center">
          THE LINEUP & MORE
        </h1>
      </div>
      <section className="relative flex flex-col justify-center items-center gap-[28px] lg:gap-10 mt-[52px] w-full mx-auto">
        <Swiper
          onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
          ref={swiperRef}
          // Turn off auto height
          // autoHeight={true}
          speed={500}
          // Hide other characters
          modules={[Pagination, Navigation]}
          className="w-[calc(100vw*0.8855)] max-w-[348px] lg:w-[1095px] lg:max-w-[1095px] lg:h-[576px] bg-transparent"
        >
          {ITEMS_DATA.map((it: any, index: number) => (
            <SwiperSlide key={`item-${index}`} className="!bg-transparent">
              <ItemView item={it} onUpdateAutoHeight={onUpdateAutoHeight} />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* Hide other characters */}
        <div className="flex w-[calc(100vw-60px)] max-w-[330px] lg:max-w-[900px] flex-wrap items-center justify-center">
          {ITEMS_DATA.map((it: any, index: number) => (
            <div
              onClick={() => onSlideTo(index)}
              key={`item-${index}`}
              className={`cursor-pointer mx-[-13px] lg:mx-[-8px] w-[100px] h-[74px] lg:w-[115px] lg:h-[85px] ${it.icBg} bg-no-repeat bg-contain ${activeIndex != index ? 'opacity-30' : ''}`}
            ></div>
          ))}
        </div>
        {/* Hide other characters */}
        <div className="flex lg:z-20 absolute left-1/2 translate-y-[-50%] top-1/2 translate-x-[-50%] lg:w-[1127px] h-[80px] justify-between">
          <div
            onClick={allowSlidePrev ? () => prevSlide() : undefined}
            className={`w-[60px] h-[60px] rounded-[30px] cursor-pointer bg-ic-prev bg-no-repeat bg-contain ${!allowSlidePrev ? 'opacity-60 !cursor-not-allowed' : 'hover:bg-ic-prev-hover'}`}
          ></div>
          <div
            onClick={allowSlideNext ? () => nextSlide() : undefined}
            className={`w-[60px] h-[60px] rounded-[30px] cursor-pointer bg-ic-next bg-no-repeat bg-contain ${!allowSlideNext ? 'opacity-60 !cursor-not-allowed' : 'hover:bg-ic-next-hover'}`}
          ></div>
        </div>
      </section>
    </>
  );
};

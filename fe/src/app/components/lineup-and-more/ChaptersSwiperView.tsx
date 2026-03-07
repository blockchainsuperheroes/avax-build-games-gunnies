import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { View } from '../common';

const ITEMS_DATA = [
  {
    imageBg: 'bg-img-chapter-1',
  },
  {
    imageBg: 'bg-img-chapter-2',
  },
  {
    imageBg: 'bg-img-chapter-3',
  },
  {
    imageBg: 'bg-img-chapter-4',
  },
];

const MAX_NUMBER_CAN_NEXT = ITEMS_DATA.length - 1;

export const ChaptersSwiperView = ({ onClose, openIndex }: { onClose: any, openIndex: number }) => {
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

  useEffect(() => {
    console.log('activeIndex', activeIndex);
    setAllowSlidePrev(activeIndex > 0);
    setAllowSlideNext(activeIndex < MAX_NUMBER_CAN_NEXT);
  }, [activeIndex]);

  useEffect(() => {
    console.log('openIndex', openIndex);
    onSlideTo(openIndex);
  }, [openIndex]);

  return (
    <View className="bg-transparent relative w-full flex items-center justify-center">
      <View className="bg-transparent relative w-full max-w-[385px] lg:max-w-[483px] lg:w-[483px] max-h-[825px] h-[calc(100vw*2.1)] lg:max-h-[1035px] lg:h-[1035px]">
        <div className="relative flex flex-col lg:max-w-[483px] lg:w-[483px] items-center justify-center max-h-[825px] h-[calc(100vw*2.1)] lg:max-h-[1035px] lg:h-[1035px] overflow-y-scroll disable-scrollbars">
          <div className="relative flex flex-col justify-center items-center gap-[28px] lg:gap-10 ">
            <Swiper
              onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
              ref={swiperRef}
              speed={500}
              modules={[Navigation]}
              className=" w-[calc(100vw*0.6234)] h-[calc(100vw*1.9924)] max-w-[245px] max-h-[782px] lg:w-[307px] lg:h-[982px] lg:max-w-[307px] lg:max-h-[982px] bg-transparent"
            >
              {ITEMS_DATA.map((it: any, index: number) => (
                <SwiperSlide key={`item-${index}`} className="!bg-transparent">
                  <div
                    className={clsx(
                      it.imageBg,
                      `bg-no-repeat bg-contain w-[calc(100vw*0.6234)] h-[calc(100vw*1.9924)] max-w-[245px] max-h-[782px] lg:w-[307px] lg:max-w-[307px] lg:h-[982px] lg:max-h-[982px]`
                    )}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        <div 
          onClick={onClose}
        className="mt-[22px] lg:mt-[28px] cursor-pointer w-[123px] lg:w-[154px] h-[20px] lg:h-[25px] font-sora text-[13px] lg:text-[16px] leading-[20px] lg:leading-[25px] underline text-white hover:text-[#F8881C] text-center">
              CLOSE
        </div>
        </div>
          <div className="flex absolute left-1/2 translate-y-[-50%] top-1/2 translate-x-[-50%] w-full max-w-[385px] lg:w-[483px] lg:max-w-[483px] h-[38px] lg:h-[48px] justify-between">
            <div
              onClick={allowSlidePrev ? () => prevSlide() : undefined}
              className={`w-[38px] h-[38px] lg:w-[48px] lg:h-[48px] rounded-[19px] lg:rounded-[24px] cursor-pointer bg-ic-prev bg-no-repeat bg-contain ${!allowSlidePrev ? 'opacity-60 !cursor-not-allowed' : 'hover:bg-ic-prev-hover'}`}
            ></div>
            <div
              onClick={allowSlideNext ? () => nextSlide() : undefined}
              className={`w-[38px] h-[38px] lg:w-[48px] lg:h-[48px] rounded-[19px] lg:rounded-[24px] cursor-pointer bg-ic-next bg-no-repeat bg-contain ${!allowSlideNext ? 'opacity-60 !cursor-not-allowed' : 'hover:bg-ic-next-hover'}`}
            ></div>
          </div>
      </View>
    </View>
  );
};

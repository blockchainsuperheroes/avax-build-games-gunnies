import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { ModalGeneral } from '../container';
import { ChaptersSwiperView } from './ChaptersSwiperView';

const ITEMS_DATA = [
  {
      icBg: 'bg-ic-chapter-1'
  },
  {
      icBg: 'bg-ic-chapter-2'
  },
  {
      icBg: 'bg-ic-chapter-3'
  },
  {
      icBg: 'bg-ic-chapter-4'
  },
];

const DATA_MONTHS = [
  { id: 1, name: 'July' },
  { id: 2, name: 'August' },
  { id: 3, name: 'September' },
  { id: 4, name: 'October' },
  { id: 5, name: 'November' },
  { id: 6, name: 'December' },
]

const MonthSelectView = () => {
const [selected, setSelected] = useState(DATA_MONTHS[3])

  return (
    <div className="mx-auto h-[40px] w-[176px] pt-[48px]">
      <Listbox value={selected} onChange={setSelected}>
        {({ open }) => (
        <>
        <ListboxButton
          className={clsx(
            'relative block border w-full bg-white py-1.5 pr-8 pl-3 text-left text-black font-sora font-bold text-[14px] leading-[22px]',
            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
            `${!open ? 'rounded-[4px] border-[#D9D9D9]' : 'rounded-t-[4px] border-[#190FF]'}`
          )}
        >
          {selected.name}
          <div className="group pointer-events-none absolute top-[14px] right-3">
            <div className="relative w-[12px] h-[8px]">
              <Image
                className="object-contain"
                priority={true}
                fill={true}
                src={!open ? "/assets/icons/ic-chevron-down.svg" : "/assets/icons/ic-chevron-up.svg"}
                alt=""
              />
            </div>
          </div>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'w-[176px] rounded-b-[4px] dropdown-list-options bg-white py-1 [--anchor-gap:--spacing(1)] focus:outline-none',
            'transition duration-100 ease-in data-leave:data-closed:opacity-0',
          )}
        >
          {DATA_MONTHS.map((it: any) => (
            <ListboxOption
              key={it.name}
              value={it}
              className={`group hover:cursor-pointer hover:bg-[#1CBBBB66] ${selected?.id == it.id ? 'bg-[#1CBBBC]' : ''} text-black  flex cursor-default items-center gap-2 px-3 py-1.5 select-none data-focus:bg-white/10`}
            >
              <div className={`font-sora font-bold text-[14px] leading-[22px] text-black ${selected?.id == it.id ? 'text-white' : ''}`}>{it.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
        </>
      )}
      </Listbox>
    </div>
  )
}

export const SectionChapters = () => {
  const [isPopupChaptersSwiperOpen, setIsPopupChaptersSwiperOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  const onOpenChapterSwipter = useCallback((index: number) => {
    setIsPopupChaptersSwiperOpen(true);
    setOpenIndex(index)
  }, []);

  return (
    <>
    <div className="mt-[32px] lg:mt-[calc(100vw*0.0824)] 3xl:mt-[157px] flex flex-col lg:gap-[25px] w-full items-center justify-center ">
      <h2 className="w-[calc(100vw-45px)] font-chakra font-bold text-[#1CBBBB] text-[28px] leading-[32px] lg:text-[58px] lg:leading-[64px] uppercase text-center">Boom! Your Weekly Laugh Dose</h2>
    </div>
    {/* <MonthSelectView /> */}
    <section className="relative flex flex-col justify-center items-center gap-[28px] lg:gap-10 mt-6 lg:mt-[52px] w-full mx-auto">
      <div className='w-[calc(100vw-48px)] max-w-[330px] lg:w-[calc(100vw*0.6)] lg:max-w-[1112px] flex flex-wrap items-center justify-between lg:justify-start gap-y-4 gap-x-6 lg:gap-y-[calc(100vw*0.0189)] 3xl:gap-y-[36px] lg:gap-[calc(100vw*0.0336)] 3xl:gap-x-[64px]'>
         {
          ITEMS_DATA.map((it: any, index: number ) => <div onClick={()=>onOpenChapterSwipter(index)} key={`item-${index}`} className={`group w-[calc(100vw*0.3817)]  max-w-[150px] lg:w-[calc(100vw*0.1721)]  lg:max-w-[328px] flex flex-col gap-4`}>
             <div className=" cursor-pointer w-[calc(100vw*0.3817)] h-[calc(100vw*0.3817)] max-w-[150px] max-h-[150px] lg:w-[calc(100vw*0.1721)] lg:h-[calc(100vw*0.1721)] lg:max-w-[328px] lg:max-h-[328px] rounded-full flex items-center justify-center border-[3px] lg:border-[6px] border-[#1cbbbb66] group-hover:border-[#1cbbbb]">
              <div className={clsx(it.icBg, `bg-no-repeat bg-contain w-[calc(100vw*0.3308)] h-[calc(100vw*0.3308)] max-w-[130px] max-h-[130px] lg:w-[calc(100vw*0.149)] lg:h-[calc(100vw*0.149)] lg:max-w-[284px] lg:max-h-[284px] rounded-full`)} />
             </div>
             <p className="font-sora text-[15px] leading-[23px] lg:text-[32px] lg:leading-[50px] text-white group-hover:text-[#1cbbbb] text-center">{`#${index + 1}`}</p>
          </div>)
        }
      </div>
    </section>

    <ModalGeneral
            modalOpen={isPopupChaptersSwiperOpen}
            modalBody={<ChaptersSwiperView
            onClose={() => setIsPopupChaptersSwiperOpen(false)}
            openIndex={openIndex}
            />}
            modalTitle={undefined}
            modalDescription={undefined}
            setModalOpen={setIsPopupChaptersSwiperOpen}
            theme="w-full max-w-[385px] lg:max-w-[483px] lg:w-[483px] bg-transparent rounded-none"
        />
    </>
  );
};

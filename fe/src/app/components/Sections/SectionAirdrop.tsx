import Image from 'next/image';
import AirdropItems from '@components/partials/AirdropItems';
import { Footer } from '@components/footer/Footer';
import { useState } from 'react';
import ModalDownload from '../common/ModalDownload';
import SectionEarlyAccess from './SectionEarlyAccess';
export default function SectionSkills() {
  const [isOpenDownloadModal, setIsOpenDownloadModal] = useState(false);

  return (
    <>
      <section className="relative mt-10 bg-[url('/images/early-bg.png')] bg-no-repeat bg-cover">
        <div className=" max-w-[1200px] mx-auto">
          <h1 className="font-bold  leading-[4rem] text-center ">ROADMAP</h1>
          <div className="flex flex-col gap-0 mt-4 items-center">
            <div className="">
              {' '}
              <Image
                src={'/images/rounded-dot.svg'}
                alt="logo"
                width={48}
                height={71}
                className="mx-auto"
              />
            </div>
            <div className="h-12 lg:h-16 border-[0.07rem] lg:border-[0.1rem] border-main-red1 relative">
              <Image
                src={'/images/air-drop.png'}
                alt="logo"
                width={444}
                height={71}
                className="absolute  w-[222px] lg:w-[444px] -top-[3.5rem] right-[5rem] lg:-top-[11.2rem] lg:right-[10rem] max-w-none -z-10"
              />
              <Image
                src={'/images/Flint.png'}
                alt="logo"
                width={916}
                height={71}
                className="absolute top-[0.2rem] -right-[70rem] max-w-none "
              />
            </div>
            <AirdropItems
              description="1"
              items={['Private Beta Testing']}
              imgWidth={346}
              boxClass="lg:w-[840px] h-[193px] md:h-[208px]"
              titleClass="text-[32px] lg:text-[40px]"
              descriptionClass="text-xl lg:text-2xl"
              backgroundImageStyle={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="h-12 lg:h-16 border-[0.07rem] lg:border-[0.1rem] border-main-red1 relative">
              <Image
                src={'/images/Gunny-Bros.png'}
                alt="logo"
                width={725}
                height={71}
                className="absolute -top-[5.2rem] right-[20rem] max-w-none "
              />
            </div>
            <AirdropItems
              description="2"
              items={['Public Beta Testing']}
              imgWidth={346}
              boxClass="lg:w-[840px] h-[193px] md:h-[208px]"
              titleClass="text-[32px] lg:text-[40px]"
              descriptionClass="text-xl lg:text-2xl"
              backgroundImageStyle={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="h-12 lg:h-16  border-[0.07rem] lg:border-[0.1rem] border-main-red1 relative"></div>
            <AirdropItems
              description="3"
              items={[
                'Epic Launch',
                'Daily & Weekly Quests',
                'New Game Modes',
                'Gunnies Marketplace - Multi Chain Support',
                'PC Chain Implementation',
                'Community Tournament',
              ]}
              imgWidth={346}
              boxClass="lg:w-[840px]"
              titleClass="text-[32px] lg:text-[40px]"
              descriptionClass="text-xl lg:text-2xl py-2 md:py-8"
            />
            <div className="h-12 lg:h-16  border-[0.07rem] lg:border-[0.1rem] border-main-red1 relative">
              <Image
                src={'/images/kick-in-head.png'}
                alt="logo"
                width={444}
                height={71}
                className="absolute -top-[11.2rem] right-[19rem] max-w-none "
              />
            </div>
            <AirdropItems
              description="4"
              items={[
                'Steam Launch',
                '3D Gunnies Bootcamp Experience',
                'Khaos Token Official Launch',
              ]}
              imgWidth={346}
              boxClass="lg:w-[840px] h-[314px]"
              titleClass="text-[32px] lg:text-[40px]"
              descriptionClass="text-xl lg:text-2xl py-2 md:py-8"
              backgroundImageStyle={{
                backgroundSize: 'cover',
                backgroundPosition: 'top',
              }}
            />
            <div className="h-12 lg:h-16 border-[0.07rem]  lg:border-[0.1rem] border-main-red1"></div>
            <div className="">
              {' '}
              <Image
                src={'/images/rounded-dot.svg'}
                alt="logo"
                width={48}
                height={71}
                className="mx-auto"
              />
            </div>
            {/* <Image
              src={'/images/gunny-greyed.svg'}
              alt="logo"
              width={104}
              height={71}
              className="hidden md:block mx-auto my-0 opacity-20"
            /> */}

            <div className="mt-6 md:mt-40">
              <SectionEarlyAccess />
            </div>
          </div>
        </div>
        <Footer />
      </section>
      <ModalDownload isOpen={isOpenDownloadModal} onClose={() => setIsOpenDownloadModal(false)} />
    </>
  );
}

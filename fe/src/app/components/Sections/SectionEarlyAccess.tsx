import { ROUTES } from '@/app/constants/routes';
import Link from 'next/link';

export default function SectionEarlyAccess() {
  return (
    <section className="relative mt-10 2xl:-mt-20">
      <div className=" max-w-[1200px] mx-auto ">
        <div className="">
          <h1 className="font-bold text-main-green lg:leading-[4rem]  text-xl   text-center lg:text-[55px] uppercase">
            READY TO JOIN THE MADNESS?
          </h1>
          <h4 className="text-main-green uppercase font-sora text-xl font-bold text-center"> </h4>
        </div>
        <Link
          href={ROUTES.DOWNLOAD}
          className="
          flex items-center justify-center 
          text-black uppercase  
          bg-main-green  mt-8
          h-[66px]  lg:h-[90px] font-semibold  
          text-xl lg:text-2xl w-[345px] lg:w-[460px]
          rounded-md mx-auto
            transition-transform duration-200
                  hover:border-none 
                  hover:bg-main-green 
                  hover:scale-95
        "
        >
          PLAY NOW
        </Link>
      </div>
    </section>
  );
}

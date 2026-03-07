import Image from 'next/image';

interface SectionItemProps {
  title?: string;
  description: string;
  items: string[]; //
  imgWidth: number;
  boxClass: string;
  titleClass: string;
  descriptionClass: string;
  backgroundImageStyle?: object; // Optional background image for the box
}

export default function GameItems({
  title,
  description,
  items,
  imgWidth,
  boxClass,
  titleClass,
  descriptionClass,
  backgroundImageStyle,
}: SectionItemProps) {
  return (
    <div className="border-[0.07rem]   lg:border-[0.15rem] border-main-red1 p-3 md:px-[30px] md:py-[33px] rounded-3xl bg-[#00000080] w-[calc(100%-16px)] md:w-[unset]">
      <div
        className={`flex flex-col lg:flex-row lg:flex-row-reverse items-center lg:items-stretch relative  rounded-3xl bg-main-green  ${boxClass} w-full lg:max-w-[1200px]`}
      >
        <div className='w-full md:w-[unset]'>
          <div
            className={`lg:hidden font-sora text-xl font-bold text-center leading-tight absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 uppercase z-10`}
          >
            Quarter {description}
          </div>

          <div
            className={`hidden lg:block w-[228px] h-full relative  rounded-none  rounded-tr-3xl rounded-br-3xl`}
            style={{
              backgroundImage: `url('/images/phase${description}-lg.png')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '10% 70%',
              backgroundSize: 'cover',
              ...backgroundImageStyle,
            }}
          >
            <div
              className={` font-normal w-5/6 text-center leading-tight absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
            >
              <span className="font-sora text-[20px] leading-none uppercase"> Quarter </span>
              <h1 className="font-bold text-[128px] leading-none">{description}</h1>
            </div>
          </div>
          <div
            className={`block lg:hidden w-full h-[78px] relative  rounded-none  rounded-t-3xl`}
            style={{
              backgroundImage: `url('/images/phase${description}.png')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />
        </div>
        <div className="p-4 md:pr-5 md:pl-12 flex-1 flex flex-col justify-start md:justify-center items-start gap-4 w-full">
          {title && (
            <h4
              className={` font-bold  text-left leading-tight mt-4 lg:mt-16 lg:mb-4 ${titleClass}`}
            >
              {title}
            </h4>
          )}
          <div
            className={`max-w-[510px] lg:max-w-[700px] text-black font-sora font-semibold  lg:leading-[3rem] ${descriptionClass}`}
          >
            {items.map((desc, idx) => (
              <div key={idx} className="my-2" dangerouslySetInnerHTML={{ __html: '✓ ' + desc }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

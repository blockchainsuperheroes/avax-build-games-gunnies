import Image from 'next/image';

interface SectionItemProps {
  title: string;
  description: string;
  bgGradClass: string; // optional additional CSS classes
  img: string;
  imgWidth: number;
  imgClass?: string;
  boxClass: string;
  titleClass: string;
  descriptionClass: string;
}

export default function GameItems({
  title,
  description,
  bgGradClass,
  img,
  imgWidth,
  imgClass,
  boxClass,
  titleClass,
  descriptionClass,
}: SectionItemProps) {
  return (
    <div
      className={`flex flex-col items-center  rounded-3xl border-l-2 border-l-main-blue1    border-t-2 border-t-main-blue2    border-b-2 border-b-main-blue2    border-r-0  ${boxClass} ${bgGradClass}`}
    >
      <Image
        src={img}
        alt="logo"
        width={imgWidth}
        height={71}
        className={`mx-auto rounded-tl-3xl rounded-tr-3xl   ${imgClass} `}
      />
      <h4 className={`font-sora font-bold text-center leading-tight mt-4 ${titleClass}`}>
        {title}
      </h4>
      <div
        className={`font-sora font-normal  text-center text-sm lg:text-lg lg:leading-tight mb-3 ${descriptionClass}`}
      >
        {description}
      </div>
    </div>
  );
}

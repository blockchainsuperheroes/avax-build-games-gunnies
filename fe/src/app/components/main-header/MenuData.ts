import { ROUTES } from '@/app/constants/routes';
import LeaderboardImage from '@/../public/images/header/leaderboard.png';
import EarnImage from '@/../public/images/header/carrot.png';
import ShopImage from '@/../public/images/shop/shop-icon.png';
import { StaticImageData } from 'next/image';
import GunImage from '@/../public/images/header/gun.png';
import { EXTERNAL_LINK } from '@/app/constants/external_link';
import CollectiblesImage from '@/../public/images/collectibles/collectibles-icon.png';
export interface MenuItem {
  id?: string;
  title: string;
  route?: string;
  image?: StaticImageData;
  imageClass?: string;
  buttonClass: string;
  textClass: string;
  onClick?: () => void;
  onClickOnly?: boolean;
  target?: string;
  hasDropdown?: boolean;
}

export const MenuData = [
  {
    title: 'Play Now',
    image: GunImage,
    buttonClass:
      'w-[297px] md:w-[unset] mx-12 md:mx-0 flex items-center justify-start md:justify-center gap-2.5 md:border md:border-[#1CBBBC] md:rounded-lg px-3 py-2 md:px-3.5 md:py-2 md:hover:bg-[#1CBBBC] md:hover:border-transparent bg-transparent',
    textClass: 'text-white text-base md:text-lg font-bold font-chakra uppercase',
    hasDropdown: true,
    onClickOnly: true,
  },
  {
    title: 'Leaderboard',
    route: ROUTES.LEADERBOARD,
    image: LeaderboardImage,
    imageClass: 'w-[30px] h-[30px] md:w-[28px] md:h-[35px]',
    buttonClass:
      'w-[297px] md:w-[unset] mx-12 md:mx-0 flex items-center justify-start md:justify-center gap-2.5 border border-[#1CBBBC] rounded-lg px-3 py-2 md:px-3.5 md:py-2 hover:bg-[#1CBBBC] hover:border-transparent bg-transparent',
    textClass: 'text-white text-base md:text-lg font-bold font-chakra uppercase',
  },
  {
    title: 'Earn rewards',
    route: ROUTES.QUESTS,
    image: EarnImage,
    imageClass: 'w-[30px] h-[30px] md:w-[32px] md:h-[35px]',
    buttonClass:
      'w-[297px] md:w-[unset] mx-12 md:mx-0 flex items-center justify-start md:justify-center gap-2.5 border border-[#1CBBBC] px-4 py-2 md:px-3.5 md:py-2 hover:bg-[#1CBBBC] bg-transparent rounded-lg',
    textClass: 'text-white text-base md:text-lg font-bold font-chakra uppercase',
  },
   {
    title: 'Collectibles',
    route: ROUTES.COLLECTIBLES,
    image: CollectiblesImage,
    imageClass: 'w-[30px] h-[30px] md:w-[34px] md:h-[34px]',
    buttonClass:
      'w-[297px] md:w-[unset] mx-12 md:mx-0  flex items-center justify-center gap-2.5 border border-[#1CBBBC] rounded-[5px] px-4 py-2 hover:bg-[#1CBBBC] hover:text-black bg-transparent',
    textClass: 'text-white text-base md:text-lg font-semibold font-chakra uppercase',
  },
  {
    title: 'Store',
    route: ROUTES.SHOP,
    image: ShopImage,
    imageClass: 'w-[30px] h-[30px] md:w-[34px] md:h-[34px]',
    buttonClass:
      'w-[297px] md:w-[unset] mx-12 md:mx-0  flex items-center justify-start md:justify-center gap-2.5 border border-[#1CBBBC] rounded-[5px] px-4 py-2 hover:bg-[#1CBBBC] hover:text-black bg-transparent',
    textClass: 'text-white text-base md:text-lg font-semibold font-chakra uppercase',
  },
  {
    title: 'Roadmap',
    route: ROUTES.EARLY_ACCESS,
    buttonClass: 'flex items-center justify-start px-2',
    textClass:
      'text-white hover:text-[#FFA100] text-base md:text-lg font-bold font-chakra uppercase',
  },
  {
    title: 'Brand Kit',
    route: ROUTES.BRAND_KIT,
    buttonClass: 'flex items-center justify-start px-2',
    textClass:
      'text-white hover:text-[#FFA100] text-base md:text-lg font-bold font-chakra uppercase',
  },
  // {
  //   title: 'Socials',
  //   buttonClass: 'flex items-center justify-start px-2',
  //   textClass:
  //     'text-white hover:text-[#FFA100] text-base md:text-lg font-bold font-chakra uppercase',
  //   target: '_blank',
  // },
];

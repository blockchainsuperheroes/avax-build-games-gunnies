import { EXTERNAL_LINK } from '@/app/constants/external_link';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  color: string;
  className ?: string;
}

export const socialLinks: SocialLink[] = [
  {
    name: 'X (Twitter)',
    url: EXTERNAL_LINK.X,
    icon: '/images/x.svg',
    color: '#000000',
  },
  {
    name: 'YouTube',
    url: EXTERNAL_LINK.YOUTUBE,
    icon: '/images/youtube.svg',
    color: '#FF0000',
  },
  {
    name: 'Telegram',
    url: EXTERNAL_LINK.TELEGRAM,

    icon: '/images/tg.svg',
    color: '#0088cc',
    className: 'scale-90'
  },
  {
    name: 'Discord',
    url: EXTERNAL_LINK.DISCORD,

    icon: '/images/discord.svg',
    color: '#5865F2',
  },
  {
    name: 'TikTok',
    url: EXTERNAL_LINK.TIKTOK,
    icon: '/images/tiktok.svg',
    color: '#000000',
  },
  {
    name: 'Instagram',
    url: EXTERNAL_LINK.INSTAGRAM,
    icon: '/images/instagram.svg',
    color: '#E4405F',
  },
];

export const SectionSocials = ({ onClose = () => {} }: { onClose?: () => void }) => {
  return (
    <div className="flex items-center md:grid grid-cols-3 gap-3">
      {socialLinks.map(social => (
        <Link
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className='w-10 md:w-12 h-10 md:h-12 flex items-center justify-center rounded-full border-[2px] border-white hover:border-[#1CBBBC] transition-colors duration-200 group ${social.color}'
          onClick={onClose}
          title={social.name}
        >
          <Image
            src={social.icon}
            alt={social.name}
            width={24}
            height={24}
            className={`object-contain group-hover:[filter:brightness(0)_saturate(100%)_invert(89%)_sepia(26%)_saturate(6551%)_hue-rotate(124deg)_brightness(83%)_contrast(78%)] transition-all duration-200 w-4 md:w-6 h-4 md:h-6 $ ${social.className || ''}`}
          />
        </Link>
      ))}
    </div>
  );
}

'use client';

import React from 'react';
import { UserInfo } from '@/app/types/user';
import { truncateAddress } from '@/utils';
import Image from 'next/image';

interface ProfileHeaderProps {
  username?: string;
  userInfo?: UserInfo | null;
}

export const ProfileHeader = ({ username, userInfo }: ProfileHeaderProps) => {
  const showMetaMaskAddress = userInfo?.mm_address;

  return (
    <div className="text-center mb-12">
      {username && (
        <h1 className="text-white text-3xl md:text-[60px] leading-[100%] font-bold font-chakra uppercase mb-4 linear-grad1">
          {username || 'User'}
        </h1>
      )}
      {showMetaMaskAddress && (
        <div className="border border-white px-3 md:px-8 py-2 md:py-4 inline-block rounded-full mt-4 md:mt-8">
          <div className="flex items-center gap-2">
            <Image src="/assets/icons/metamask-icon@2x.png" alt="MetaMask" width={32} height={32} />
            <span className="text-white text-sm md:text-xl font-bold uppercase font-chakra">
              {truncateAddress(userInfo.mm_address || '')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

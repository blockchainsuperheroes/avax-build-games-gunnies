'use client';

import '../styles/global.scss';
import '../styles/_common.scss';
import React from 'react';
import { MainHeader } from '../components/main-header';
import { Footer } from '../components/footer/Footer';

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <MainHeader />
      <main className='w-full max-w-[1920px] mx-auto'>{children}</main>
      <Footer />
    </div>
  );
}

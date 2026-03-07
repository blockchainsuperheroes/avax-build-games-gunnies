'use client';

import '../styles/global.scss';
import '../styles/_common.scss';
import React from 'react';
import { MainHeader } from '../components/main-header';

export default function QuestsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-x-hidden bg-[url('/images/quests/bg-quest.jpg')] bg-no-repeat bg-top bg-cover">
      <MainHeader />
      <main className="max-w-[1920px] mx-auto overflow-x-hidden">{children}</main>
    </div>
  );
}

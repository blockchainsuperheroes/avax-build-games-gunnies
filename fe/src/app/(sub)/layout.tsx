'use client';

import { MainHeader } from '@/app/components/main-header';
import React from 'react';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MainHeader />
      <main className="max-w-[1920px] mx-auto">{children}</main>
    </>
  );
}

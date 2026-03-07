'use client';

import React from 'react';
import { MainHeader } from '../components/main-header';
import { Footer } from '../components/footer/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-x-hidden">
      <MainHeader />
      <div className="bg-black bg-[url('/images/current-event/banner.jpg')] bg-no-repeat bg-top bg-contain md:bg-cover relative">
        <main className="xl:w-full xl:flex xl:justify-center max-w-[1920px] mx-auto ">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

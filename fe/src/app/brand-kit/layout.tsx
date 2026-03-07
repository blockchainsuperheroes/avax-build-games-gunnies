'use client';

import React from 'react';
import { MainHeader } from '../components/main-header';
import { Footer } from '../components/footer/Footer';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-x-hidden">
      <MainHeader />
      <div className="bg-[url('/images/download/background-mobile.jpg')] md:bg-[url('/images/download/background.jpg')] bg-no-repeat bg-top bg-contain md:bg-cover relative">
        <main className="xl:w-full xl:flex xl:justify-center max-w-[1920px] mx-auto ">
          {children}
        </main>
        <Footer />

        {/* <Image
          className="hidden md:block absolute bottom-16 -right-64"
          width={916}
          height={1088}
          src="/images/Flint.png"
          alt="Flint"
        />

        <Image
          className="hidden md:block absolute -bottom-0 -left-32"
          width={725}
          height={881}
          src="/images/Gunny-Bros.png"
          alt="Gunny Bros"
        /> */}
      </div>
    </div>
  );
}

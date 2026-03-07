'use client';

import React from 'react';
import { MainHeader } from '../components/main-header';
import { Footer } from '../components/footer/Footer';
import Image from 'next/image';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-x-hidden bg-black">
      <MainHeader />
      <div className="relative bg-black">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/download/new-bg.png"
            alt="Background"
            fill
            className="object-cover object-top md:object-cover"
            priority
          />
        </div>

        <main className="relative z-50 xl:w-full xl:flex xl:justify-center max-w-[1920px] mx-auto">
          {children}
        </main>
        <div className="relative z-10">
          <Footer />
        </div>

        <Image
          className="hidden md:block absolute bottom-16 -right-64 z-10"
          width={916}
          height={1088}
          src="/images/Flint.png"
          alt="Flint"
        />

        <Image
          className="hidden md:block absolute -bottom-0 -left-32 z-10"
          width={725}
          height={881}
          src="/images/Gunny-Bros.png"
          alt="Gunny Bros"
        />
      </div>
    </div>
  );
}

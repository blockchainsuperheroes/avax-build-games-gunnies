import type { Metadata } from 'next';
import '../styles/global.scss';
import '../styles/_common.scss';
import React from 'react';
import { MainHeader } from '../components/main-header';

export const metadata: Metadata = {
  title: 'My Cart | Gunnies',
  description: 'Review your items and checkout. Secure payment options available including USD, SKL, AVAX, and PEN tokens.',
  keywords: 'Gunnies cart, checkout, payment, cryptocurrency, gaming purchases',
  openGraph: {
    title: 'My Cart | Gunnies',
    description: 'Review your items and checkout with multiple payment options.',
    type: 'website',
  },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-x-hidden bg-[url('/images/quests/bg-quest.jpg')] bg-no-repeat bg-top bg-cover">
      <MainHeader />

      <main className="max-w-[1920px] mx-auto pt-4 py-8 md:py-12">{children}</main>
    </div>
  );
}

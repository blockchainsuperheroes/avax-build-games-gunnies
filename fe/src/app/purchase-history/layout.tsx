import type { Metadata } from 'next';
import { MainHeader } from '../components/main-header';

import '../styles/global.scss';
import '../styles/_common.scss';
import React from 'react';
import { Footer } from '../components/footer/Footer';

export const metadata: Metadata = {
  title: 'Purchase History | Gunnies',
  description: 'View your purchase history and order details.',
};

export default function PurchaseHistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-x-hidden bg-[url('/images/quests/bg-quest.jpg')] bg-no-repeat bg-top bg-cover">
      <MainHeader />

      <main className="max-w-[1920px] mx-auto pt-4 py-8 md:py-12">{children}</main>
      <Footer />
    </div>
  );
}

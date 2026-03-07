import type { Metadata } from 'next';
import '../styles/global.scss';
import '../styles/_common.scss';
import React from 'react';
import { MainHeader } from '../components/main-header';
import { Footer } from '../components/footer/Footer';

export const metadata: Metadata = {
  title: 'Payment Successful - Gunnies',
  description: 'Your payment has been processed successfully. Thank you for your purchase!',
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-x-hidden bg-[url('/images/quests/bg-quest.jpg')] bg-no-repeat bg-top bg-cover">
      <MainHeader />
      <main className="max-w-[1920px] mx-auto px-6 py-8 md:py-12">{children}</main>
      <Footer />
    </div>
  );
}

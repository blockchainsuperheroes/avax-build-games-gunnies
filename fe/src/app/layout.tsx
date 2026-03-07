'use client';

import './styles/global.scss';
import './styles/_common.scss';
import React from 'react';
import { Providers } from './providers';
import GoogleAnalytics from './components/GoogleAnalytics';
import { Chakra_Petch, Sora, Barlow, Lexend_Giga } from 'next/font/google';
import localFont from 'next/font/local';

const chakra = Chakra_Petch({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-chakra',
});

const sora = Sora({
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-sora',
});

const anton = Barlow({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-barlow',
});

const lexendGiga = Lexend_Giga({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal'],
  subsets: ['latin'],
  variable: '--font-lexend-giga',
});

const populationZeroBB = localFont({
  src: '../fonts/PopulationZeroBB.otf',
  display: 'swap',
  variable: '--font-population-zero-bb',
});

const batgrexo = localFont({
  src: '../fonts/BATGREXO.otf',
  display: 'swap',
  variable: '--font-batgrexo',
});

const impact = localFont({
  src: '../fonts/IMPACT.ttf',
  display: 'swap',
  variable: '--font-impact',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <GoogleAnalytics />
      </head>
      <body
        className={`${chakra.variable} ${anton.variable} ${sora.variable} ${lexendGiga.variable} ${populationZeroBB.variable} ${batgrexo.variable} ${impact.variable} bg-black relative overflow-x-hidden`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

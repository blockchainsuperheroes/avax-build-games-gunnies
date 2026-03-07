'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LoadingScreen() {
  const [loadingText, setLoadingText] = useState('Loading Gunnies');

  useEffect(() => {
    const texts = [
      'Loading Gunnies',
      'Loading Gunnies.',
      'Loading Gunnies..',
      'Loading Gunnies...',
      'Gathering karrots...',
      'Preparing karrots...',
      'Loading karrots...',
    ];
    let index = 0;

    const interval = setInterval(() => {
      setLoadingText(texts[index]);
      index = (index + 1) % texts.length;
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6">
        {/* Main Spinner with Gaming Theme */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-20 h-20 border-4 border-gray-700 rounded-full"></div>
          {/* Spinning Ring */}
          <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-red-500 border-r-red-400 rounded-full animate-spin"></div>
          {/* Inner Glow Effect */}
          <div
            className="absolute inset-2 w-16 h-16 border-2 border-transparent border-t-orange-400 rounded-full animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
          {/* Center Carrot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/quests/carrot.png"
              alt="Carrot"
              width={24}
              height={24}
              className="object-contain animate-pulse"
            />
          </div>
        </div>

        {/* Animated Loading Text */}
        <div className="text-white font-sora text-xl font-semibold tracking-wide min-h-[28px] flex items-center">
          {loadingText}
        </div>

        {/* Optional: Gaming-style subtext */}
        <div className="text-gray-400 text-sm font-sora mt-4 opacity-75">
          Preparing your battlefield...
        </div>
      </div>
    </div>
  );
}

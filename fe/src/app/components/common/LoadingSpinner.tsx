import React from 'react';
import Image from 'next/image';

export const LoadingSpinner = ({ size = 32 }: { size?: number }) => (
  <div className="flex items-center justify-center max-w-48 w-48">
    <div className="relative">
      <div
        className="animate-spin rounded-full border-2 border-coreColor border-t-transparent"
        style={{ height: `${size}px`, width: `${size}px` }}
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <Image src="/images/quests/carrot.png" alt="Loading" width={size + 4} height={size + 4} />
      </div>
    </div>
  </div>
);

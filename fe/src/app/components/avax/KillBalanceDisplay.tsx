'use client';

import React from 'react';
import useKillBalance from '@/hooks/useKillBalance';
import { useAccount } from 'wagmi';

export default function KillBalanceDisplay() {
  const { killCount, isLoading, isConnected } = useKillBalance();
  const { address } = useAccount();

  if (!isConnected || !address) {
    return (
      <div className="border border-white/20 rounded-xl p-6 md:p-8 bg-black/40 max-w-[1569px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-white text-xl md:text-2xl font-chakra font-bold uppercase">
              🎯 On-Chain Kill Count
            </h3>
            <p className="text-gray-400 text-sm md:text-base font-chakra mt-1">
              Connect your wallet to see your kill stats on Avalanche
            </p>
          </div>
          <div className="bg-[#E84142]/20 border border-[#E84142]/40 rounded-lg px-6 py-3">
            <p className="text-gray-500 text-3xl md:text-5xl font-bold font-chakra">---</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#E84142]/40 rounded-xl p-6 md:p-8 bg-gradient-to-r from-black/60 to-[#E84142]/10 max-w-[1569px] mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-white text-xl md:text-2xl font-chakra font-bold uppercase">
            🎯 On-Chain Kill Count
          </h3>
          <p className="text-gray-400 text-sm md:text-base font-chakra mt-1">
            Your verified kills on Avalanche C-Chain via GunniesKiller contract
          </p>
          <p className="text-gray-500 text-xs font-mono mt-1 truncate max-w-[300px]">
            {address}
          </p>
        </div>
        <div className="bg-[#E84142]/20 border border-[#E84142] rounded-lg px-8 py-4 min-w-[140px] text-center">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-12 bg-[#E84142]/30 rounded w-20 mx-auto" />
            </div>
          ) : (
            <>
              <p className="text-[#E84142] text-4xl md:text-5xl font-bold font-chakra">
                {killCount.toLocaleString()}
              </p>
              <p className="text-white/60 text-xs font-chakra uppercase mt-1">Total Kills</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

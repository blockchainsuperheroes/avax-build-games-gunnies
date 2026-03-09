'use client';

import React from 'react';

export default function AvaxInfoContent() {
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3">
        <p className="text-[64px] md:text-[96px]">🏔️</p>
        <div>
          <p className="text-[#E84142] text-2xl md:text-4xl font-bold font-chakra text-center uppercase">
            How do I get AVAX tokens?
          </p>
          <p className="text-white text-xl md:text-2xl font-normal font-chakra text-center md:px-4">
            AVAX is the native token of the Avalanche blockchain. You need AVAX to open daily loot
            boxes and purchase the Kaboom Pass NFT.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start justify-center gap-4 mt-8">
        <div>
          <p className="text-[#FF8F00] text-base font-bold font-chakra uppercase">
            Step 1: Add the Avalanche C-Chain network to your wallet
          </p>
          <p className="text-white text-base font-normal font-chakra">
            Go to: Network &gt; Add Network &gt; Add manually
          </p>
          <p className="text-white text-base font-normal font-chakra">Use these details:</p>
          <div className="ml-4">
            <li className="text-white text-base font-normal font-chakra">
              Network Name: Avalanche C-Chain
            </li>
            <li className="text-white text-base font-normal font-chakra">
              RPC URL:{' '}
              <a
                href="https://api.avax.network/ext/bc/C/rpc"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#E84142]"
              >
                https://api.avax.network/ext/bc/C/rpc
              </a>
            </li>
            <li className="text-white text-base font-normal font-chakra">Chain ID: 43114</li>
            <li className="text-white text-base font-normal font-chakra">Currency Symbol: AVAX</li>
            <li className="text-white text-base font-normal font-chakra">
              Block Explorer:{' '}
              <a
                className="underline text-[#E84142]"
                href="https://snowtrace.io/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://snowtrace.io/
              </a>
            </li>
          </div>
        </div>

        <div>
          <p className="text-[#FF8F00] text-base font-bold font-chakra uppercase">
            Step 2: Buy AVAX tokens
          </p>
          <p className="text-white text-base font-normal font-chakra">Buy from these exchanges:</p>
          <div className="ml-4">
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://www.coinbase.com/" target="_blank" rel="noopener noreferrer" className="underline text-[#E84142]">
                Coinbase
              </a>
            </li>
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://www.binance.com/" target="_blank" rel="noopener noreferrer" className="underline text-[#E84142]">
                Binance
              </a>
            </li>
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://www.kraken.com/" target="_blank" rel="noopener noreferrer" className="underline text-[#E84142]">
                Kraken
              </a>
            </li>
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://www.okx.com/" target="_blank" rel="noopener noreferrer" className="underline text-[#E84142]">
                OKX
              </a>
            </li>
            <li className="text-white text-base font-normal font-chakra">
              <a href="https://traderjoexyz.com/" target="_blank" rel="noopener noreferrer" className="underline text-[#E84142]">
                Trader Joe (DEX)
              </a>
            </li>
          </div>
        </div>
      </div>

      <p className="text-white text-base font-normal font-chakra mt-4 mb-8 md:mb-24">
        Search for AVAX/USDT, buy your tokens, and withdraw to your EVM wallet on Avalanche C-Chain.
      </p>
    </>
  );
}

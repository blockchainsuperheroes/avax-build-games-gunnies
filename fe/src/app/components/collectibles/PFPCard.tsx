'use client';

import React from 'react';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useGlobalContext } from '@/app/providers/GlobalProvider';
import { Tooltip } from '../common/Tooltip';

type PFPStatus = 'mint' | 'sbt' | 'nft';

interface PFPCardProps {
  id: number;
  name: string;
  image: string;
  status: PFPStatus;
  price?: string; // For SBT status, e.g., "0.1 PC"
  isFreeMint?: boolean; // For mint status
  mintFeeDisplay?: string; // From contract, e.g., "0.1 PC"
  isTxLoading?: boolean; // True while mint or upgrade tx is pending
  onMint?: () => void;
  onUpgrade?: () => void;
}

export const PFPCard: React.FC<PFPCardProps> = ({
  id,
  name,
  image,
  status,
  price,
  mintFeeDisplay,
  isTxLoading = false,
  onMint,
  onUpgrade,
}) => {
  const { isConnected } = useAccount();
  const { showWalletDetectionModal } = useGlobalContext();

  const handleConnectWallet = () => {
    showWalletDetectionModal(() => {
      console.log('[PFP] Wallet connect requested');
    });
  };

  const handleMint = () => {
    console.log('[PFP] PFPCard: MINT clicked', { tokenId: id, name, status });
    onMint?.();
  };

  const handleUpgrade = () => {
    console.log('[PFP] PFPCard: UPGRADE clicked', { tokenId: id, name, status });
    onUpgrade?.();
  };

  return (
    <div className="flex flex-col border border-[#7C7C7C] rounded-lg p-3 bg-transparent relative">
      {/* Character Image */}
      <div className="relative">
        {/* Status Badge */}
        {(status === 'sbt' || status === 'nft') && (
          <div className={`absolute bottom-2 left-2 z-10 flex flex-row rounded-full bg-[#FF8F00] ${status === 'sbt' ? 'bg-[#FF8F00]' : 'bg-black'}`}>
            <div className={`px-2 py-1 rounded-2xl ${status === 'sbt' ? 'bg-black' : 'bg-[#EDBA2C]'}`}>
              <span className={`text-[8px] md:text-[11px] font-bold uppercase font-chakra ${status === 'sbt' ? 'text-white' : 'text-black'}`}>
                {status === 'sbt' ? 'SBT' : 'NFT'}
              </span>
            </div>
            <div className="pl-1 md:pl-2 pr-2 md:pr-3 md:py-1 rounded-r">
              <span className={`text-[8px] md:text-[10px] font-semibold uppercase font-chakra ${status === 'sbt' ? 'text-black' : 'text-[#EDBA2C]'}`}>
                {status === 'sbt' ? 'Bound To Wallet' : 'Rights Protected'}
              </span>
            </div>
          </div>
        )}
        <Image
          src={image}
          alt={name}
          width={200}
          height={200}
          className={`rounded w-full h-auto object-cover ${status === 'mint' && 'opacity-50'}`}
        />
        {/* Ethereum Icon */}
        {status === 'mint' && (
          <div className="absolute bottom-2 right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#627EEA] flex items-center justify-center z-10">
            <Image src="/assets/icons/eth-icon.png" alt="Ethereum" className="w-full h-full object-contain" width={16} height={16} />
          </div>
        )}
      </div>

      {/* Character Name and ID */}
      <div className="mt-2 text-center">
        <p className="text-white text-xs md:text-sm font-bold uppercase font-chakra">
          {name} #{id}
        </p>
      </div>

      {/* Action Section */}
      <div className="mt-2">
        {!isConnected ? (
          <button
            onClick={handleConnectWallet}
            className="w-full bg-transparent transition-colors rounded px-2 md:px-4 py-2 md:py-3 flex items-center justify-center gap-2 relative border border-[#7C7C7C]"
          >
            <span className="text-white text-xs md:text-sm font-bold uppercase font-chakra">
              CONNECT WALLET
            </span>
          </button>
        ) : (
          <>
            {status === 'mint' && (
              <div className="relative">
                <button
                  onClick={handleMint}
                  disabled={isTxLoading}
                  className="w-full bg-[#02FB0B] hover:bg-[#02FB0B]/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded px-2 md:px-4 py-2 md:py-3 flex items-center justify-center gap-2 relative border border-[#7C7C7C]"
                >
                  <span className="text-black text-xs md:text-sm font-bold uppercase font-chakra">
                    {isTxLoading ? 'PROCESSING...' : mintFeeDisplay ? `MINT ON PC (${mintFeeDisplay})` : 'MINT ON PC'}
                  </span>
                  {mintFeeDisplay && (
                    <Tooltip
                      content={`Mint fee: ${mintFeeDisplay} – paid on Avalanche`}
                      position="top-middle"
                      offsetX={-120}
                      offsetY={-30}
                      className="cursor-pointer"
                    >
                      <Image src="/assets/icons/ic-question.svg" alt="Question Mark" width={16} height={16} className="w-4 h-4 md:w-6 md:h-6" />
                    </Tooltip>
                  )}
                </button>
              </div>
            )}

            {status === 'sbt' && (
              <div className="space-y-2">
                <button
                  onClick={handleUpgrade}
                  disabled={isTxLoading}
                  className="w-full bg-transparent border border-[#7C7C7C] hover:border-[#7C7C7C]/80 disabled:opacity-60 disabled:cursor-not-allowed transition-colors rounded-md px-2 md:px-4 py-2 md:py-3 flex flex-col items-center justify-center gap-0.5"
                >
                  <div className="flex items-center justify-center gap-1">
                    <Image src="/assets/icons/avalanche.svg" alt="Upgrade" width={16} height={16} />
                    <p className="text-white text-xs md:text-sm font-bold uppercase font-chakra">{price ?? '—'}</p>
                  </div>
                  <p className="text-[#EDBA2C] text-xs md:text-sm font-bold uppercase font-chakra">
                    {isTxLoading ? 'PROCESSING...' : 'UPGRADE TO NFT'}
                  </p>
                </button>
              </div>
            )}

            {status === 'nft' && (
              <button
                className="w-full bg-[#EDBA2C] hover:bg-[#EDBA2C/30] transition-colors rounded px-2 md:px-4 py-2 md:py-3"
              >
                <span className="text-black text-xs md:text-sm font-bold uppercase font-chakra">
                  FULLY ACTIVATED
                </span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

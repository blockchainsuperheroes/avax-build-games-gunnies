'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ProfileCharacterCard } from '../components/profile/ProfileCharacterCard';
import { GCN_CARDS_DATA, GCN_TYPES } from '../constants/gcn';
import { PFPCard } from '../components/collectibles/PFPCard';
import { ROUTES } from '../constants/routes';
import Link from 'next/link';
import { useGunniesPfpNfts } from '@/hooks/useGunniesPfpNfts';
import { usePfpGunnies } from '@/hooks/usePfpGunnies';

type TabType = 'shard' | 'holo' | 'gold';

function PFPGrid() {
  const { items, isLoading: isLoadingNfts, error, refetch, isConnected } = useGunniesPfpNfts();
  const {
    mintSbt,
    upgradeToNft,
    mintFeeDisplay,
    upgradeFeeDisplay,
    isLoading: isPfpTxLoading,
    pendingTokenIds,
  } = usePfpGunnies();

   if (!isConnected) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-[28px] rounded-xl border border-[#7E7E7E]">
        <p className="col-span-full text-center text-white/70 font-sora py-8">
          Connect your wallet to view your Gunnies PFP collection (Chain Bunnies, SBT, NFT).
        </p>
      </div>
    );
  }

  if (isLoadingNfts) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-[28px] rounded-xl border border-[#7E7E7E]">
        <p className="col-span-full text-center text-white/70 font-sora py-8">Loading your collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-[28px] rounded-xl border border-[#7E7E7E]">
        <p className="col-span-full text-center text-red-400 font-sora py-4">{error}</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="col-span-full mx-auto px-6 py-2 rounded-lg border border-[#7E7E7E] text-white font-chakra uppercase"
        >
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-[28px] rounded-xl border border-[#7E7E7E]">
        <p className="col-span-full text-center text-white/70 font-sora py-8">No PFP NFTs found for this wallet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 md:p-[28px] rounded-xl border border-[#7E7E7E]">
      {items.map((pfp) => (
        <PFPCard
          key={`${pfp.id}-${pfp.status}`}
          id={pfp.id}
          name={pfp.name}
          image={pfp.image}
          status={pfp.status}
          price={upgradeFeeDisplay ?? pfp.price}
          isFreeMint={pfp.isFreeMint}
          mintFeeDisplay={mintFeeDisplay}
          isTxLoading={isPfpTxLoading && pendingTokenIds.has(pfp.id)}
          onMint={() => mintSbt(pfp.id)}
          onUpgrade={() => upgradeToNft(pfp.id)}
        />
      ))}
    </div>
  );
}

export default function CollectiblesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('shard');
  return (
    <section className="min-h-[calc(100dvh-300px)]">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-10 md:gap-[60px] py-12 md:py-24 px-4">
          {/* Header Section */}
          <div className="flex flex-col items-center gap-4 md:gap-6 mt-16">
            <Image
              width={210}
              height={118}
              src="/images/logo.png"
              alt="Gunnies logo"
              className="w-[210px] h-[117px]"
            />

            <div className="text-center mt-6 md:mt-[25px]">
              <p className="linear-grad1 text-4xl md:text-[60px] md:leading-[66px] font-chakra uppercase font-bold">
                DIGITAL COLLECTIBLES
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[860px] mx-auto px-4 md:px-0">
        <p className="text-white text-[32px] md:text-[42px] font-bold font-batgrexo uppercase text-center">Your GUNNIES CHARACTER (HERO) CARDS</p>
        <div>
          <p className="text-[#1CBBBB] text-2xl md:text-[32px] font-bold font-chakra uppercase text-center">PLAY MORE & EARN FAST</p>
          <p className="text-white text-sm md:text-lg font-sora text-center">Gather 100 of the shards to upgrade it to a Holo Card, or 1000 of the same shards to evolve it into a Gold Card. Keep completing Daily Quests to build your collection and climb through the card tiers!</p>
        </div>

        <div className="flex items-center justify-center mt-6 md:mt-20 relative h-[100px]">
          {(['shard', 'holo', 'gold'] as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            const zIndex = isActive ? 30 : 10;

            return (
              <Image
                key={tab}
                width={860}
                height={100}
                src={`/images/collectibles/${tab}-${isActive ? 'active' : 'inactive'}.png`}
                alt={`${tab} ${isActive ? 'active' : 'inactive'}`}
                className="object-contain transition-all duration-300 hover:opacity-80 absolute w-full scale-100"
                style={{ zIndex }}
              />
            );
          })}

          {/* Invisible clickable buttons */}
          <div className="flex items-center justify-center gap-0 absolute inset-0 z-50 h-10 mt-6">
            {(['shard', 'holo', 'gold'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="scale-100 w-[140px] h-full bg-transparent cursor-pointer"
                aria-label={`${tab} tab`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-11 md:-mt-8 bg-black p-4 md:p-[28px] rounded-xl border border-[#7E7E7E] relative z-[999]">
          {activeTab === 'shard' && Object.entries(GCN_CARDS_DATA[GCN_TYPES.SHARD]).map(([id, card]) => (
            <ProfileCharacterCard
              key={`shard-${id}`}
              cardId={Number(id)}
              card={card}
              rarity="SHARD"
              balance={0}
            />
          ))}
          {activeTab === 'holo' && Object.entries(GCN_CARDS_DATA[GCN_TYPES.HOLO]).map(([id, card]) => (
            <ProfileCharacterCard
              key={`holo-${id}`}
              cardId={Number(id)}
              card={card}
              rarity="HOLO"
              balance={0}
            />
          ))}
          {activeTab === 'gold' && Object.entries(GCN_CARDS_DATA[GCN_TYPES.GOLD]).map(([id, card]) => (
            <ProfileCharacterCard
              key={`gold-${id}`}
              cardId={Number(id)}
              card={card}
              rarity="GOLD"
              balance={0}
            />
          ))}
        </div>
      </div>

      {/* PFP Section */}
      <div className="w-full md:w-[860px] mx-auto mt-16 px-4 md:px-0">
        <h2 className="text-white text-[32px] md:text-[42px] font-bold font-batgrexo uppercase text-center mb-2">
          YOUR GUNNIES PFP
        </h2>
        <p className="text-[#1CBBBB] text-2xl md:text-[32px] font-bold font-chakra uppercase text-center mb-4">
          GUNNIES PFP CLAIM
        </p>
        <p className="text-white text-sm md:text-lg font-sora text-center mb-6 max-w-3xl mx-auto">
          Claim your Gunnies PFP on the Avalanche. Snapshot taken in January 2026. Upgrade costs may increase over time.
        </p>

        <PFPGrid />
      </div>

      <div className="flex justify-center mt-6 md:mt-16">
        <Link
          href={ROUTES.DOWNLOAD}
          className="bg-[#1CBBBC] hover:bg-[#1CBBBC]/80 transition-colors px-12 md:px-16 py-4 md:py-6 rounded-lg w-full max-w-[400px]"
        >
          <p className="text-white text-lg md:text-2xl font-bold font-chakra uppercase text-center">
            PLAY NOW
          </p>
        </Link>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { GCN_CARDS_DATA, GCN_TYPES } from '@/app/constants/gcn';
import { ProfileCharacterCard } from './ProfileCharacterCard';

export const CharacterCardsSection = () => {
  return (
    <div className="bg-black rounded-xl py-5 px-6 md:py-11 md:px-12 mb-5 md:mb-12 border-[0.5px] border-[#7E7E7E]">
      <h2 className="text-white text-[32px] md:text-[42px] font-bold font-batgrexo uppercase mb-4 md:mb-[28px] text-center md:text-left">
        YOUR GUNNIES CHARACTER CARDS
      </h2>
      <p className="text-[#1CBBBB] text-2xl md:text-[32px] font-bold font-chakra uppercase">
        PLAY MORE & EARN FAST
      </p>
      <p className="text-white text-base md:text-xl font-sora mb-5 md:mb-7">
        Collect Gunnies Character Cards each day by completing the Daily Quest. Gather 100 of the
        same Standard Card to upgrade it to a Holo Card, and collect 100 of the same Holo Card to
        evolve it into a Gold Card.
      </p>

      {/* SHARD Cards */}
      <div className="mb-8">
        <h3 className="text-white text-xl md:text-2xl font-bold uppercase mb-3 font-chakra">SHARD</h3>
        <hr className="mb-5 border-[#7E7E7E]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(GCN_CARDS_DATA[GCN_TYPES.SHARD]).map(([id, card]) => (
            <ProfileCharacterCard
              key={`shard-${id}`}
              cardId={Number(id)}
              card={card}
              rarity="SHARD"
              balance={0}
            />
          ))}
        </div>
      </div>

      {/* HOLO Cards */}
      <div className="mb-8">
        <h3 className="text-white text-xl md:text-2xl font-bold uppercase mb-3 font-chakra">HOLO CHARACTER CARD</h3>
        <hr className="mb-5 border-[#7E7E7E]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(GCN_CARDS_DATA[GCN_TYPES.HOLO]).map(([id, card]) => (
            <ProfileCharacterCard
              key={`holo-${id}`}
              cardId={Number(id)}
              card={card}
              rarity="HOLO"
              balance={0}
            />
          ))}
        </div>
      </div>

      {/* GOLD Cards */}
      <div>
        <h3 className="text-white text-xl md:text-2xl font-bold uppercase mb-3 font-chakra">GOLD CHARACTER CARD</h3>
        <hr className="mb-5 border-[#7E7E7E]" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(GCN_CARDS_DATA[GCN_TYPES.GOLD]).map(([id, card]) => (
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
    </div>
  );
};

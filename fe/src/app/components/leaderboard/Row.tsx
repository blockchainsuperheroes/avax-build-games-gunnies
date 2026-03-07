import React, { useMemo } from 'react';
import Image from 'next/image';
function Row({
  rank,
  player,
  collectedStar,
  currentPlayer = false,
}: {
  rank: number;
  player: string;
  collectedStar: number;
  currentPlayer?: boolean;
}) {
  const renderRank = useMemo(() => {
    if (rank === 1) {
      return (
        <Image
          className="w-[22px] h-[33px] md:w-[33px] md:h-[52px]"
          src="/images/leaderboard/1.png"
          alt="1"
          width={33}
          height={52}
        />
      );
    } else if (rank === 2) {
      return (
        <Image
          className="w-[22px] h-[33px] md:w-[33px] md:h-[52px]"
          src="/images/leaderboard/2.png"
          alt="2"
          width={33}
          height={52}
        />
      );
    } else if (rank === 3) {
      return (
        <Image
          className="w-[22px] h-[33px] md:w-[33px] md:h-[52px]"
          src="/images/leaderboard/3.png"
          alt="3"
          width={33}
          height={52}
        />
      );
    } else {
      return (
        <p className="text-white text-[25px] font-lexend-giga font-normal uppercase text-center">
          #{rank}
        </p>
      );
    }
  }, [rank]);

  const renderExtraRewards = useMemo(() => {
    if (rank === 1) {
      return '250';
    } else if (rank === 2) {
      return '150';
    } else if (rank === 3) {
      return '100';
    } else if (rank === 4 || rank === 5) {
      return '75';
    } else if (rank >= 6 && rank <= 10) {
      return '50';
    } else if (rank >= 11 && rank <= 20) {
      return '25';
    } else if (rank >= 21 && rank <= 30) {
      return '15';
    } else if (rank >= 31 && rank <= 70) {
      return '12';
    } else if (rank >= 71 && rank <= 100) {
      return '10';
    }
    return '0';
  }, [rank]);

  return (
    <div
      className={`grid grid-cols-[80px_1fr_1fr] md:grid-cols-[100px_2fr_3fr] gap-2 md:gap-8 ${currentPlayer ? 'bg-yellow-700' : 'bg-black'} max-w-[1573px] mx-auto px-2 py-4 md:p-4 border border-white/50 rounded-lg w-full`}
    >
      <div className="col-span-1 flex items-center justify-center">{renderRank}</div>
      {/* Desktop */}
      <div className="hidden col-span-1 md:block md:relative">
        <div className="md:absolute flex items-center justify-start gap-4 top-1/2 left-8 transform translate-x-0 -translate-y-1/2">
          <Image src="/images/leaderboard/avatar.png" alt="avatar" width={104} height={105} />
          <p className="text-white text-[25px] font-lexend-giga uppercase text-center">{player}</p>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center col-span-1">
        <div className="flex items-center justify-start gap-4">
          <Image src="/images/quests/star-circle.png" alt="Badge image" width={44} height={51} />
          <p className="text-white text-[25px] font-lexend-giga uppercase text-center">
            {collectedStar}
          </p>
        </div>
      </div>
      {/* <div className="hidden col-span-1 md:flex items-center justify-start gap-2">
        <p className="text-[#FFAD00] text-[25px] font-lexend-giga uppercase text-center">
          {renderExtraRewards}
        </p>
        <Image src="/images/quests/usdt.png" alt="USDT Token" width={32} height={32} />
      </div>
      <div className="hidden col-span-1 md:flex items-center justify-start gap-2">
        <p className="text-[#FFAD00] text-[25px] font-lexend-giga uppercase text-center">
          {renderExtraRewards}
        </p>
        <Image src="/images/quests/usdt.png" alt="USDT Token" width={32} height={32} />
      </div> */}

      {/* Mobile */}
      <div className="flex items-center justify-start gap-2 md:hidden col-span-1">
        <Image src="/images/leaderboard/avatar.png" alt="avatar" width={51} height={52} />
        <div className="flex flex-col items-start justify-center gap-2">
          <p className="text-white text-sm font-lexend-giga text-left truncate w-20">{player}</p>
        </div>
      </div>

      <div className="flex md:hidden items-center justify-center gap-2">
        <Image src="/images/quests/star-circle.png" alt="Badge image" width={18} height={21} />
        <p className="text-white text-sm font-lexend-giga uppercase text-center">{collectedStar}</p>
      </div>
    </div>
  );
}

export default Row;

"use client";

import { Banner } from "@/app/components/quests/Banner";
import ProgressSection from "@/app/components/quests/ProgressSection";
import QuestSectionAvax from "@/app/components/quests/QuestSectionAvax";
import RewardsSummary from "@/app/components/quests/RewardsSummary";
import { useSyncRewards } from "@/app/components/quests/syncRewards";
import {
  QUESTS_CONFIG,
  REMAINING_CHESTS,
  USER_TYPES,
} from "@/app/constants/questsConfig";
import { useRef, useEffect, useState } from "react";
import { useResponsiveScale } from "@/hooks/useResponsiveScale";
import { useChestCount, useHasAvaxPremiumUserChests } from "@/hooks/useChestCount";
import { useMedia } from "react-use";
import { EXTERNAL_LINK } from "@/app/constants/external_link";
import { useGlobalContext } from "@/app/providers/GlobalProvider";
import { toast } from "react-toastify";
import AvaxMintSection from "@/app/components/avax/AvaxMintSection";
import AvaxInfoContent from "@/app/components/avax/AvaxInfoContent";
import KillBalanceDisplay from "@/app/components/avax/KillBalanceDisplay";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

export default function AvaxPage() {
  useSyncRewards();
  const maxChest = QUESTS_CONFIG.maxChest;
  const avaxPremiumUserChests = useHasAvaxPremiumUserChests();
  const isMobile = useMedia('(max-width: 768px)', true);
  const { showLoginSignUpModal, isAuthenticated } = useGlobalContext();
  const { data: session }: any = useSession();

  const { claimed: completedAvax } = useChestCount({
    remainingChestType: REMAINING_CHESTS.AVAX,
    userType: USER_TYPES.NORMAL_USER,
  });

  const { claimed: completedAvaxPremium } = useChestCount({
    remainingChestType: REMAINING_CHESTS.AVAX,
    userType: USER_TYPES.PREMIUM_USER,
  });

  const totalCompletedAvax =
    completedAvax + (avaxPremiumUserChests ? completedAvaxPremium : 0);
  const totalAvaxChests = maxChest * 2;
  const percentAvax = Math.round((totalCompletedAvax / totalAvaxChests) * 100);

  const sectionRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { isScaled, scale } = useResponsiveScale({ ref: sectionRef, scaleOverride: 0.8 });

  const {
    data: killsData,
    isLoading: isLoadingKills,
    isError: isKillsError,
    error: killsError,
  } = useQuery<UserKillsResponse>({
    queryKey: ['userKills'],
    queryFn: async () => {
      if (!session?.user?.gunnies_access_token) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_GUNNIES_API}/user/kills`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.gunnies_access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: UserKillsResponse = await response.json();

      if (!data.success) {
        throw new Error('Failed to fetch kill history');
      }

      return data;
    },
    enabled: isAuthenticated,
    retry: 2,
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (wrapperRef.current && sectionRef.current && !isMobile) {
      const unscaledHeight = sectionRef.current.scrollHeight;
      wrapperRef.current.style.height = `${unscaledHeight * scale + 100}px`;
    }
  }, [scale, isScaled, isMobile]);

  return (
    <div ref={wrapperRef} className="xl:flex xl:justify-center" style={{ overflow: 'hidden' }}>
      <section
        ref={sectionRef}
        className={`w-full max-w-[1920px] mx-auto px-3 md:px-8 2xl:px-16 design-container transition-opacity duration-200 ${
          isScaled ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Title */}
        <div className="my-12">
          <p className="font-chakra text-4xl md:text-[60px] font-bold text-center linear-grad1 uppercase mb-4">
            YOUR ALL TIME LOOT BOX REWARD
          </p>
          <p className="font-chakra text-lg md:text-2xl text-center text-[#E84142] font-bold uppercase mb-2">
            Powered by Avalanche
          </p>
          {!isAuthenticated && (
            <p className="font-chakra text-base md:text-xl text-center text-white linear-grad1 font-bold uppercase">
              <span
                className="cursor-pointer border-b-2 border-white pb-[2px]"
                onClick={() => {
                  if (isAuthenticated) {
                    toast.info('Already logged in');
                  } else {
                    showLoginSignUpModal();
                  }
                }}
              >
                Login the game
              </span>{' '}
              to see your IN-GAME total stats
            </p>
          )}
        </div>

        {/* Banner - balances */}
        <Banner />

        {/* Kill Balance Display */}
        <div className="mt-6 mb-4">
          <KillBalanceDisplay />
        </div>

        <div className="mt-10">
          <KillsHistorySection
            isAuthenticated={isAuthenticated}
            killsData={killsData}
            isLoading={isLoadingKills}
            isError={isKillsError}
            error={killsError instanceof Error ? killsError.message : undefined}
          />
          </div>

        {/* Rewards Summary */}
        <RewardsSummary />

        {/* Kaboom Pass Mint Section */}
        <AvaxMintSection />

        {/* Daily Loot Box Section */}
        <p className="font-chakra text-4xl md:text-[60px] text-center md:leading-[66px] text-white linear-grad1 font-bold uppercase py-6 mt-6 md:mt-[120px] mb-6 md:mb-16">
          CHECK IN DAILY & CLAIM YOUR <br /> loot box REWARDS
        </p>

        {/* Avalanche Loot Boxes */}
        <div className="border-[18px] border-[#E84142] rounded-2xl mx-auto shadow-[0px_0px_36px_0px_rgba(232,65,66,0.3)] max-w-[1569px]">
          <ProgressSection
            image="/images/quests/avax-logo.png"
            width={120}
            height={120}
            percent={percentAvax}
            content={<AvaxInfoContent />}
          />
          {/* Normal Chests */}
          <QuestSectionAvax userType={USER_TYPES.NORMAL_USER} />

          {/* Premium Chests (if user has Kaboom Pass) */}
          {avaxPremiumUserChests && (
            <QuestSectionAvax userType={USER_TYPES.PREMIUM_USER} />
          )}
        </div>

        {/* Fair Gameplay Section */}
        <div className="border-[.5px] border-white rounded-[10px] p-5 md:px-8 md:py-8 mb-4 md:mb-10 max-w-[1569px] mx-auto gap-4 md:gap-0 mt-10">
          <p className="font-batgrexo text-3xl md:text-4xl text-center text-white font-bold uppercase py-6">
            🎯 FAIR GAMEPLAY — VERIFIED ON-CHAIN
          </p>
          <p className="text-base md:text-lg font-sora text-white text-center max-w-[900px] mx-auto mb-6">
            For fair gameplay, each real in-game KO is tracked on the Avalanche blockchain and fully verifiable.
            No fake stats. No manipulation. Every kill is recorded on-chain through the{' '}
            <a
              href="https://snowtrace.io/address/0x45eFd10b36CC2fAC20852e47371BeBb36FB47C1c#code"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E84142] underline hover:text-[#ff6b6b]"
            >
              GunniesKiller contract
            </a>
            {' '}on Avalanche C-Chain.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1100px] mx-auto">
            <div className="text-center">
              <p className="text-[48px] mb-2">🔫</p>
              <p className="text-white text-xl font-chakra font-bold uppercase mb-2">Every Kill Counts</p>
              <p className="text-white/80 text-sm font-sora">
                Each in-game elimination is reported to the backend and batched for on-chain submission.
              </p>
            </div>
            <div className="text-center">
              <p className="text-[48px] mb-2">⛓️</p>
              <p className="text-white text-xl font-chakra font-bold uppercase mb-2">On-Chain Proof</p>
              <p className="text-white/80 text-sm font-sora">
                Kill counts are synced to the GunniesKiller smart contract on Avalanche every 15 minutes.
              </p>
            </div>
            <div className="text-center">
              <p className="text-[48px] mb-2">🔍</p>
              <p className="text-white text-xl font-chakra font-bold uppercase mb-2">Fully Verifiable</p>
              <p className="text-white/80 text-sm font-sora">
                Anyone can verify any player&apos;s kill history on Snowtrace. Transparent and tamper-proof.
              </p>
            </div>
          </div>
        </div>

        {/* Support Button */}
        <button
          type="button"
          className="bg-[#E84142] hover:bg-[#c73536] transition-colors px-8 md:px-16 py-4 md:py-6 rounded-lg mx-auto mt-8 md:mt-[100px] w-fit block"
          onClick={() => window.open(EXTERNAL_LINK.SUPPORT_FORM, '_blank', 'noopener,noreferrer')}
        >
          <p className="text-white font-semibold text-xl md:text-2xl font-chakra text-center uppercase">
            Got trouble? Let us know
          </p>
        </button>
      </section>
    </div>
  );
}

interface KillLog {
  chain_id: number;
  tx_hash: string;
  status: string;
  created_at: string;
  explorer_link: string;
}

interface KillItem {
  id: number;
  match_id: string;
  count: number;
  created_at: string;
  to_user_username: string;
  logs: KillLog[];
}

interface UserKillsResult {
  total_kills: number;
  items: KillItem[];
  total_item: number;
  total_page: number;
}

interface UserKillsResponse {
  success: boolean;
  result: UserKillsResult;
}

interface KillsHistorySectionProps {
  isAuthenticated: boolean;
  killsData?: UserKillsResponse;
  isLoading: boolean;
  isError: boolean;
  error?: string;
}

const KillsHistorySection = ({
  isAuthenticated,
  killsData,
  isLoading,
  isError,
  error,
}: KillsHistorySectionProps) => {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  if (!isAuthenticated) {
    return (
      <div className="px-4 md:px-10 pt-6 pb-8 border-t border-white/10 bg-black/40">
        <p className="font-chakra text-lg md:text-2xl text-white text-center">
          Login to see your kill history and rewards.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-4 md:px-10 pt-6 pb-8 border-t border-white/10 bg-black/40">
        <p className="font-chakra text-lg md:text-2xl text-white text-center">Loading kill history...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 md:px-10 pt-6 pb-8 border-t border-white/10 bg-black/40">
        <p className="font-chakra text-lg md:text-2xl text-[#FF8F00] text-center">
          Unable to load kill history{error ? `: ${error}` : ''}.
        </p>
      </div>
    );
  }

  const items = killsData?.result.items;
  const totalItems = killsData?.result.total_item;
  const totalPages = killsData?.result.total_page;

  const currentPage = Math.min(page, totalPages ?? 0);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items?.slice(startIndex, startIndex + pageSize) ?? [];

  if (!items?.length) {
    return (
      <div className="px-4 md:px-10 pt-6 pb-8 border-t border-white/10 bg-black/40">
        <p className="font-chakra text-lg md:text-2xl text-white text-center">
          No kill history yet. Jump into matches to start earning rewards!
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 md:px-8 lg:px-10 pb-10 pt-6 md:pt-8 bg-[radial-gradient(circle_at_top,_#160506,_#050509)] border border-[#E84142]/40 rounded-xl max-w-[1569px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4 md:mb-6">
        <div>
          <p className="font-chakra text-xl md:text-3xl font-bold uppercase text-white">
            Your Kill Rewards History
          </p>
          <p className="font-chakra text-sm md:text-base text-white/70">
            Track where your loot is going across chains.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-chakra text-xs md:text-sm uppercase text-white/70">Total Kills</span>
          <span className="font-chakra text-lg md:text-2xl font-bold text-[#FF8F00]">
            {killsData?.result.total_kills ?? 0}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 shadow-[0_0_24px_rgba(0,0,0,0.6)]">
        <table className="min-w-full text-left">
          <thead className="bg-white/5">
            <tr>
              <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-chakra font-semibold uppercase text-white/80">
                Match
              </th>
              <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-chakra font-semibold uppercase text-white/80">
                Kills
              </th>
              <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-chakra font-semibold uppercase text-white/80">
                Recipient
              </th>
              <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-chakra font-semibold uppercase text-white/80">
                Created At
              </th>
              <th className="px-3 md:px-4 py-3 text-xs md:text-sm font-chakra font-semibold uppercase text-white/80">
                Chain Activity
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(item => (
              <tr
                key={item.id}
                className="border-t border-white/5 odd:bg-white/0 even:bg-white/[0.02] hover:bg-white/[0.06] transition-colors"
              >
                <td className="px-3 md:px-4 py-4 align-top">
                  <p className="font-chakra text-xs md:text-sm text-white break-all">
                    {item.match_id}
                  </p>
                </td>
                <td className="px-3 md:px-4 py-4 align-top">
                  <span className="inline-flex items-center justify-center rounded-full border border-[#FF8F00] px-3 py-1 font-chakra text-xs md:text-sm text-[#FF8F00]">
                    {item.count}
                  </span>
                </td>
                <td className="px-3 md:px-4 py-4 align-top">
                  <p className="font-chakra text-xs md:text-sm text-white">
                    {item.to_user_username || '-'}
                  </p>
                </td>
                <td className="px-3 md:px-4 py-4 align-top">
                  <p className="font-chakra text-xs md:text-sm text-white/80">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </td>
                <td className="px-3 md:px-4 py-4 align-top">
                  <div className="flex flex-wrap gap-2">
                    {item.logs.map((log, index) => {
                      const isComplete = log.status.toLowerCase() === 'complete';
                      const meta = getChainMeta(log.chain_id);
                      return (
                        <div
                          key={`${log.chain_id}-${index}`}
                          className="flex flex-col gap-1 rounded-lg border border-white/10 bg-black/80 px-3 py-2 min-w-[180px]"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-2 py-0.5 text-[10px] md:text-xs font-chakra uppercase ${meta.badgeBg}`}
                            >
                              <span className="relative inline-block w-4 h-4 rounded-full overflow-hidden bg-black/40">
                                <Image src={meta.iconSrc} alt={meta.name} fill sizes="16px" />
                              </span>
                              <span>{meta.name}</span>
                            </span>
                            <span
                              className={`font-chakra text-[10px] md:text-xs uppercase px-2 py-0.5 rounded-full ${
                                isComplete ? 'bg-[#1CBB7A]/20 text-[#1CBB7A]' : 'bg-[#FF8F00]/20 text-[#FF8F00]'
                              }`}
                            >
                              {log.status}
                            </span>
                          </div>
                          {log.tx_hash && (
                            <a
                              href={log.explorer_link || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-chakra text-[10px] md:text-xs text-[#4FC3F7] underline break-all"
                            >
                              {log.tx_hash}
                            </a>
                          )}
                          <p className="font-chakra text-[10px] md:text-xs text-white/50">
                            {new Date(log.created_at).toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-white/80 font-chakra text-xs md:text-sm">
        <p>
          Showing{' '}
          <span className="text-[#FF8F00]">
            {Math.min(startIndex + 1, totalItems ?? 0)}-{Math.min(startIndex + pageSize, totalItems ?? 0)}
          </span>{' '}
          of <span className="text-[#FF8F00]">{totalItems}</span> entries
          {killsData ? null : <span className="ml-2 text-white/50">(mock data)</span>}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            className={`px-3 py-1 rounded-full border ${
              currentPage === 1
                ? 'border-white/10 text-white/30 cursor-not-allowed'
                : 'border-white/40 text-white hover:border-[#FF8F00] hover:text-[#FF8F00]'
            } transition-colors`}
          >
            Prev
          </button>
          <span className="px-2">
            Page <span className="text-[#FF8F00]">{currentPage}</span> / {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage(prev => Math.min(totalPages ?? 0, prev + 1))}
            className={`px-3 py-1 rounded-full border ${
              currentPage === totalPages
                ? 'border-white/10 text-white/30 cursor-not-allowed'
                : 'border-white/40 text-white hover:border-[#FF8F00] hover:text-[#FF8F00]'
            } transition-colors`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

function getChainMeta(chainId: number): {
  name: string;
  shortName: string;
  badgeBg: string;
  dotBg: string;
  iconSrc: string;
} {
  if (chainId === 43114) {
    return {
      name: "Avalanche C-Chain",
      shortName: "AVAX",
      badgeBg: "bg-[#E84142]/15 text-[#E84142] border border-[#E84142]/60",
      dotBg: "bg-[#E84142]",
      iconSrc: "/avax-logo.svg",
    };
  }

  if (chainId === 1482601649) {
    return {
      name: "Skale Mainnet",
      shortName: "SKALE",
      badgeBg: "bg-[#1CBB7A]/15 text-[#1CBB7A] border border-[#1CBB7A]/60",
      dotBg: "bg-[#1CBB7A]",
      iconSrc: "/assets/icons/skale.svg",
    };
  }

  if (chainId === 3344) {
    return {
      name: "Pentagon Chain",
      shortName: "PENT",
      badgeBg: "bg-[#7C3AED]/15 text-[#A855F7] border border-[#7C3AED]/60",
      dotBg: "bg-[#A855F7]",
      iconSrc: "/assets/icons/pentagon.svg",
    };
  }

  return {
    name: `Chain ${chainId}`,
    shortName: String(chainId),
    badgeBg: "bg-white/10 text-white/80 border border-white/30",
    dotBg: "bg-white/70",
    iconSrc: "/images/chains/default-chain.png",
  };
}

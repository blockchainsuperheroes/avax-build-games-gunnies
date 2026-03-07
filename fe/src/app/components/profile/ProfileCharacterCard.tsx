'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
} from 'wagmi';
import { useGlobalContext } from '@/app/providers/GlobalProvider';
import { gcnShardsAbi } from '@/abi/gcnShards';
import { gcnCraftingRouteAbi } from '@/abi/gcnCraftingRoute';
import { gcnCharactersAbi } from '@/abi/gcnCharacters';
import { ADDRESSES } from '@/app/constants/address';
import { readContract } from '@wagmi/core';
import { config } from '@/app/providers/Web3Provider';
import { AvalancheMainnet } from '@/app/constants/chains';
import { toast } from 'react-toastify';
import { GCN_CARDS_DATA, GCN_TYPES } from '@/app/constants/gcn';
import MintCardModal from './MintCardModal';
import BurnCardModal from './BurnCardModal';

type CardData = {
  name: string;
  image: string;
  description: string;
  hashrate: number;
  traits: Array<{ trait_type: string; value: string }>;
};

interface ProfileCharacterCardProps {
  cardId: number;
  card: CardData;
  rarity: keyof typeof GCN_TYPES;
  balance: number;
}

export const ProfileCharacterCard = ({
  cardId,
  card,
  rarity,
  balance: initialBalance,
}: ProfileCharacterCardProps) => {
  const { isConnected, address } = useAccount();
  const { showWalletDetectionModal } = useGlobalContext();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBurnModalOpen, setIsBurnModalOpen] = useState(false);
  const [holoGoldBalance, setHoloGoldBalance] = useState<number>(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [ownedTokenIds, setOwnedTokenIds] = useState<number[]>([]);

  const isShard = rarity === 'SHARD';
  const isHolo = rarity === 'HOLO';
  const isGold = rarity === 'GOLD';

  // Fetch shard balance for SHARD rarity
  const { data: shardBalance, refetch: refetchShardBalance } = useReadContract({
    address: ADDRESSES.GCNSHARDS.AVAX as `0x${string}`,
    abi: gcnShardsAbi,
    functionName: 'balanceOf',
    args: address && isShard ? [address as `0x${string}`, BigInt(cardId)] : undefined,
    chainId: AvalancheMainnet.id,
    query: {
      enabled: !!address && isConnected && isShard,
    },
  });

  // Fetch total balance for HOLO and GOLD cards
  const { data: totalBalance } = useReadContract({
    address: ADDRESSES.GCN_CHARACTERS.AVAX as `0x${string}`,
    abi: gcnCharactersAbi,
    functionName: 'balanceOf',
    args: address && (isHolo || isGold) ? [address as `0x${string}`] : undefined,
    chainId: AvalancheMainnet.id,
    query: {
      enabled: !!address && isConnected && (isHolo || isGold),
    },
  });

  // Fetch HOLO/GOLD balance by looping through tokens
  useEffect(() => {
    const fetchHoloGoldBalance = async () => {
      if (!isConnected || !address || (!isHolo && !isGold) || !totalBalance) {
        setHoloGoldBalance(0);
        return;
      }

      setIsLoadingBalance(true);
      const targetTier = isHolo ? 2 : 3; // tier 2 = HOLO, tier 3 = GOLD
      let count = 0;
      const totalBalanceNum = Number(totalBalance);
      let tokenId = 1;
      const maxIterations = totalBalanceNum * 10; // Safety limit to prevent infinite loops
      let iterations = 0;
      let foundTokens = 0; // Track how many tokens we've found that belong to the user
      const matchingTokenIds: number[] = []; // Store actual tokenIds that match

      try {
        while (foundTokens < totalBalanceNum && iterations < maxIterations) {
          iterations++;

          try {
            // Check ownerOf
            const ownerResult = await readContract(config as any, {
              address: ADDRESSES.GCN_CHARACTERS.AVAX as `0x${string}`,
              abi: gcnCharactersAbi,
              functionName: 'ownerOf',
              args: [BigInt(tokenId)],
              chainId: AvalancheMainnet.id,
            });
            const owner = ownerResult as `0x${string}` | string;

            // If owner matches, check tokenData
            if (owner && String(owner).toLowerCase() === address.toLowerCase()) {
              foundTokens++; // Increment found tokens count

              const tokenDataResult = await readContract(config as any, {
                address: ADDRESSES.GCN_CHARACTERS.AVAX as `0x${string}`,
                abi: gcnCharactersAbi,
                functionName: 'tokenData',
                args: [BigInt(tokenId)],
                chainId: AvalancheMainnet.id,
              });
              const tokenData = tokenDataResult as readonly [bigint, number] | [bigint, number];

              // tokenData returns [designId, tier]
              const designId = Number(tokenData[0]);
              const tier = Number(tokenData[1]);

              // Check if designId matches cardId and tier matches target tier
              if (designId === cardId && tier === targetTier) {
                count++;
                matchingTokenIds.push(tokenId); // Store the actual tokenId
              }

              // If we've found all tokens that belong to the user, we can break
              if (foundTokens >= totalBalanceNum) {
                break;
              }
            }
          } catch (error: any) {
            // If ownerOf fails (token doesn't exist), continue to next tokenId
            if (!error.message?.includes('ERC721: invalid token ID')) {
              console.error(`Error checking tokenId ${tokenId}:`, error);
            }
          }

          tokenId++;
        }

        setHoloGoldBalance(count);
        setOwnedTokenIds(matchingTokenIds); // Store the actual tokenIds
      } catch (error) {
        console.error('Error fetching HOLO/GOLD balance:', error);
        setHoloGoldBalance(0);
        setOwnedTokenIds([]);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    fetchHoloGoldBalance();
  }, [address, isConnected, isHolo, isGold, totalBalance, cardId]);

  const balance = isShard
    ? shardBalance
      ? Number(shardBalance)
      : 0
    : isHolo || isGold
      ? holoGoldBalance
      : initialBalance;

  const { writeContractAsync, isPending: isPendingWrite } = useWriteContract({
    mutation: {
      onError: (error: any) => {
        if (error.message?.includes('User denied transaction')) {
          toast.warn('Transaction cancelled');
        } else {
          toast.error(error.message || 'Transaction failed');
        }
        setTxHash(null);
      },
    },
  });

  const {
    data: receipt,
    isSuccess: isTxSuccess,
    isError: isTxError,
    isLoading: isLoadingReceipt,
  } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
    chainId: AvalancheMainnet.id,
    query: {
      enabled: !!txHash,
    },
  });

  const isEnoughShard = balance >= 100;
  const isMinting = isPendingWrite || isLoadingReceipt || !!txHash;

  const handleMintClick = () => {
    if (!isConnected) {
      showWalletDetectionModal(() => {
        // After successful connection, user can try the action again
        console.log('Wallet connected, ready to mint/burn');
      });
      return;
    }


    // For SHARD cards, open modal if user has enough balance
    if (isShard) {
      if (!isEnoughShard) {
        toast.warn(`You need ${100} shards to mint`);
        return;
      }
      setIsModalOpen(true);
      return;
    }

    // For HOLO and GOLD cards, open burn modal
    if (isHolo || isGold) {
      setIsBurnModalOpen(true);
    }
  };

  const handleMint = async (targetRarity: keyof typeof GCN_TYPES) => {
    if (!isConnected) {
      return;
    }


    const targetIsHolo = targetRarity === 'HOLO';
    const requiredShards = targetIsHolo ? 100 : 1000;
    const hasEnoughShards = balance >= requiredShards;

    if (!hasEnoughShards) {
      toast.warn(`You need ${requiredShards} shards to mint`);
      return;
    }

    try {
      if (chainId !== AvalancheMainnet.id) {
        try {
          await switchChainAsync({ chainId: AvalancheMainnet.id });
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (switchError: any) {
          toast.error('Failed to switch chain. Please switch manually to Avalanche.');
          return;
        }
      }

      toast.info('⏳ Waiting for confirmation...');
      const hash = await writeContractAsync({
        address: ADDRESSES.GCNCRAFTINGROUTE.AVAX as `0x${string}`,
        abi: gcnCraftingRouteAbi,
        functionName: targetIsHolo ? 'craftChromium' : 'craftGold',
        args: [cardId as number],
        chainId: AvalancheMainnet.id,
      });

      setTxHash(hash);
      setIsModalOpen(false);
    } catch (error: any) {
      if (!error.message?.includes('User denied')) {
        toast.error(error.message || 'Failed to mint');
      }
    }
  };

  const handleBurn = async (selectedTokenId?: number) => {
    if (!isConnected || !address) {
      return;
    }

    // Use the first available tokenId if none specified
    const tokenIdToBurn = selectedTokenId || ownedTokenIds[0];
    if (!tokenIdToBurn) {
      toast.error('No token available to burn');
      return;
    }

    try {
      if (chainId !== AvalancheMainnet.id) {
        try {
          await switchChainAsync({ chainId: AvalancheMainnet.id });
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (switchError: any) {
          toast.error('Failed to switch chain. Please switch manually to Avalanche.');
          return;
        }
      }

      toast.info('⏳ Waiting for confirmation...');
      const hash = await writeContractAsync({
        address: ADDRESSES.GCN_CHARACTERS.AVAX as `0x${string}`,
        abi: gcnCharactersAbi,
        functionName: 'burn',
        args: [BigInt(tokenIdToBurn)],
        chainId: AvalancheMainnet.id,
      });

      setTxHash(hash);
    } catch (error: any) {
      if (!error.message?.includes('User denied')) {
        toast.error(error.message || 'Failed to burn card');
      }
    }
  };

  useEffect(() => {
    if (isTxSuccess) {
      setIsModalOpen(false);
      setIsBurnModalOpen(false);
      setTxHash(null);
      if (isHolo || isGold) {
        toast.success('🎉 Card burned successfully!');
      } else if (isShard) {
        toast.success('🎉 Mint successful!');
        // Refetch shard balance after successful mint with a small delay to ensure blockchain state is updated
        setTimeout(() => {
          refetchShardBalance();
        }, 2000);
      }
    } else if (isTxError) {
      toast.error('❌ Transaction failed');
      setTxHash(null);
    }
  }, [isTxSuccess, isTxError, isHolo, isGold, isShard, refetchShardBalance]);

  const displayName = card.name.split(' (')[0].toUpperCase();

  return (
    <div className={`flex flex-col items-center border border-[#7C7C7C] rounded-lg p-3`}>
      <Image src={card.image} alt={card.name} width={113} height={158} className="rounded" />
      <div className="mt-1 text-center">
        <p className="text-white text-sm uppercase font-chakra">{displayName}</p>
        <p className="text-white text-[10px] font-chakra">({rarity})</p>
      </div>
      <div className="mt-1">
        {isLoadingBalance && (isHolo || isGold) ? (
          <span className="text-[#FFA200] text-sm font-chakra">Loading...</span>
        ) : (
          <span className="text-[#FFA200] text-xl font-bold font-chakra">{balance}</span>
        )}
      </div>
      <button
        className="w-full mt-2 p-2 rounded-lg bg-transparent hover:bg-gray-700 transition-colors border border-white disabled:bg-transparent disabled:cursor-not-allowed disabled:opacity-50"
        disabled={
          (isShard && isConnected && !isEnoughShard) ||
          ((isHolo || isGold) && (!isConnected || balance === 0)) ||
          isMinting
        }
        onClick={handleMintClick}
      >
        <span className="text-white font-bold uppercase text-xs">
          {!isConnected
            ? 'CONNECT WALLET'
            : isMinting
              ? isShard
                ? 'MINTING...'
                : 'BURNING...'
              : isShard
                ? 'MINT'
                : 'BURN'}
        </span>
      </button>

      {/* Mint Modal for SHARD cards */}
      {isShard && (
        <MintCardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cardId={cardId}
          currentRarity={rarity}
          currentBalance={balance}
          onMint={handleMint}
          isMinting={isMinting}
        />
      )}

      {/* Burn Modal for HOLO and GOLD cards */}
      {(isHolo || isGold) && (
        <BurnCardModal
          isOpen={isBurnModalOpen}
          onClose={() => setIsBurnModalOpen(false)}
          card={card}
          rarity={rarity as 'HOLO' | 'GOLD'}
          onBurn={handleBurn}
          isBurning={isMinting}
          ownedTokenIds={ownedTokenIds}
        />
      )}
    </div>
  );
};

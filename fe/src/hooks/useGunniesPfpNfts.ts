import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import type { AvalancheNftsResponse, PFPDisplayItem, PFPDisplayStatus } from '@/types/pfp';

const AVAX_METADATA_API = 'https://api.metadata.avalanche.games';

function getTransferable(item: AvalancheNftsResponse['result']['items'][0]): boolean {
  if (item.transferable !== undefined) return item.transferable;
  const trait = item.metadata?.find((m) => m.trait_type === 'Transferable');
  if (!trait) return false;
  return String(trait.value).toLowerCase() === 'true';
}

/**
 * Derives display status from API item:
 * - type === "Chain Bunnies" → mint
 * - type === "Gunnies PFP" && transferable === false → sbt
 * - type === "Gunnies PFP" && transferable === true → nft
 */
function getStatusFromItem(item: AvalancheNftsResponse['result']['items'][0]): PFPDisplayStatus {
  const typeName = (item.type ?? '').trim();
  if (typeName === 'Chain Bunnies') return 'mint';
  if (typeName === 'Gunnies PFP') {
    return getTransferable(item) ? 'nft' : 'sbt';
  }
  return 'mint';
}

function toDisplayItem(
  item: AvalancheNftsResponse['result']['items'][0],
  status: PFPDisplayStatus
): PFPDisplayItem {
  const id = Number(item.token_id) || 0;
  const name = item.name?.replace(/\s*#\d+$/, '') || 'Character';
  const image = item.image || '/images/collectibles/mock-image.png';

  const display: PFPDisplayItem = {
    id,
    name,
    image,
    status,
  };

  if (status === 'mint') {
    display.isFreeMint = false;
  }
  if (status === 'sbt') {
    display.price = '0.1 PC';
  }

  return display;
}

/**
 * Fetches all Gunnies PFP NFTs for the connected wallet from a single API.
 * Status is derived per item: Chain Bunnies → mint, Gunnies PFP + transferable false → sbt, Gunnies PFP + transferable true → nft.
 */
export function useGunniesPfpNfts() {
  const { address } = useAccount();

  const query = useQuery({
    queryKey: ['gunnies-pfp-nfts', address ?? ''],
    queryFn: async (): Promise<PFPDisplayItem[]> => {
      const walletAddress = address ?? '';
      if (!walletAddress) return [];

      const url = `${AVAX_METADATA_API}/gunnies_pfp/nfts?address=${encodeURIComponent(walletAddress)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch NFTs: ${res.statusText}`);
      const data: AvalancheNftsResponse = await res.json();

      if (!data?.success || !data.result?.items) return [];

      const items = data.result.items;
      const byTokenId = new Map<string, PFPDisplayItem>();

      for (const item of items) {
        const tid = item.token_id;
        if (!tid) continue;
        const status = getStatusFromItem(item);
        const candidate = toDisplayItem(item, status);
        const existing = byTokenId.get(tid);
        if (!existing) {
          byTokenId.set(tid, candidate);
          continue;
        }
        const statusOrder: PFPDisplayStatus[] = ['mint', 'sbt', 'nft'];
        if (statusOrder.indexOf(status) > statusOrder.indexOf(existing.status)) {
          byTokenId.set(tid, { ...candidate, image: candidate.image || existing.image });
        } else if (existing.image === '/images/collectibles/mock-image.png' && candidate.image) {
          byTokenId.set(tid, { ...existing, image: candidate.image });
        }
      }

      return Array.from(byTokenId.values());
    },
    enabled: !!address,
    refetchInterval: 30 * 1000,
  });

  return {
    items: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error ? String(query.error) : null,
    refetch: query.refetch,
    isConnected: !!address,
  };
}

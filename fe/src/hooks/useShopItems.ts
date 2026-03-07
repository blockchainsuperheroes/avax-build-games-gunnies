import { ShopItem } from '@/app/types/shop';
import { useQuery } from '@tanstack/react-query';

interface UseShopItemsReturn {
  items: ShopItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Name mapping function to convert Stripe product names to match old shop items
const mapProductName = (stripeName: string, description: string): string => {
  // Extract quantity from description first (more reliable)
  const descriptionMatch = description.match(/Purchase (\d+) In-Game (Coins?|Carrots?)/i);

  if (descriptionMatch) {
    const quantity = descriptionMatch[1];
    const type = descriptionMatch[2].toLowerCase();

    if (type.includes('coin')) {
      return `${quantity} Coins`;
    } else if (type.includes('carrot')) {
      return `${quantity} Karrots`;
    }
  }

  // Fallback to name-based mapping if description doesn't match
  const lowerName = stripeName.toLowerCase();

  // Define mapping patterns
  const mappings = [
    // Coins patterns
    { pattern: /(\d+)\s*coins?/i, format: (num: string) => `${num} Coins` },
    { pattern: /coins?\s*(\d+)/i, format: (num: string) => `${num} Coins` },
    { pattern: /(\d+)\s*coin\s*pack/i, format: (num: string) => `${num} Coins` },

    // Karrots patterns (handle both spellings)
    { pattern: /(\d+)\s*karrots?/i, format: (num: string) => `${num} Karrots` },
    { pattern: /(\d+)\s*carrots?/i, format: (num: string) => `${num} Karrots` },
    { pattern: /karrots?\s*(\d+)/i, format: (num: string) => `${num} Karrots` },
    { pattern: /carrots?\s*(\d+)/i, format: (num: string) => `${num} Karrots` },
    { pattern: /(\d+)\s*karrot\s*pack/i, format: (num: string) => `${num} Karrots` },
    { pattern: /(\d+)\s*carrot\s*pack/i, format: (num: string) => `${num} Karrots` },
  ];

  // Try to match against each pattern
  for (const { pattern, format } of mappings) {
    const match = stripeName.match(pattern);
    if (match) {
      const number = match[1];
      return format(number);
    }
  }

  // If no specific pattern matches, return the original name
  return stripeName;
};

const fetchShopItems = async (): Promise<ShopItem[]> => {
  const response = await fetch('/api/stripe/products');
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch shop items');
  }

  // Map the items with transformed names
  const mappedItems = (data.items || []).map((item: ShopItem) => ({
    ...item,
    name: mapProductName(item.name, item.description),
  }));

  return mappedItems;
};

export const useShopItems = (): UseShopItemsReturn => {
  const {
    data: items = [],
    error,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: ['shopItems'],
    queryFn: fetchShopItems,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 3,
    refetchOnWindowFocus: false,
  });

  return {
    items,
    loading,
    error: error?.message || null,
    refetch,
  };
};

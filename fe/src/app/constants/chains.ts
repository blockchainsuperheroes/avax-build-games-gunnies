import { defineChain } from 'viem';

export const AvalancheMainnet = defineChain({
  id: 43114,
  name: 'Avalanche C-Chain',
  network: 'avalanche',
  nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://api.avax.network/ext/bc/C/rpc'],
    },
    public: {
      http: ['https://api.avax.network/ext/bc/C/rpc'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SnowTrace',
      url: 'https://snowtrace.io/',
    },
  },
});

export const AvalancheFuji = defineChain({
  id: 43113,
  name: 'Avalanche Fuji Testnet',
  network: 'avalanche-fuji',
  nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
    public: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: {
      name: 'SnowTrace Testnet',
      url: 'https://testnet.snowtrace.io/',
    },
  },
});

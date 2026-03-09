import { defineChain } from 'viem';

export const SkaleMainnet = defineChain({
  id: 1482601649,
  name: 'Skale Mainnet',
  network: 'green-giddy-denebola',
  nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://mainnet-proxy.skalenodes.com/v1/green-giddy-denebola'],
    },
    public: {
      http: ['https://mainnet-proxy.skalenodes.com/v1/green-giddy-denebola'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Skale Explorer',
      url: 'https://green-giddy-denebola.explorer.mainnet.skalenodes.com/',
    },
  },
});

export const PentagonTestnet = defineChain({
  id: 555555,
  name: 'Pentagon Testnet',
  network: 'pentagon',
  nativeCurrency: { name: 'PEN', symbol: 'PEN', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-testnet.pentagon.games'] },
    public: { http: ['https://rpc-testnet.pentagon.games'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'Pentagon Testnet Explorer',
      url: 'https://explorer-testnet.pentagon.games/',
    },
    default: { name: 'Pentagon Testnet Explorer', url: 'https://explorer-testnet.pentagon.games/' },
  },
});

export const PentagonChain = defineChain({
  id: 3344,
  name: 'Pentagon Chain',
  network: 'pentagon-chain',
  nativeCurrency: { name: 'PC', symbol: 'PC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.pentagon.games'] },
    public: { http: ['https://rpc.pentagon.games'] },
  },
  blockExplorers: {
    etherscan: {
      name: 'Pentagon Chain Explorer',
      url: 'https://explorer.pentagon.games/',
    },
    default: { name: 'Pentagon Chain Explorer', url: 'https://explorer.pentagon.games/' },
  },
});

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

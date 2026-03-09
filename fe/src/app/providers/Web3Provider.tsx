'use client';

import { http } from 'viem';
import { WagmiProvider } from 'wagmi';
import { skaleNebula, coreDao, mainnet } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { PentagonChain, AvalancheMainnet } from '@/app/constants/chains';

export const config = getDefaultConfig({
  appName: 'Gunnies',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains: [skaleNebula, coreDao, mainnet, PentagonChain, AvalancheMainnet],
  transports: {
    [skaleNebula.id]: http(),
    [coreDao.id]: http(),
    [mainnet.id]: http(),
    [PentagonChain.id]: http(),
    [AvalancheMainnet.id]: http(),
  },
  ssr: true,
});

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
};

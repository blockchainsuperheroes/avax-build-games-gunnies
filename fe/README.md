# Gunnies Frontend — Avalanche Quests

Next.js web application for the Gunnies loot box quest system on Avalanche.

## Features
- Daily loot box chest claims on Avalanche C-Chain
- Reward tracking (Stars, Coins, Karrots)
- Wallet connection (MetaMask, WalletConnect)
- AVAX network configuration and token guides
- Leaderboard display
- Kaboom Pass premium subscription

## Stack
- Next.js 14+ (App Router)
- TailwindCSS
- ethers.js / wagmi for wallet interaction
- Avalanche C-Chain (Chain ID: 43114)

## Setup
```bash
npm install
npm run dev
```

## Key Files
- `src/app/(main)/quests/page.tsx` — Main quests page
- `src/app/components/quests/` — Quest UI components
- `src/app/constants/questsConfig.ts` — Chain and chest configuration
- `src/app/constants/routes.ts` — App routing

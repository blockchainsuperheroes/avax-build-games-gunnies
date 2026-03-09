# Gunnies Frontend — Built on Avalanche

Next.js web application for Gunnies FPS. Handles wallet connection, NFT minting, lootbox opening, leaderboard display, and shop.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Wallet**: RainbowKit + wagmi + viem
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Chain**: Avalanche C-Chain (43114) / Fuji Testnet (43113)

## Setup

```bash
# Install dependencies
npm install
# or
pnpm install

# Create .env.local
cp .env.example .env.local
# Fill in:
#   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<your WalletConnect project ID>
#   NEXT_PUBLIC_API_URL=<backend API URL>
#   AVAX_RPC_URL=https://api.avax.network/ext/bc/C/rpc

# Run dev server
npm run dev
```

## Key Directories

```
fe/
├── src/
│   ├── app/
│   │   ├── constants/       → Chain config, addresses (AVAX), routes
│   │   ├── providers/       → Web3Provider (Avalanche chains)
│   │   ├── components/      → UI components (quests, shop, profile, etc.)
│   │   ├── stores/          → Zustand stores (cart, user)
│   │   ├── (main)/quests/   → Lootbox / quest page
│   │   ├── collectibles/    → GCN card collection
│   │   ├── leaderboard/     → Player rankings
│   │   └── shop/            → In-game store
│   ├── abi/                 → Smart contract ABIs
│   ├── hooks/               → Custom React hooks for contract interaction
│   └── pages/api/           → API routes (gas recharge)
├── public/                  → Static assets, AVAX logo
└── package.json
```

## Wallet Connection

Uses RainbowKit with Avalanche C-Chain and Fuji Testnet configured. See `src/app/providers/Web3Provider.tsx`.

## Contract Interaction

All contract addresses are defined in `src/app/constants/address.ts`:

| Contract | Address | Used For |
|---|---|---|
| KhaosReward | `0x9FF2D54510AB66Dd82634eAA1Afa1e57C3E1882C` | `useClaimAvax` — lootbox opening |
| GunniesKiller | `0x45eFd10b36CC2fAC20852e47371BeBb36FB47C1c` | `useKillBalance` — kill count display |
| Kaboom_Pass | `0x8c5D7BC84d0ab7cc7e32A9848804824d079f2C0f` | Ownership check for premium chests |
| Kaboom_Distributor | `0x051654bF2Ba4eB8bf866e1196B4a23970d97Db15` | `useMintAvax` — pass purchase with AVAX |

All contracts are verified on [Snowtrace](https://snowtrace.io).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID |
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `AVAX_RPC_URL` | Avalanche RPC endpoint |
| `PRIVATE_KEY` | Server-side wallet key for gas recharge (DO NOT commit) |

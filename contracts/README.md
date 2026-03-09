# Gunnies Smart Contracts — Avalanche C-Chain

Solidity smart contracts for the Gunnies FPS ecosystem, deployed on **Avalanche C-Chain (43114)**.

## Deployed Contracts (Mainnet)

All contracts are **verified on Snowtrace** — click to view source, read/write, and transaction history.

| Contract | Address | Snowtrace | Purpose |
|---|---|---|---|
| **KhaosReward** | `0x9FF2D54510AB66Dd82634eAA1Afa1e57C3E1882C` | [View](https://snowtrace.io/address/0x9FF2D54510AB66Dd82634eAA1Afa1e57C3E1882C#code) | Lootbox reward claiming — users call `claimReward()` to open daily chests. Emits `RewardEarned` events. Also supports bulk airdrops via `bulkTransfer()`. |
| **GunniesKiller** | `0x45eFd10b36CC2fAC20852e47371BeBb36FB47C1c` | [View](https://snowtrace.io/address/0x45eFd10b36CC2fAC20852e47371BeBb36FB47C1c#code) | On-chain kill tracking — stores per-player kill counts synced from the FPS game server. Creates a verifiable, tamper-proof record of player performance. |
| **Kaboom_Pass** | `0x8c5D7BC84d0ab7cc7e32A9848804824d079f2C0f` | [View](https://snowtrace.io/address/0x8c5D7BC84d0ab7cc7e32A9848804824d079f2C0f#code) | Premium NFT pass — holders get 2x daily loot box openings and access to enhanced reward tiers. |
| **Kaboom_Distributor** | `0x051654bF2Ba4eB8bf866e1196B4a23970d97Db15` | [View](https://snowtrace.io/address/0x051654bF2Ba4eB8bf866e1196B4a23970d97Db15#code) | Kaboom Pass minting — users pay AVAX to `mint()` and receive a Kaboom Pass NFT. Supports both native AVAX and ERC-20 payment. |

## All Contracts

| Contract | Description | Deployment |
|---|---|---|
| **KhaosRewards.sol** | Lootbox reward claiming + airdrop distribution | ✅ Deployed |
| **GunniesKiller.sol** | Per-player kill count tracking (synced from game server) | ✅ Deployed |
| **Kaboom_Pass.sol** | Premium pass NFT (ERC-721) — unlocks 2x chests | ✅ Deployed |
| **Kaboom_Distributor.sol** | Kaboom Pass minting (native AVAX + ERC-20 payment) | ✅ Deployed |
| **GCN721Main.sol** | Gunnies Collectible NFTs (ERC-721) — 7 characters × 3 rarity tiers | Planned |
| **GCNShards.sol** | Card shards for crafting (ERC-1155) — combine to mint full cards | Planned |
| **GCNCraftingRouter.sol** | Crafting system — burn shards + base cards → higher-rarity cards | Planned |
| **GunniesSBT.sol** | Soulbound achievement tokens — non-transferable proof of accomplishments | Planned |
| **Karrot.sol** | ERC-20 premium currency earned from lootboxes and gameplay | Planned |
| **Coin.sol** | ERC-20 in-game currency bridge token | Planned |
| **Pumpkin.sol** | ERC-20 seasonal event token | Planned |

## How They Work Together

```
Player opens lootbox on gunnies.io/avax
        │
        ▼
┌─────────────────────────┐
│   KhaosReward Contract  │  ← claimReward(timestamp) — just gas, no payment
│   0x9FF2...882C         │     Emits RewardEarned event
└────────────┬────────────┘
             │
             │  Backend reads event, distributes rewards:
             ▼
   ┌─────────────────┐
   │ Stars (off-chain) │  → Leaderboard ranking
   │ Coins (ERC-20)    │  → In-game purchases
   │ Karrots (ERC-20)  │  → Premium purchases
   └─────────────────┘

Premium users (Kaboom Pass holders) get 2x daily chests:

Player buys Kaboom Pass
        │
        ▼
┌─────────────────────────┐
│  Kaboom_Distributor     │  ← mint() — pays AVAX
│  0x051654...D15         │     Mints Kaboom_Pass NFT to user
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  Kaboom_Pass NFT        │  ← Ownership check by frontend
│  0x8c5D7B...C0f         │     If owned → 2x daily chests unlocked
└─────────────────────────┘

Kill tracking (synced from FPS game server):

Game server reports kills
        │
        ▼
┌─────────────────────────┐
│  Backend Cron Job       │  ← Batches kills per player per match
│  (gunnies-pg-crons)     │     Submits to chain periodically
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  GunniesKiller Contract │  ← On-chain kill count storage
│  0x45eFd1...F1c         │     Verifiable player performance history
└─────────────────────────┘
```

## Chain Configuration

| Parameter | Value |
|---|---|
| **Network** | Avalanche C-Chain |
| **Chain ID** | 43114 |
| **RPC** | `https://api.avax.network/ext/bc/C/rpc` |
| **Explorer** | [snowtrace.io](https://snowtrace.io) |
| **Native Token** | AVAX |

> Fuji Testnet (43113) used for internal QA before mainnet deploys.

## Compile & Deploy

### Using Foundry

```bash
# Install
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compile
forge build

# Deploy to Avalanche C-Chain
forge create --rpc-url https://api.avax.network/ext/bc/C/rpc \
  --private-key $PRIVATE_KEY \
  src/KhaosRewards.sol:KhaosReward

# Verify on Snowtrace
forge verify-contract --chain-id 43114 \
  --compiler-version v0.8.19 \
  <DEPLOYED_ADDRESS> \
  src/KhaosRewards.sol:KhaosReward
```

### Using Hardhat

```bash
npx hardhat compile
npx hardhat deploy --network avalanche
npx hardhat verify --network avalanche <DEPLOYED_ADDRESS>
```

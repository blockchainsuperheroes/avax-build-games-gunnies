# Gunnies FPS — Built on Avalanche

> **Play. Earn. Own.** A blockchain-integrated FPS game built exclusively on Avalanche.

Gunnies is a fast-paced multiplayer FPS where every kill counts, loot boxes reward skill, and on-chain assets give players true ownership. Built for the [Avalanche Build Games](https://build.avax.network/build-games) program.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   PLAYERS                        │
│            (Browser / Game Client)               │
└──────────┬────────────────────┬─────────────────┘
           │                    │
           ▼                    ▼
┌──────────────────┐  ┌─────────────────────────┐
│    /fe           │  │    Game Client (Unity)   │
│  Next.js Website │  │  FPS Gameplay + Lootbox  │
│  Loot Box Quests │  │  Kill Count Tracking     │
│  AVAX Chain Only │  └──────────┬──────────────┘
└──────────┬───────┘             │
           │                     │
           ▼                     ▼
┌──────────────────────────────────────────────────┐
│                    /be                            │
│              Django Backend                       │
│    - User auth & session management               │
│    - Loot box reward distribution                 │
│    - Kill count aggregation & sync                │
│    - Leaderboard rankings                         │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│               /contracts                          │
│         Avalanche C-Chain (43114)                  │
│    - GCN721Main.sol (NFT Collection)              │
│    - GunniesKiller.sol (Kill Count On-Chain)      │
│    - Coin.sol / Karrot.sol (Game Tokens)          │
│    - GCNCraftingRouter.sol (Item Crafting)        │
│    - GunniesSBT.sol (Soulbound Achievements)     │
└──────────────────────────────────────────────────┘
```

## Project Structure

```
/fe              → Next.js frontend (loot box quests, rewards UI)
/be              → Django backend (game API, kill sync, loot distribution)
/contracts       → Solidity smart contracts (deployed on Avalanche C-Chain)
/game-scripts    → Blockchain sync scripts (kill count → on-chain)
```

## Avalanche Integration

**Target Chain:** Avalanche C-Chain

| Network | Chain ID | RPC | Explorer |
|---------|----------|-----|----------|
| **Mainnet** | 43114 | `https://api.avax.network/ext/bc/C/rpc` | [Snowtrace](https://snowtrace.io) |
| **Fuji Testnet** | 43113 | `https://api.avax-test.network/ext/bc/C/rpc` | [Fuji Explorer](https://testnet.snowtrace.io) |

**Currency:** AVAX (native gas token)

### Smart Contracts (To Be Deployed on AVAX)

All contracts are being redeployed on Avalanche C-Chain. Contract addresses will be updated here post-deployment.

| Contract | Description | Address |
|----------|-------------|---------|
| GCN721Main | NFT Collection (Gunnies Characters) | TBD |
| GunniesKiller | Kill Count On-Chain Sync | TBD |
| GunniesSBT | Soulbound Achievement Badges | TBD |
| Coin | In-Game Stars Token | TBD |
| Karrot | Premium Currency Token | TBD |
| GCNCraftingRouter | Item Crafting System | TBD |
| GCNShards | Crafting Shards | TBD |

## How It Works

### Loot Box System
1. Players earn loot boxes by playing the game (kills, objectives, daily check-ins)
2. Each loot box contains randomized rewards: Stars, Coins, or Karrots
3. Rewards are tracked on-chain via Avalanche smart contracts
4. Daily chest claims reset at 00:00 UTC

### Kill Count → Blockchain Sync
The game backend tracks player kills in real-time. Periodically, kill counts are batched and synced to the `GunniesKiller` smart contract on Avalanche, creating a verifiable on-chain record of player performance. This powers:
- Trustless leaderboards
- Kill-based reward distribution
- Anti-cheat verification

### Soulbound Achievements
`GunniesSBT.sol` issues non-transferable tokens for milestones (first 100 kills, tournament wins, etc.), permanently recorded on Avalanche.

## AVAX-Exclusive Roadmap

### Phase 1: Foundation (Current)
- Deploy all game contracts on Avalanche C-Chain
- AVAX-native loot box quest page
- Kill count on-chain sync via Avalanche
- Leaderboard powered by on-chain data

### Phase 2: AVAX-Exclusive Content
- **Exclusive Hero Character** — A unique playable character available ONLY on Avalanche, with custom abilities and visual design tied to the AVAX ecosystem
- **PFP Special Trait Collection** — Limited-edition profile picture NFTs with Avalanche-exclusive traits, mintable only on AVAX C-Chain. Holders get in-game cosmetic bonuses
- AVAX-native marketplace for trading game items

### Phase 3: Avalanche L1 Migration
- Migrate game backend to a dedicated Avalanche L1 (subnet)
- Sub-second finality for in-game transactions
- Custom gas token for zero-friction gameplay
- Full on-chain game state

### Phase 4: Ecosystem Growth
- Cross-game interoperability with other AVAX games
- Tournament system with AVAX prize pools
- DAO governance for game updates
- SDK for third-party mod integration

## Getting Started

### Frontend (`/fe`)
```bash
cd fe
npm install
npm run dev
# Opens at http://localhost:3000
```

### Backend (`/be`)
```bash
cd be
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Contracts (`/contracts`)
Contracts are Solidity files targeting Avalanche C-Chain. Deploy using Hardhat or Foundry:
```bash
# Example with cast (foundry)
forge create --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --private-key $DEPLOYER_KEY \
  contracts/GunniesKiller.sol:GunniesKiller
```

### Game Scripts (`/game-scripts`)
```bash
cd game-scripts
pip install web3
python blockchain_tasks.py
```

## Tech Stack

- **Frontend:** Next.js, TailwindCSS, ethers.js
- **Backend:** Python/Django, REST API
- **Smart Contracts:** Solidity (EVM-compatible)
- **Blockchain:** Avalanche C-Chain (EVM)
- **Game Engine:** Unity (binary distribution)

## Team

Built by the [Pentagon Games](https://pentagon.games) team, makers of ChainGunnies, with deep experience in blockchain gaming across multiple chains.

## Links

- [Avalanche Build Games Program](https://build.avax.network/build-games)
- [Gunnies Website](https://gunnies.io)
- [Pentagon Games](https://pentagon.games)

## License

Proprietary. Game code is not open source. Smart contracts and integration code shared for evaluation purposes.

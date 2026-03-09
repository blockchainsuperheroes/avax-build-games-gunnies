# 🔫 Gunnies FPS — Built on Avalanche

<p align="center">
  <img src="fe/public/avax-logo.svg" width="80" alt="Avalanche" />
</p>

> **Gunnies** is a free-to-play, cartoon-style first-person shooter with on-chain lootboxes, kill-count tracking, and NFT collectibles — now live on **Avalanche**.

| | |
|---|---|
| **Website** | [gunnies.io](https://gunnies.io) |
| **AVAX Quests Page** | [gunnies.io/avax](https://gunnies.io/avax) |
| **Steam** | [Gunnies on Steam](https://store.steampowered.com/app/3323030/Gunnies/) |
| **Epic Games** | [Gunnies on Epic](https://store.epicgames.com/en-US/p/gunnies-491615) |
| **Chain** | Avalanche C-Chain (43114) |
| **AVAX Games Program** | [build.avax.network/build-games](https://build.avax.network/build-games) |

---

## ✅ Deployed Contracts (Avalanche C-Chain Mainnet)

All 4 contracts are **deployed and verified** on Snowtrace:

| Contract | Address | Snowtrace | What It Does |
|---|---|---|---|
| **KhaosReward** | `0x9FF2D54510AB66Dd82634eAA1Afa1e57C3E1882C` | [Verified ✅](https://snowtrace.io/address/0x9FF2D54510AB66Dd82634eAA1Afa1e57C3E1882C#code) | **Lootbox opening** — users call `claimReward()` with just gas to open daily chests. Emits `RewardEarned` events that the backend reads to distribute rewards (stars, coins, karrots). |
| **GunniesKiller** | `0x45eFd10b36CC2fAC20852e47371BeBb36FB47C1c` | [Verified ✅](https://snowtrace.io/address/0x45eFd10b36CC2fAC20852e47371BeBb36FB47C1c#code) | **Kill tracking** — stores per-player kill counts synced from the FPS game server via cron jobs. Verifiable, tamper-proof performance record on-chain. |
| **Kaboom_Pass** | `0x8c5D7BC84d0ab7cc7e32A9848804824d079f2C0f` | [Verified ✅](https://snowtrace.io/address/0x8c5D7BC84d0ab7cc7e32A9848804824d079f2C0f#code) | **Premium pass NFT** — holders get 2x daily loot box openings + access to enhanced reward tiers. |
| **Kaboom_Distributor** | `0x051654bF2Ba4eB8bf866e1196B4a23970d97Db15` | [Verified ✅](https://snowtrace.io/address/0x051654bF2Ba4eB8bf866e1196B4a23970d97Db15#code) | **Pass minting** — users pay AVAX to `mint()` and receive a Kaboom_Pass NFT. Supports native AVAX and ERC-20 payment. |

---

## 🎮 How It Works (End-to-End Flow)

### 1. Play the Game
Gunnies is a fast-paced FPS on **Steam** and **Epic Games Store**. Players battle in cartoon-style arenas.

### 2. Kills Sync to Avalanche
Every kill is tracked and periodically synced to the **GunniesKiller** contract:
- Game client reports kills to Django backend
- `gunnies-pg-crons` batches kills per player
- Cron job submits batched kill counts on-chain every 15 minutes
- Players can verify their kill history on Snowtrace

### 3. Open Daily Loot Boxes
Players visit [gunnies.io/avax](https://gunnies.io/avax), connect wallet, and open chests:
- Each chest open is an on-chain `claimReward()` transaction (just gas, no payment)
- 5 free chests per day for all users
- Backend reads the `RewardEarned` event and distributes rewards

### 4. Rewards
Each chest drops a mix of:
- **Stars** (5-40) — leaderboard ranking
- **Coins** (10-40) — in-game currency for cosmetics and weapons
- **Karrots** (10-100) — premium currency for legendary loot boxes

### 5. Premium: Kaboom Pass
Players can buy a **Kaboom Pass NFT** with AVAX:
- Minted via the Kaboom_Distributor contract
- Pass holders get **2x daily chests** (10 instead of 5)
- Access to enhanced reward tiers
- Valid for one year

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  FPS Game    │────▶│  Backend     │────▶│  GunniesKiller   │
│  (Steam/Epic)│     │  (Django)    │     │  (kill tracking) │
└──────────────┘     └──────┬───────┘     └──────────────────┘
                            │
                            ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Player      │────▶│  KhaosReward │────▶│  Backend reads   │
│  opens chest │     │  (on-chain)  │     │  event, gives    │
│  on website  │     │              │     │  Stars/Coins/    │
└──────────────┘     └──────────────┘     │  Karrots         │
                                          └──────────────────┘
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Player buys │────▶│  Kaboom_     │────▶│  Kaboom_Pass NFT │
│  pass (AVAX) │     │  Distributor │     │  → 2x chests/day │
└──────────────┘     └──────────────┘     └──────────────────┘
```

---

## 📂 Repository Structure

```
├── fe/                  → Next.js frontend (AVAX quests page, wallet, minting)
│   ├── src/app/avax/    → gunnies.io/avax — the AVAX-exclusive quests page
│   ├── src/hooks/       → useClaimAvax, useMintAvax, useKillBalance
│   ├── src/abi/         → Contract ABIs
│   └── README.md
│
├── be/                  → Django backend (auth, game data, rewards, on-chain sync)
│   ├── common/          → Core app (models, views, tasks, chain config)
│   ├── gunnies-crons/   → Kaboom Pass sync, LootLocker rewards, currency distribution
│   ├── gunnies-pg-crons/→ On-chain kill sync, currency TX, airdrops (runs every 10-15 min)
│   └── README.md
│
├── contracts/           → 11 Solidity contracts (4 deployed, 7 planned)
│   └── README.md        → Full deployment details + Snowtrace links
│
├── game-scripts/        → Blockchain utility scripts (kill sync helpers)
│
└── README.md            → You are here
```

---

## 📐 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      GAME CLIENT                            │
│              (Unreal Engine 5 — Steam / Epic)               │
│                                                             │
│   ┌──────────┐  ┌──────────┐  ┌────────────────────────┐   │
│   │ Gameplay │  │ Lootbox  │  │ Kill-count tracking    │   │
│   │  Loop    │  │  System  │  │ (per-match stats)      │   │
│   └────┬─────┘  └────┬─────┘  └───────────┬────────────┘   │
│        │              │                    │                │
└────────┼──────────────┼────────────────────┼────────────────┘
         │              │                    │
         ▼              ▼                    ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Django + Celery)                 │
│                                                             │
│  ┌────────────┐ ┌──────────────┐ ┌───────────────────────┐ │
│  │ Auth /     │ │ LootLocker   │ │ On-chain Kill Sync    │ │
│  │ User Mgmt  │ │ Integration  │ │ (Celery tasks)        │ │
│  └────────────┘ └──────────────┘ └──────────┬────────────┘ │
│                                              │              │
│  ┌──────────────────┐ ┌─────────────────┐    │              │
│  │ gunnies-crons    │ │ gunnies-pg-crons│    │              │
│  │ (Kaboom sync,    │ │ (kill TX, coins,│    │              │
│  │  LootLocker)     │ │  karrots, GCN)  │    │              │
│  └──────────────────┘ └─────────────────┘    │              │
└──────────────────────────────────────────────┼──────────────┘
                                               │
         ┌─────────────────────────────────────┼──────┐
         │          AVALANCHE C-CHAIN (43114)  │      │
         │                                     ▼      │
         │  ┌─────────────────┐ ┌─────────────────┐   │
         │  │ KhaosReward     │ │ GunniesKiller   │   │
         │  │ (lootbox claim) │ │ (kill tracking) │   │
         │  └─────────────────┘ └─────────────────┘   │
         │                                            │
         │  ┌─────────────────┐ ┌─────────────────┐   │
         │  │ Kaboom_Pass     │ │ Kaboom_         │   │
         │  │ (premium NFT)   │ │ Distributor     │   │
         │  └─────────────────┘ │ (mint w/ AVAX)  │   │
         │                      └─────────────────┘   │
         └────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│             FRONTEND (Next.js + RainbowKit + wagmi)         │
│                                                             │
│   ┌──────────┐  ┌──────────┐  ┌────────────────────────┐   │
│   │ /avax    │  │ NFT      │  │ Leaderboard /          │   │
│   │ Quests   │  │ Collect. │  │ Profile                │   │
│   └──────────┘  └──────────┘  └────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ⛓️ Avalanche Integration Details

### Why Avalanche?
- **Sub-second finality** — lootbox opens feel instant to the player
- **Low gas fees** — affordable for high-frequency kill-count syncs (every 15 min)
- **C-Chain EVM compatibility** — same Solidity contracts, no rewrite needed
- **Subnet / L1 potential** — future dedicated Gunnies chain for zero-gas gameplay

### Chain Configuration

| | Mainnet | Fuji Testnet |
|---|---|---|
| **Chain ID** | 43114 | 43113 |
| **RPC** | `https://api.avax.network/ext/bc/C/rpc` | `https://api.avax-test.network/ext/bc/C/rpc` |
| **Explorer** | [snowtrace.io](https://snowtrace.io) | [testnet.snowtrace.io](https://testnet.snowtrace.io) |
| **Currency** | AVAX | AVAX |

---

## 🗺️ Roadmap

### Phase 1 — Avalanche C-Chain (Current)
- [x] Port frontend to Avalanche C-Chain
- [x] Build AVAX-exclusive quests page (`/avax`)
- [x] Update backend chain configuration
- [x] Deploy KhaosReward, GunniesKiller, Kaboom_Pass, Kaboom_Distributor
- [x] Verify all contracts on Snowtrace
- [ ] QA full lootbox + Kaboom Pass flow on mainnet
- [ ] Deploy remaining contracts (GCN NFTs, crafting, tokens)
- [ ] Launch "Avalanche" exclusive hero unlock quest
- [ ] Deploy PFP Special Trait Collection

### Phase 2 — AVAX-Exclusive Content
- [ ] **Exclusive hero: "Avalanche"** — original character with Soulbound unlock quest
- [ ] **Frost PFP trait collection** — dynamic traits that evolve with on-chain activity
- [ ] Mythic 1-of-1 PFP generation via Avalanche VRF
- [ ] Tournament system with AVAX prize pools

### Phase 3 — Avalanche L1 Migration
- [ ] Evaluate dedicated Gunnies L1 for zero-gas gameplay
- [ ] Cross-chain bridge (C-Chain to Gunnies L1)
- [ ] DAO governance for game balance
- [ ] Cross-game NFT interoperability

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL
- Redis (for Celery)
- Foundry or Hardhat (for contract deployment)

### Quick Start

```bash
# Frontend
cd fe && npm install && npm run dev

# Backend
cd be && pip install -r requirements.txt && python manage.py runserver

# Contracts (using Foundry)
cd contracts && forge build
```

See individual `README.md` files in `/fe`, `/be`, and `/contracts` for detailed setup.

---

## 🔗 Links

- **AVAX Build Games**: [build.avax.network/build-games](https://build.avax.network/build-games)
- **Avalanche Docs**: [docs.avax.network](https://docs.avax.network)
- **Gunnies Website**: [gunnies.io](https://gunnies.io)
- **Gunnies AVAX Page**: [gunnies.io/avax](https://gunnies.io/avax)
- **Discord**: [discord.com/invite/pentagongamesxp](https://discord.com/invite/pentagongamesxp)
- **Twitter/X**: [@GunniesXP](https://x.com/GunniesXP)

---

## 📄 License

Proprietary — All rights reserved by Pentagon Games.

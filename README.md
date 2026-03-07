# 🔫 Gunnies FPS — Built on Avalanche

<p align="center">
  <img src="fe/public/avax-logo.svg" width="80" alt="Avalanche" />
</p>

> **Gunnies** is a free-to-play, cartoon-style first-person shooter with on-chain lootboxes, kill-count tracking, and NFT collectibles — now building on **Avalanche**.

| | |
|---|---|
| **Website** | [gunnies.io](https://gunnies.io) |
| **Steam** | [Gunnies on Steam](https://store.steampowered.com/app/3323030/Gunnies/) |
| **Epic Games** | [Gunnies on Epic](https://store.epicgames.com/en-US/p/gunnies-491615) |
| **Chain** | Avalanche C-Chain (Mainnet 43114 / Fuji Testnet 43113) |
| **AVAX Games Program** | [build.avax.network/build-games](https://build.avax.network/build-games) |

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
│  ┌────────────┐ ┌──────────────┐             │              │
│  │ Stripe     │ │ Chest/Reward │             │              │
│  │ Payments   │ │ Engine       │             │              │
│  └────────────┘ └──────────────┘             │              │
└──────────────────────────────────────────────┼──────────────┘
                                               │
         ┌─────────────────────────────────────┼──────┐
         │          AVALANCHE C-CHAIN          │      │
         │                                     ▼      │
         │  ┌────────────┐  ┌──────────────────────┐  │
         │  │ GCN NFTs   │  │ GunniesKiller.sol    │  │
         │  │ (ERC-721)  │  │ (kill-count SBT)     │  │
         │  └────────────┘  └──────────────────────┘  │
         │                                            │
         │  ┌────────────┐  ┌──────────────────────┐  │
         │  │ GCN Shards │  │ Karrot / Coin        │  │
         │  │ (ERC-1155) │  │ (ERC-20 rewards)     │  │
         │  └────────────┘  └──────────────────────┘  │
         │                                            │
         │  ┌────────────┐  ┌──────────────────────┐  │
         │  │ Crafting   │  │ GunniesSBT           │  │
         │  │ Router     │  │ (Soulbound Tokens)   │  │
         │  └────────────┘  └──────────────────────┘  │
         └────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND (Next.js + RainbowKit)             │
│                                                             │
│   ┌──────────┐  ┌──────────┐  ┌────────────────────────┐   │
│   │ Quests / │  │ NFT      │  │ Leaderboard /          │   │
│   │ Lootbox  │  │ Collect. │  │ Profile                │   │
│   └──────────┘  └──────────┘  └────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 How Gunnies Works

### The Game
Gunnies is a fast-paced FPS available on **Steam** and **Epic Games Store**. Players battle in cartoon-style arenas, earning in-game currency and rewards.

### Lootbox System
1. Players earn **chests** by playing matches and completing missions
2. Chests are opened on the **Avalanche C-Chain** — each open is an on-chain transaction
3. Rewards range from in-game stars and coins to **Karrot tokens** (ERC-20) and rare NFT drops
4. Premium users (NFT holders) get access to enhanced loot tables

### Kill-Count Sync to Blockchain
Every kill in Gunnies is tracked and periodically synced to the **GunniesKiller.sol** contract on Avalanche:

1. The game client reports kills to the Django backend
2. A Celery worker batches kill data per user per match
3. The `OnChainKillTxData` and `OnChainKillSummaryLog` models track pending syncs
4. A blockchain task submits batched kill counts to the `GunniesKiller` smart contract
5. Players receive a **Soulbound Token (SBT)** proving their kill history on-chain

This creates a verifiable, tamper-proof record of player performance.

### GCN Collectible Cards
- **7 unique characters** (Veronica, Sunny, Dustin, Degen, Butterknife, Mint Condition, Twitch)
- **3 rarity tiers**: Shard, Holo, Gold
- Mint on Avalanche, craft higher-tier cards via the **GCNCraftingRouter**
- Metadata stored on **Arweave** for permanent decentralization

---

## 📂 Repository Structure

```
gunnies-avax/
├── fe/              → Next.js frontend (website, wallet connection, NFT minting)
├── be/              → Django backend (auth, payments, game data, on-chain sync)
├── contracts/       → Solidity smart contracts (ERC-721, ERC-1155, SBTs, crafting)
├── game-scripts/    → Blockchain utility scripts (kill sync, chain helpers)
└── README.md        → You are here
```

See each subfolder's `README.md` for detailed setup instructions.

---

## ⛓️ Avalanche Integration

### Why Avalanche?
- **Sub-second finality** — lootbox opens feel instant
- **Low gas fees** — affordable for high-frequency kill-count syncs
- **C-Chain EVM compatibility** — straightforward migration of existing Solidity contracts
- **Subnet / L1 potential** — future dedicated Gunnies chain for zero-gas gameplay

### Chain Details

| | Mainnet | Fuji Testnet |
|---|---|---|
| **Chain ID** | 43114 | 43113 |
| **RPC** | `https://api.avax.network/ext/bc/C/rpc` | `https://api.avax-test.network/ext/bc/C/rpc` |
| **Explorer** | [snowtrace.io](https://snowtrace.io) | [testnet.snowtrace.io](https://testnet.snowtrace.io) |
| **Currency** | AVAX | AVAX |

### Contract Addresses (TBD)

All contracts will be redeployed on Avalanche C-Chain. Current addresses are placeholders:

| Contract | Address | Description |
|---|---|---|
| GCN721Main | TBD | Main NFT collection (ERC-721) |
| GCNShards | TBD | Card shards (ERC-1155) |
| GCNCraftingRouter | TBD | Craft higher-tier cards |
| GunniesKiller | TBD | Kill-count SBT |
| GunniesSBT | TBD | Soulbound achievement tokens |
| Karrot | TBD | ERC-20 reward token |
| Coin | TBD | In-game currency bridge |

---

## 🗺️ Roadmap

### 🔴 AVAX-Exclusive Content

These features are **only available on Avalanche** — they will never exist on any other chain.

#### ❄️ Exclusive Hero Character — *"Avalanche"*
A brand-new playable hero coming exclusively to the Avalanche ecosystem. This isn't a reskin — it's a fully original character with unique abilities, voice lines, and lore tied to Avalanche:

- **Custom 3D model & animations** designed from scratch for the AVAX launch
- **Signature ability: "Snowslide"** — an area-of-effect freeze that slows all enemies in range
- **Unlockable via on-chain quest**: players must complete a series of Avalanche-native missions (lootbox opens, kill milestones, crafting) to mint the hero as a Soulbound Token
- **In-game cosmetics**: Avalanche-branded weapon skins, emotes, and kill effects that only this hero can equip
- **Lore**: A rogue operative from the Avalanche subnet, drawn into the Gunnies arena by rumors of infinite respawns. Cold, calculating, and unstoppable once in motion.

> *"Avalanche" will be the first character in Gunnies whose existence is permanently recorded on-chain. Own the hero. Prove you earned it. No marketplace shortcuts — this one is soulbound.*

#### 🎨 Exclusive PFP Special Trait Collection
A limited-edition **PFP (profile picture) NFT collection** minted exclusively on Avalanche C-Chain, featuring traits that don't exist in any other Gunnies collection:

- **Avalanche-exclusive trait category**: "Frost" traits — icy particle effects, glacial backgrounds, and crystalline accessories that are unique to this chain
- **Dynamic metadata**: PFP traits evolve based on on-chain activity (kills, lootbox opens, crafting milestones) — the more you play on Avalanche, the rarer your PFP becomes
- **7 base characters × exclusive Frost variants** = dozens of never-before-seen combinations
- **Interoperable avatar**: usable as your in-game profile pic, Discord PFP, and across any Avalanche-compatible marketplace
- **Tiered rarity**: Common → Uncommon → Rare → Legendary → **Mythic (1-of-1 per character)** — Mythic PFPs are generated from on-chain randomness using Avalanche VRF

> *This collection is a love letter to the Avalanche community. Every trait, every combination, every Mythic 1-of-1 can only ever exist on AVAX. Collectors on other chains will never have access to these.*

---

### Phase 1 — Avalanche C-Chain (Current)
- [x] Port frontend to Avalanche C-Chain
- [x] Update backend chain configuration
- [ ] Deploy all contracts to Fuji testnet
- [ ] QA lootbox flow on testnet
- [ ] Deploy to Avalanche mainnet
- [ ] Audit smart contracts
- [ ] **Launch "Avalanche" exclusive hero unlock quest**
- [ ] **Deploy PFP Special Trait Collection contract**

### Phase 2 — AVAX-Exclusive Drops & L1 Migration
- [ ] Mint window for Exclusive PFP Special Trait Collection
- [ ] Activate dynamic PFP trait evolution engine
- [ ] "Avalanche" hero playable in-game with Soulbound unlock
- [ ] Evaluate Avalanche L1 (formerly Subnet) for dedicated Gunnies chain
- [ ] Design tokenomics for L1 gas token
- [ ] Implement cross-chain bridge (C-Chain ↔ Gunnies L1)
- [ ] Zero-gas gameplay for kill-count syncs

### Phase 3 — Ecosystem Expansion
- [ ] Marketplace for GCN card trading on Avalanche
- [ ] Tournament system with on-chain prize pools (AVAX-exclusive hero tournaments)
- [ ] Cross-game NFT interoperability via Avalanche standards
- [ ] DAO governance for game balance decisions
- [ ] Mythic 1-of-1 PFP auction events

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

See individual README files in each directory for full setup instructions.

---

## 🔗 Links

- **AVAX Game Program**: [build.avax.network/build-games](https://build.avax.network/build-games)
- **Avalanche Docs**: [docs.avax.network](https://docs.avax.network)
- **Gunnies Website**: [gunnies.io](https://gunnies.io)
- **Discord**: [discord.com/invite/pentagongamesxp](https://discord.com/invite/pentagongamesxp)
- **Twitter/X**: [@GunniesXP](https://x.com/GunniesXP)

---

## 📄 License

Proprietary — All rights reserved by Pentagon Games.

# Gunnies Smart Contracts — Avalanche C-Chain

Solidity smart contracts for the Gunnies FPS ecosystem. All contracts will be deployed on **Avalanche C-Chain (43114)** and tested on **Fuji Testnet (43113)**.

## Contracts

| Contract | Description | Status |
|---|---|---|
| **GCN721Main.sol** | Main Gunnies Collectible NFTs (ERC-721). 7 characters × 3 rarity tiers. | To be deployed |
| **GCNShards.sol** | Card shards used in crafting (ERC-1155). Combine shards to mint full cards. | To be deployed |
| **GCNCraftingRouter.sol** | Crafting system — burn shards + base cards to mint higher-rarity cards. | To be deployed |
| **GunniesKiller.sol** | On-chain kill tracking. Stores per-player kill counts synced from game server. | To be deployed |
| **GunniesSBT.sol** | Soulbound achievement tokens. Non-transferable proof of in-game accomplishments. | To be deployed |
| **Karrot.sol** | ERC-20 reward token earned from lootboxes and gameplay. | To be deployed |
| **Coin.sol** | In-game currency bridge token (ERC-20). | To be deployed |
| **Pumpkin.sol** | Seasonal event token (ERC-20). | To be deployed |

## Deployment

### Using Foundry (Recommended)

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Compile
forge build

# Deploy to Fuji Testnet
forge create --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --private-key $PRIVATE_KEY \
  src/GCN721Main.sol:GCN721Main

# Deploy to Avalanche Mainnet
forge create --rpc-url https://api.avax.network/ext/bc/C/rpc \
  --private-key $PRIVATE_KEY \
  src/GCN721Main.sol:GCN721Main
```

### Using Hardhat

```bash
npx hardhat compile
npx hardhat deploy --network avalanche
npx hardhat deploy --network fuji
```

## Contract Addresses (TBD)

All contracts will be redeployed fresh on Avalanche. Addresses will be updated here after deployment.

| Contract | Fuji (Testnet) | Mainnet |
|---|---|---|
| GCN721Main | TBD | TBD |
| GCNShards | TBD | TBD |
| GCNCraftingRouter | TBD | TBD |
| GunniesKiller | TBD | TBD |
| GunniesSBT | TBD | TBD |
| Karrot | TBD | TBD |
| Coin | TBD | TBD |
| Pumpkin | TBD | TBD |

## Verification

After deployment, verify on SnowTrace:

```bash
forge verify-contract <ADDRESS> src/GCN721Main.sol:GCN721Main \
  --chain-id 43114 \
  --etherscan-api-key $SNOWTRACE_API_KEY
```

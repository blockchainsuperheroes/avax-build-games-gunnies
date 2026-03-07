# Gunnies Smart Contracts — Avalanche C-Chain

Solidity smart contracts for the Gunnies game ecosystem, targeting Avalanche C-Chain deployment.

## Contracts

| Contract | Description |
|----------|-------------|
| **GCN721Main.sol** | ERC-721 NFT collection for Gunnies characters |
| **GunniesKiller.sol** | On-chain kill count tracking and verification |
| **GunniesSBT.sol** | Soulbound achievement tokens (non-transferable) |
| **Coin.sol** | Stars — in-game reward token |
| **Karrot.sol** | Karrots — premium currency token |
| **GCNCraftingRouter.sol** | Item crafting and combination logic |
| **GCNShards.sol** | Crafting material shards |
| **Pumpkin.sol** | Seasonal event token |

## Target Networks

| Network | Chain ID | RPC |
|---------|----------|-----|
| Avalanche C-Chain | 43114 | `https://api.avax.network/ext/bc/C/rpc` |
| Fuji Testnet | 43113 | `https://api.avax-test.network/ext/bc/C/rpc` |

## Deployment

All contracts will be deployed on Avalanche C-Chain. Addresses TBD.

```bash
# Deploy with Foundry
forge create --rpc-url https://api.avax-test.network/ext/bc/C/rpc \
  --private-key $DEPLOYER_KEY \
  contracts/GunniesKiller.sol:GunniesKiller

# Deploy with Hardhat
npx hardhat run scripts/deploy.js --network avalanche
```

## Key Design Decisions
- **Kill Count On-Chain:** GunniesKiller.sol stores batched kill counts, enabling trustless leaderboards
- **Soulbound Tokens:** Achievement badges are non-transferable (SBT standard)
- **ERC-721 for Characters:** Full NFT ownership of game characters with on-chain metadata
- **Token Economy:** Dual token model (Stars for engagement, Karrots for premium)

# Game Scripts — Blockchain Sync

Scripts that bridge game server data to Avalanche C-Chain smart contracts.

## Scripts

| Script | Description |
|--------|-------------|
| **blockchain_tasks.py** | Celery tasks for batching and syncing kill counts to chain |
| **blockchain_utils.py** | Web3 utilities for contract interaction on Avalanche |

## How Kill Count Sync Works

1. Game server records player kills in real-time (backend DB)
2. Periodically (configurable interval), `blockchain_tasks.py` batches unsync'd kills
3. Batch is submitted to `GunniesKiller.sol` on Avalanche C-Chain
4. Transaction confirmed → kills permanently recorded on-chain
5. Leaderboard queries read from on-chain data for trustless rankings

## Configuration

Set these environment variables:
```
AVAX_RPC_URL=https://api.avax.network/ext/bc/C/rpc
AVAX_CHAIN_ID=43114
DEPLOYER_PRIVATE_KEY=<your-key>
GUNNIES_KILLER_CONTRACT=<deployed-address>
```

## Usage
```bash
pip install web3 celery
python blockchain_tasks.py
```

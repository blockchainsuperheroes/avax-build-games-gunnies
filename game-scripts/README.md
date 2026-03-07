# Game Scripts — Blockchain Utilities

Standalone Python scripts extracted from the backend for blockchain interaction with the Avalanche C-Chain.

## Files

| Script | Description |
|---|---|
| **blockchain_utils.py** | Chain configuration, Web3 connection helpers, kill-count utilities, wallet signature verification |
| **blockchain_tasks.py** | Celery task definitions for async on-chain operations (reward distribution, asset grants) |

## Chain Configuration

The `get_chain_details()` function maps chain IDs to RPC endpoints:

- **Avalanche Mainnet (43114)**: `https://api.avax.network/ext/bc/C/rpc`
- **Avalanche Fuji (43113)**: `https://api.avax-test.network/ext/bc/C/rpc`

## Kill-Count Sync Flow

```
Game Match Ends
      │
      ▼
Backend receives kill report
      │
      ▼
OnChainKillTxData created (from_user, to_user, match_id, count)
      │
      ▼
Celery task picks up pending sync
      │
      ▼
Web3.py submits tx to GunniesKiller contract on Avalanche
      │
      ▼
OnChainKillTxLog updated with tx_hash and status
      │
      ▼
OnChainKillSummaryLog aggregates total kills per user
```

## Usage

These scripts require the Django environment and dependencies from the backend:

```bash
cd ../be
source venv/bin/activate
pip install -r requirements.txt

# Set required env vars
export NODE_RPC_URL_AVAX=https://api.avax.network/ext/bc/C/rpc
export NODE_RPC_URL_AVAX_FUJI=https://api.avax-test.network/ext/bc/C/rpc
```

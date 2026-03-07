# Gunnies Backend — Django + Celery

Django REST API backend for Gunnies FPS. Handles authentication, game data, payments, lootbox logic, and on-chain kill-count synchronization to Avalanche.

## Tech Stack

- **Framework**: Django 4.2 + Django REST Framework
- **Task Queue**: Celery + Redis
- **Database**: PostgreSQL
- **Blockchain**: Web3.py (Avalanche C-Chain)
- **Payments**: Stripe
- **Game Backend**: LootLocker
- **Storage**: Google Cloud Storage

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env (see .env.example)
cp .env.example .env
# Fill in all required values

# Run migrations
python manage.py migrate

# Start dev server
python manage.py runserver

# Start Celery worker (separate terminal)
celery -A core worker -l info
```

## Key Modules

### `common/` — Core Application
- **models.py** — User, ChestReward, OnChainKillTxData, Missions, GameSeason, etc.
- **views.py** — REST API endpoints for auth, chests, rewards, on-chain operations
- **utils.py** — Chain configuration (Avalanche C-Chain 43114 / Fuji 43113), Web3 helpers
- **tasks.py** — Celery tasks for async reward distribution and blockchain sync
- **lootlocker.py** — LootLocker API integration

### `steam/` — Steam Integration
- Steam authentication and player data sync

### `core/` — Django Configuration
- Settings, URL routing, Celery config

## On-Chain Kill Sync (Avalanche)

The backend tracks kills and syncs them to the `GunniesKiller` contract on Avalanche:

1. Game client reports kills → `OnChainKillTxData` created
2. Celery batches kills per user per match
3. `OnChainKillTxLog` tracks per-chain submission status
4. `OnChainKillSummaryLog` tracks aggregate kill counts

### Chain Configuration

Configured in `common/utils.py`:
- **Avalanche Mainnet**: Chain ID 43114
- **Avalanche Fuji Testnet**: Chain ID 43113

## Environment Variables

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | PostgreSQL connection |
| `NODE_RPC_URL_AVAX` | Avalanche C-Chain RPC |
| `NODE_RPC_URL_AVAX_FUJI` | Avalanche Fuji testnet RPC |
| `CELERY_BROKER_URL` | Redis URL for Celery |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `LOOTLOCKER_SERVER_KEY` | LootLocker server key |
| `PG_LOGIN_BACKEND_URL` | Pentagon Games login API |
| `STEAM_API_KEY` | Steam Web API key |
| `GCS_BUCKET_NAME` | Google Cloud Storage bucket |

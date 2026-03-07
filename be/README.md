# Gunnies Backend — Django API

Python Django backend powering the Gunnies game infrastructure.

## Features
- Player authentication and session management
- Loot box reward generation and distribution
- Kill count aggregation from game servers
- Blockchain sync (kill counts → Avalanche C-Chain)
- Leaderboard computation
- Daily quest reset logic
- Steam integration

## Stack
- Python 3.10+
- Django + Django REST Framework
- PostgreSQL
- Web3.py (Avalanche C-Chain interaction)
- Celery (background tasks)

## Setup
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Key Modules
- `core/` — Core game logic, user management, rewards
- `common/` — Shared utilities
- `steam/` — Steam platform integration

## API Documentation
See [API_DOCS.md](./API_DOCS.md) for full endpoint reference.

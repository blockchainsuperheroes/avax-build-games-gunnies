# Gunnies PG Crons

⏰ **ChainGunnies - Pentagon Chain Cron Jobs**

## TLDR

Background scheduler that distributes on-chain rewards for Gunnies game. Sends currencies, kill counts, airdrops on Pentagon Chain.

## Stack

- Flask + APScheduler
- SQLAlchemy (PostgreSQL)
- Web3.py for contract interactions

## Deployment

| Field | Value |
|-------|-------|
| **Server** | gunnie-backend-proxy |
| **IP** | 35.200.106.55 |
| **Specs** | c3-highcpu-8 (8 vCPU), Debian 12 |
| **Path** | `/var/www/gunnies-backend/gunnies-pg-crons` |
| **Port** | 8002 |
| **Process** | gunicorn (gevent) |
| **Process Manager** | supervisord |


### Service Running

```bash
gunicorn app:myapp --bind=0.0.0.0:8002 --worker-class gevent --timeout 0 --log-level debug
```

## Scheduled Jobs

| Job | Interval | Description |
|-----|----------|-------------|
| `send_currencies` | 10 min | Send currency rewards on-chain |
| `send_kill_count` | 15 min | Send kill count data on-chain |
| `send_total_kills` | 24 hr | Daily total kills aggregation |
| `pumpkin_airdrop` | 20 min | Pumpkin token airdrops |
| `gcn_shards_airdrop` | 5 min | GCN Shards airdrops |

## Contracts

- `currency_contract_abi.json`
- `kill_contract_abi.json`
- `gcn_shards_contract_abi.json`
- `pumpkin_contract_abi.json`

## Run Locally

```bash
pip install -r requirements.txt
python -m app
```

## Deploy

```bash
cd /var/www/gunnies-backend/gunnies-pg-crons
git pull
sudo supervisorctl restart gunnies-pg-crons
```

## Related Repos

- [Gunnies Backend](https://github.com/blockchainsuperheroes/gunnies-backend) - Main API (same server, port 9091)

---
*Pentagon Games / Blockchain Superheroes*


**Health Check:** Monitored by [`health-check.yml`](https://github.com/blockchainsuperheroes/gunnies-backend/actions/workflows/health-check.yml)

| Check | Endpoint | Schedule |
|-------|----------|----------|
| HTTP 200 | `35.200.106.55:8002` | 3x daily (00:04, 08:04, 16:04 UTC) |

On failure: Creates GitHub issue, assigns @nftprof, escalates after 8h, emails after 3 days.

## Monitoring

| Type | Port | Server |
|------|------|--------|
| INTERNAL | `8002` | `35.200.106.55` |

**Not externally monitored.** Check via SSH: `netstat -tlnp | grep 8002`

See [github_alert.md](https://github.com/blockchainsuperheroes/gunnies-backend/blob/main/docs/github_alert.md) for monitoring docs.

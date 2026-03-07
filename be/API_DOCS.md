# Gunnies Backend — API Documentation

*REST API endpoints for Gunnies.io*

---

## Base URL

- **Production:** `https://[TBD]/`
- **Staging:** `https://[TBD]/`

---

## Authentication

Most endpoints require LootLocker session token in header:
```
Authorization: Bearer <lootlocker_session_token>
```

Some endpoints use API key:
```
X-API-Key: <api_key_secret>
```

---

## Endpoints

### User Management

#### Create User
```
POST /user/create
```
Create a new user account.

#### Create Epic User
```
POST /user/create/epic
```
Create user via Epic Games authentication.

#### Create Steam User
```
POST /user/create/steam
```
Create user via Steam authentication.

#### Generate User Token
```
POST /user/token
```
Generate authentication token for user.

#### Generate Steam User Token
```
POST /user/token/steam
```
Generate token for Steam user.

#### User Auth Login
```
POST /user/auth/login
```
Login with auth credentials.

#### User Wallet Login
```
POST /user/login/wallet
```
Login with Web3 wallet signature.

#### Get User Info
```
GET /user/info
```
Get current user information.

#### Connect PG Account
```
POST /user/connect_pg
```
Connect Pentagon Games account.

#### Daily Rewards
```
POST /user/daily_reward
```
Claim daily reward.

---

### Payments (Stripe)

#### Payment Webhook
```
POST /payment/webhook
```
Stripe webhook endpoint for payment events.

#### Get Price
```
GET /payment/price/<price_id>
```
Get Stripe price details.

#### Get User Subscriptions
```
GET /payment/subscriptions
```
Get user's active subscriptions.

#### Update Subscription
```
PATCH /payment/subscriptions/<sub_id>
```
Update/cancel subscription.

---

### Chest System

#### Check Eligibility
```
GET /chest/eligibility
```
Check if user can open a chest.

#### Open Chest
```
POST /chest/open/<chest_type>
```
Open a chest and receive rewards.

#### Open Chest (Private)
```
POST /private/chest/open
```
Internal chest opening endpoint.

---

### Leaderboards

#### Stars Leaderboard
```
GET /stars/leaderboard
```
Get stars leaderboard (authenticated).

#### Stars Leaderboard Public
```
GET /stars/leaderboard/public
```
Get public stars leaderboard.

#### Reward Leaderboard
```
GET /leaderboard/<reward_type>
```
Get leaderboard for specific reward type.

#### LootLocker Leaderboard Submit
```
POST /lootlocker/leaderboard/submit
```
Submit score to LootLocker leaderboard.

---

### Rewards

#### User Rewards
```
GET /user/rewards
```
Get user's rewards.

#### User Rewards V2
```
GET /user/rewards/v2
```
Get user's rewards (v2 format).

#### Check Reward Balance
```
GET /reward_balance/<reward_type>
```
Check balance for specific reward type.

#### Kill Reward Claim
```
POST /kill_reward_claim
```
Claim kill-based rewards.

#### Bunny Pump Reward
```
POST /bunny_pump_reward
```
Claim bunny pump event reward.

---

### Match Data

#### Save Match Data
```
POST /match/save_data
```
Save match results and send coin rewards.

#### Save Currency Data
```
POST /match/save_currency_data
```
Save currency earned in match.

#### Save Kill Data
```
POST /match/save_kill_data
```
Save kill statistics from match.

#### Create Match Session
```
POST /match/create_session
```
Create new match session token.

---

### Missions

#### Active Missions
```
GET /missions/active
```
Get list of active missions.

#### Update Mission Progress
```
POST /missions/<mission_id>/update
```
Update progress on a mission.

#### Claim Mission Reward
```
POST /missions/<mission_id>/claim
```
Claim reward for completed mission.

---

### Mini Games

#### Check Eligibility
```
GET /minigame/eligibility
```
Check if user can play mini game.

#### Start Session
```
POST /minigame/start_session
```
Start a mini game session.

#### Finish Session
```
POST /minigame/finish_session
```
Complete mini game session and submit results.

---

### Shop

#### Purchase History
```
GET /shop/purchase_history
```
Get user's purchase history.

#### Purchase Detail
```
GET /shop/purchase_detail/<order_id>
```
Get details of specific purchase.

---

### Media

#### List All Media
```
GET /media/list
```
List all media files.

#### Upload Media
```
POST /media/upload
```
Upload media file to GCS.

---

### LootLocker

#### Send LootLocker Item
```
POST /send_lootlocker_item
```
Send item to user via LootLocker.

---

### Tasks

#### Task Result Detail
```
GET /task_status/<task_id>
```
Get status of async Celery task.

---

## Steam Endpoints

Base path: `/steam/`

[TBD — document steam/ module endpoints]

---

## Response Formats

### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Rate Limits

[TBD — document rate limits if any]

---

*Last updated: 2026-02-19*
*Documented by: Cerise01*

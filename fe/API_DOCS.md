# Gunnies Website Fullstack - API Documentation

## External APIs

### Auth Backend
Base URL: `NEXT_PUBLIC_LOGIN_API`

#### POST /user/login
Authenticate user.

#### POST /user/captcha/generate
Generate captcha for registration.

#### POST /user/validate_email/v2
Validate user email.

#### POST /user/resend_verify_email
Resend verification email.

---

### Gunnies Backend API
Base URL: `NEXT_PUBLIC_GUNNIES_API`

#### GET /user/info
Get authenticated user info.

**Headers:**
```
Authorization: Bearer {token}
```

#### GET /stars/leaderboard
Get authenticated user's leaderboard (includes personal rank).

**Query Params:**
- `page`: Pagination

**Headers:**
```
Authorization: Bearer {token}
```

#### GET /stars/leaderboard/public
Get public leaderboard.

**Query Params:**
- `page`: Pagination

#### GET /chest/eligibility
Check if user can open a chest.

**Headers:**
```
Authorization: Bearer {token}
```

---

## Internal API Proxy

Requests to `/api/{PROXY_PATH}/*` are proxied to the login backend to handle CORS:

```
/api/proxy/user/validate_email/v2 → LOGIN_API/user/validate_email/v2
/api/proxy/user/resend_verify_email → LOGIN_API/user/resend_verify_email
```

---

## Smart Contract Interactions

### GCN Characters
```typescript
// src/abi/gcnCharacters.ts
- mint(tokenId, quantity)
- balanceOf(address, tokenId)
- safeTransferFrom(from, to, tokenId, amount)
```

### GCN Shards
```typescript
// src/abi/gcnShards.ts
- balanceOf(address)
- transfer(to, amount)
- approve(spender, amount)
```

### Crafting System
```typescript
// src/abi/gcnCraftingRoute.ts
- craft(inputTokenIds, inputAmounts, outputTokenId)
- getCraftingRecipes()
```

### PFP Gunnies
```typescript
// src/abi/pfpGunnies.ts
- mint(quantity)
- tokenOfOwnerByIndex(owner, index)
- tokenURI(tokenId)
```

### Reward Distributors
```typescript
// kaboomDistributor.ts / pentagonDistributor.ts / khaoRewards.ts
- claim()
- pendingRewards(address)
- claimableAmount(address)
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Gunnies Authentication                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │   Email/     │  │   Wallet     │                            │
│  │   Password   │  │   Connect    │                            │
│  └──────┬───────┘  └──────┬───────┘                            │
│         │                 │                                     │
│         └────────┬────────┘                                     │
│                  │                                              │
│                  ▼                                              │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Auth Backend                   │      │
│  │              NEXT_PUBLIC_LOGIN_API                    │      │
│  └────────────────────────┬─────────────────────────────┘      │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────┐      │
│  │                  NextAuth Session                     │      │
│  └────────────────────────┬─────────────────────────────┘      │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────┐      │
│  │              Gunnies Backend API                      │      │
│  │              NEXT_PUBLIC_GUNNIES_API                  │      │
│  │  (leaderboards, shop, chests, rewards)               │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Stripe Integration

### Checkout Flow
1. User adds items to cart
2. Create checkout session via Stripe SDK
3. Redirect to Stripe hosted checkout
4. Return to `/success` or `/cancel`

### Webhooks
Handled by Gunnies Backend to fulfill purchases.

---

## State Management

### Zustand Store
Global state for:
- User session
- Cart items
- UI state

### React Query
Server state for:
- Leaderboard data (infinite query with pagination)
- User profile
- Chest eligibility
- Shop products

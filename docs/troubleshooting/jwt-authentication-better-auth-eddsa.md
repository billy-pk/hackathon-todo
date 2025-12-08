# JWT Authentication: Better Auth EdDSA Integration

## Problem Summary

When implementing JWT authentication between Better Auth (frontend) and FastAPI (backend), encountered a critical algorithm mismatch that caused all authenticated API requests to fail with 401 Unauthorized errors.

**Error**: `JWT validation error: The specified alg value is not allowed`

**Root Cause**: Better Auth JWT plugin uses asymmetric EdDSA algorithm by default, but backend was configured for symmetric HS256 validation.

---

## Key Discovery

**CRITICAL**: Better Auth JWT plugin ONLY supports asymmetric algorithms:
- EdDSA (default)
- ES256
- RS256
- PS256

The JWT plugin **DOES NOT** support symmetric HS256 and **CANNOT** disable JWKS. This is by design for security.

---

## Solution Architecture

### Frontend (Better Auth)
- Uses JWT plugin with EdDSA signing
- Stores private key in `jwks` database table
- Exposes public keys at `/api/auth/jwks` endpoint
- Generates JWT tokens with custom payload including `user_id`

### Backend (FastAPI)
- Uses PyJWKClient to fetch public keys from Better Auth JWKS endpoint
- Validates JWT signature using EdDSA algorithm
- Verifies token expiration
- Extracts `user_id` from payload

---

## Implementation Details

### 1. Better Auth Configuration

**File**: `frontend/lib/auth.ts`

```typescript
import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  emailAndPassword: {
    enabled: true,
  },

  // JWT plugin with custom payload
  plugins: [
    jwt({
      jwt: {
        // CRITICAL: Customize payload to include user_id for backend
        definePayload: ({ user }) => {
          return {
            user_id: user.id,
            email: user.email,
            name: user.name,
          };
        },
      },
    }),
  ],
});
```

### 2. Database Migrations

**Better Auth requires JWKS table**:

```sql
-- Migration: 003_create_jwks_table.sql
CREATE TABLE IF NOT EXISTS "jwks" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "publicKey" TEXT NOT NULL,
  "privateKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "expiresAt" TIMESTAMP
);
```

### 3. Backend JWT Validation

**File**: `backend/middleware.py`

**Key Changes**:
- Switched from `python-jose` to `PyJWT` with cryptography support
- Added `PyJWKClient` for automatic JWKS fetching
- Updated algorithms to `["EdDSA", "ES256", "RS256"]`
- Disabled audience validation with `verify_aud: False`

```python
from jwt import PyJWKClient
import jwt

# CRITICAL: JWKS endpoint is at /api/auth/jwks (not /jwks)
JWKS_URL = f"{settings.BETTER_AUTH_URL}/api/auth/jwks"
jwks_client = PyJWKClient(JWKS_URL)

def verify_token(token: str) -> Optional[str]:
    try:
        # Fetch signing key from JWKS endpoint
        signing_key = jwks_client.get_signing_key_from_jwt(token)

        # Decode and verify with EdDSA
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["EdDSA", "ES256", "RS256"],
            options={
                "verify_exp": True,
                "verify_aud": False,  # CRITICAL: Disable if not configured
            }
        )

        # Extract user_id from custom payload
        user_id = payload.get("user_id")
        return user_id

    except Exception as e:
        print(f"JWT validation error: {e}")
        return None
```

### 4. Backend Dependencies

**Install PyJWT with cryptography support**:

```bash
uv add pyjwt[crypto] cryptography
```

**Remove old dependency**:
```bash
uv remove python-jose
```

### 5. Environment Configuration

**File**: `backend/.env`

```env
# CRITICAL: Must point to Better Auth frontend for JWKS endpoint
BETTER_AUTH_URL=http://localhost:3000

# Must match frontend secret
BETTER_AUTH_SECRET=4hLIPO0rFrucCRkI4ohtxO9c5DTTQjpeHRqh6t4UWQQ=
```

**File**: `backend/config.py`

```python
class Settings(BaseSettings):
    BETTER_AUTH_SECRET: str
    BETTER_AUTH_URL: str = "http://localhost:3000"  # For JWKS endpoint
```

---

## Common Errors and Fixes

### Error 1: "The specified alg value is not allowed"
**Cause**: Backend configured for HS256, token uses EdDSA
**Fix**: Update backend to support EdDSA with PyJWKClient

### Error 2: "HTTP Error 404: Not Found" (JWKS fetch)
**Cause**: JWKS URL incorrect (was `/jwks`)
**Fix**: Use `/api/auth/jwks` endpoint

### Error 3: "Invalid audience"
**Cause**: JWT contains audience claim but backend not configured
**Fix**: Add `verify_aud: False` to jwt.decode options

### Error 4: "relation 'jwks' does not exist"
**Cause**: Missing JWKS database table
**Fix**: Run migration to create `jwks` table

---

## Testing the Flow

### 1. Sign Up New User
```bash
# Frontend creates user in Better Auth
POST /api/auth/sign-up/email
{
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}
```

### 2. Sign In
```bash
# Better Auth creates session and generates JWT
POST /api/auth/sign-in/email
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 3. Get JWT Token
```typescript
// Frontend retrieves JWT from Better Auth
const { data } = await authClient.token();
const jwt = data?.token;
```

### 4. Verify JWT Structure
```bash
# Decode JWT header (should show EdDSA)
echo "eyJhbGciOiJFZERTQSIs..." | base64 -d
# Output: {"alg":"EdDSA","typ":"JWT"}
```

### 5. Make Authenticated Request
```bash
# Backend validates JWT using JWKS public key
GET /api/{user_id}/tasks
Authorization: Bearer <jwt_token>
```

### 6. Backend Validation Steps
1. Extract Bearer token from Authorization header
2. Fetch public key from `/api/auth/jwks` via PyJWKClient
3. Verify EdDSA signature
4. Check expiration time
5. Extract `user_id` from payload
6. Add `user_id` to request.state
7. Process request

---

## Debug Logging

### Frontend (`frontend/lib/api.ts`)
```typescript
console.log("=== DEBUG: Calling authClient.token() ===");
const { data, error } = await authClient.token();
console.log("=== DEBUG: Token response ===", { data, error });
console.log("=== DEBUG: Got JWT token (first 50 chars) ===", data.token.substring(0, 50));
```

### Backend (`backend/middleware.py`)
```python
print(f"=== DEBUG BACKEND: Received token (first 50 chars): {token[:50]}")
print(f"=== DEBUG BACKEND: Decoded payload: {payload}")
print(f"=== DEBUG BACKEND: Successfully validated token for user_id: {user_id}")
```

---

## Key Takeaways

1. **Better Auth JWT plugin requires asymmetric algorithms** - cannot use HS256
2. **JWKS cannot be disabled** - it's integral to the JWT plugin design
3. **JWKS endpoint is at `/api/auth/jwks`** - not `/jwks`
4. **PyJWKClient handles caching** - automatically fetches and caches public keys
5. **Custom JWT payload requires definePayload** - to include `user_id` field
6. **Audience validation must be disabled** - if not configured in Better Auth
7. **Both services must share BETTER_AUTH_SECRET** - for session validation
8. **BETTER_AUTH_URL points to frontend** - where JWKS endpoint is hosted

---

## References

- Better Auth JWT Plugin: https://www.better-auth.com/docs/plugins/jwt
- PyJWT Documentation: https://pyjwt.readthedocs.io/
- EdDSA Algorithm: RFC 8032 (Edwards-Curve Digital Signature Algorithm)
- JWKS Specification: RFC 7517 (JSON Web Key)

---

## Date Created
2025-12-08

## Related Files
- `frontend/lib/auth.ts` - Better Auth configuration with JWT plugin
- `frontend/lib/api.ts` - API client with JWT token retrieval
- `backend/middleware.py` - JWT validation middleware with EdDSA support
- `backend/config.py` - Backend configuration settings
- `backend/migrations/003_create_jwks_table.sql` - JWKS table migration

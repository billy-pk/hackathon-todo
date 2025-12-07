# System Architecture – Phase II

## Architecture Overview
Phase II implements a full-stack architecture with strict separation of concerns:
Frontend (Next.js) → REST API → FastAPI Backend → SQLModel → Neon DB

The frontend handles:
- UI
- User authentication using Better Auth
- JWT generation
- Calling backend APIs with Authorization headers

The backend handles:
- Token validation
- CRUD logic
- Database operations
- Ownership enforcement (per-user access)

---

## Request Flow (Authenticated)
1. User signs in using Better Auth
2. Better Auth issues JWT containing `user_id`
3. Frontend stores JWT and attaches it to all API requests:
   Authorization: Bearer <token>
4. FastAPI middleware verifies:
- Token signature
- Expiration
- user_id
5. Backend performs DB operations filtered by user_id
6. Backend responds with JSON

---

## JWT Requirements
- Same secret (`BETTER_AUTH_SECRET`) shared between frontend and backend
- Payload must include:
  {
"user_id": "<uuid or string>",
"email": "<string>",
"exp": "<timestamp>"
  }

---

## Data Flow Diagram

User → Next.js → Better Auth → JWT → FastAPI → SQLModel → Neon DB
↑ ↓
Authorization Header Filter by user_id


---

## Future-Proofing
Phase II architecture must support upcoming additions:

| Phase | Integration |
|------|-------------|
| III  | MCP server, Agents SDK |
| IV   | Docker, Kubernetes, Helm |
| V    | Kafka events, Dapr sidecars, microservices |

Thus backend must be modular and stateless.


# Authentication Flow – JWT + Better Auth

## Login Flow
1. User logs in on the frontend using Better Auth.
2. Better Auth issues JWT signed with `BETTER_AUTH_SECRET`.
3. JWT is stored in frontend memory.
4. Every API request must attach:
Authorization: Bearer <token>

---

## Backend Responsibilities
- Extract JWT
- Verify using same secret
- Decode payload
- Attach `user_id` to request state
- Reject unauthorized access

---

## Error Responses
- 401 Unauthorized (no token)
- 401 Invalid token
- 401 Expired token
- 403 Forbidden (user mismatch)

# Feature: Authentication (Better Auth + JWT)

## Purpose
Implement secure user authentication using Better Auth on frontend and JWT verification on backend.

---

## Functional Requirements
- User signup
- User login
- JWT token generation
- Frontend attaches JWT to all API requests
- Backend verifies JWT
- Backend enforces user_id matching

---

## JWT Requirements
Payload must include:
- user_id (string)
- email
- exp (expiration time)

---

## Backend Requirements
- Reject requests without valid JWT
- Reject mismatched user_id in URL
- Reject expired tokens
- Reject invalid signatures

---

## Better Auth Requirements
- Must use JWT plugin
- Must expose token to API client
- Must use shared secret `BETTER_AUTH_SECRET`

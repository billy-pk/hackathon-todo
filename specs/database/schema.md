# Database Schema – Phase II

## Table: tasks

| Field       | Type      | Constraints                          |
|-------------|-----------|---------------------------------------|
| id          | UUID      | Primary key                           |
| user_id     | String    | Required, FK (Better Auth user id)    |
| title       | String    | Required, 1-200 chars                 |
| description | Text      | Optional, max 1000 chars              |
| completed   | Boolean   | Default: false                        |
| created_at  | DateTime  | Auto timestamp (UTC)                  |
| updated_at  | DateTime  | Auto timestamp (UTC)                  |

---

## Notes
- All timestamps stored in UTC.
- All queries filtered by `user_id`.

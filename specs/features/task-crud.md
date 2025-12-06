# Feature: Task CRUD Operations (REST Version)

## User Stories
- As a user, I can create tasks with title and optional description
- As a user, I can view my own tasks
- As a user, I can update an existing task
- As a user, I can delete my tasks
- As a user, I can mark tasks complete or incomplete

---

## Acceptance Criteria

### Create Task
- Required fields:
  - `title` (1–200 chars)
- Optional fields:
  - `description` (max 1000 chars)
- Task linked to authenticated `user_id`
- Returns created task with generated `id`

### View Tasks
- Only user’s own tasks are shown
- Sorted by `created_at` (descending)
- Supports filters:
  - status: `all`, `pending`, `completed`

### Update Task
- Users may update:
  - title
  - description
- Task ownership enforced

### Delete Task
- Only owner can delete a task
- Returns success confirmation

### Toggle Completion
- PATCH request toggles boolean `completed`
- Stores updated timestamp

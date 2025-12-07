# Data Model: Phase 2 Todo Application

**Date**: 2025-12-06
**Feature**: Phase 2 Full-Stack Todo Application
**Purpose**: Define complete database schema, models, and data validation rules

## Database Schema

### Tables

#### `tasks` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique task identifier, generated automatically |
| user_id | VARCHAR(255) | NOT NULL, INDEX | Foreign key to user (Better Auth managed), indexed for query performance |
| title | VARCHAR(200) | NOT NULL | Task title, required, 1-200 characters |
| description | TEXT | NULL | Task description, optional, max 1000 characters |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status, defaults to incomplete |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Creation timestamp in UTC |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update timestamp in UTC |

**Indexes**:
- PRIMARY KEY on `id` (automatic)
- INDEX on `user_id` (for efficient user-specific queries)
- COMPOSITE INDEX on `(user_id, created_at DESC)` (for sorted task lists)
- COMPOSITE INDEX on `(user_id, completed)` (for status filtering)

**Notes**:
- `user_id` references users managed by Better Auth (not enforced via foreign key due to separate auth system)
- All timestamps stored in UTC using ISO8601 format
- `updated_at` automatically updated via trigger or application logic
- PostgreSQL UUID generation via `gen_random_uuid()`

#### `users` Table (managed by Better Auth)

Better Auth manages the users table. We reference it but do not create it ourselves. It contains:
- `id` (string/UUID)
- `email`
- `password` (hashed)
- Other auth-related fields

---

## SQLModel Definitions

### Task Model

```python
from sqlmodel import Field, SQLModel
from datetime import datetime
from uuid import UUID, uuid4
from typing import Optional

class Task(SQLModel, table=True):
    """
    Task model for database table.
    Represents a todo item belonging to a specific user.
    """
    __tablename__ = "tasks"

    id: UUID = Field(
        default_factory=uuid4,
        primary_key=True,
        description="Unique task identifier"
    )

    user_id: str = Field(
        index=True,
        max_length=255,
        description="User ID from Better Auth"
    )

    title: str = Field(
        max_length=200,
        min_length=1,
        description="Task title (required)"
    )

    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Task description (optional)"
    )

    completed: bool = Field(
        default=False,
        description="Completion status"
    )

    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Creation timestamp (UTC)"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp (UTC)"
    )

    class Config:
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "user_123",
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "completed": False,
                "created_at": "2025-12-06T12:00:00Z",
                "updated_at": "2025-12-06T12:00:00Z"
            }
        }
```

---

## Pydantic Schemas (Request/Response)

### Create Task Request

```python
from pydantic import BaseModel, Field, validator

class TaskCreate(BaseModel):
    """Request schema for creating a new task"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

    @validator('title')
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip()

    @validator('description')
    def description_optional(cls, v):
        if v is not None:
            return v.strip() if v.strip() else None
        return None

    class Config:
        schema_extra = {
            "example": {
                "title": "Buy groceries",
                "description": "Milk, eggs, bread"
            }
        }
```

### Update Task Request

```python
class TaskUpdate(BaseModel):
    """Request schema for updating a task"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

    @validator('title')
    def title_not_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Title cannot be empty or whitespace only')
        return v.strip() if v is not None else None

    class Config:
        schema_extra = {
            "example": {
                "title": "Buy groceries and cook dinner",
                "description": "Updated description"
            }
        }
```

### Task Response

```python
class TaskResponse(BaseModel):
    """Response schema for task data"""
    id: UUID
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "user_123",
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "completed": False,
                "created_at": "2025-12-06T12:00:00Z",
                "updated_at": "2025-12-06T12:00:00Z"
            }
        }
```

### Task List Response

```python
class TaskListResponse(BaseModel):
    """Response schema for task list"""
    tasks: list[TaskResponse]
    total: int

    class Config:
        schema_extra = {
            "example": {
                "tasks": [
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "user_id": "user_123",
                        "title": "Buy groceries",
                        "description": "Milk, eggs, bread",
                        "completed": False,
                        "created_at": "2025-12-06T12:00:00Z",
                        "updated_at": "2025-12-06T12:00:00Z"
                    }
                ],
                "total": 1
            }
        }
```

---

## Frontend TypeScript Types

### Task Type

```typescript
export interface Task {
  id: string  // UUID as string
  user_id: string
  title: string
  description: string | null
  completed: boolean
  created_at: string  // ISO8601 datetime string
  updated_at: string  // ISO8601 datetime string
}

export interface CreateTaskData {
  title: string
  description?: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
}

export interface TaskListResponse {
  tasks: Task[]
  total: number
}
```

---

## Data Validation Rules

### Title Validation
- **Required**: Yes
- **Min Length**: 1 character (after trimming whitespace)
- **Max Length**: 200 characters
- **Allowed Characters**: Any UTF-8 characters
- **Normalization**: Trim leading/trailing whitespace

### Description Validation
- **Required**: No (optional)
- **Min Length**: None (can be empty)
- **Max Length**: 1000 characters
- **Allowed Characters**: Any UTF-8 characters
- **Normalization**: Trim leading/trailing whitespace; convert empty string to null

### User ID Validation
- **Required**: Yes
- **Source**: Extracted from validated JWT token
- **Never Trusted from Client**: Always from JWT payload
- **Format**: String (UUID or other identifier from Better Auth)

### Completed Status
- **Required**: Yes
- **Type**: Boolean
- **Default**: false
- **Allowed Values**: true or false only

### Timestamps
- **Format**: ISO8601 with timezone (UTC)
- **Timezone**: Always UTC
- **Auto-Generated**: Yes (created_at, updated_at)
- **Immutable**: created_at never changes after creation
- **Auto-Updated**: updated_at changes on every modification

---

## Database Migrations

### Initial Migration (create tasks table)

```sql
-- Migration: 001_create_tasks_table.sql
-- Description: Create tasks table with indexes

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for query performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at DESC);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE tasks IS 'User tasks for todo application';
COMMENT ON COLUMN tasks.id IS 'Unique task identifier (UUID)';
COMMENT ON COLUMN tasks.user_id IS 'Foreign key to Better Auth users';
COMMENT ON COLUMN tasks.title IS 'Task title (required, 1-200 chars)';
COMMENT ON COLUMN tasks.description IS 'Task description (optional, max 1000 chars)';
COMMENT ON COLUMN tasks.completed IS 'Task completion status';
COMMENT ON COLUMN tasks.created_at IS 'Task creation timestamp (UTC)';
COMMENT ON COLUMN tasks.updated_at IS 'Last update timestamp (UTC)';
```

---

## Entity Relationships

```text
┌─────────────────┐
│     users       │ (Better Auth managed)
│─────────────────│
│ id (PK)         │
│ email           │
│ password_hash   │
└─────────────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────┐
│     tasks       │
│─────────────────│
│ id (PK)         │
│ user_id (FK)    │─────┐ References users.id
│ title           │     │ (not enforced via FK)
│ description     │     │
│ completed       │     │
│ created_at      │     │
│ updated_at      │     │
└─────────────────┘     │
                        │
         Queries ALWAYS filter by user_id
                for data isolation
```

**Relationship Notes**:
- One user has many tasks (1:N)
- Foreign key relationship not enforced in database (Better Auth manages users separately)
- Application enforces relationship via JWT user_id validation
- Orphaned tasks possible if user deleted from Better Auth (acceptable for Phase 2)

---

## Data Integrity Constraints

1. **User Isolation**: All queries MUST filter by `user_id` from validated JWT
2. **No Nulls**: `id`, `user_id`, `title`, `completed`, `created_at`, `updated_at` cannot be null
3. **Length Limits**: `title` (200), `description` (1000), `user_id` (255)
4. **Timestamp Consistency**: `updated_at` >= `created_at` always
5. **Boolean Values**: `completed` must be exactly true or false
6. **UUID Format**: `id` must be valid UUID format

---

## Query Patterns

### List Tasks (with filtering)

```sql
-- All tasks for user
SELECT * FROM tasks
WHERE user_id = $1
ORDER BY created_at DESC;

-- Completed tasks only
SELECT * FROM tasks
WHERE user_id = $1 AND completed = true
ORDER BY created_at DESC;

-- Pending tasks only
SELECT * FROM tasks
WHERE user_id = $1 AND completed = false
ORDER BY created_at DESC;
```

### Get Single Task

```sql
SELECT * FROM tasks
WHERE id = $1 AND user_id = $2;
-- Both conditions required for authorization
```

### Create Task

```sql
INSERT INTO tasks (user_id, title, description)
VALUES ($1, $2, $3)
RETURNING *;
-- id, completed, created_at, updated_at auto-generated
```

### Update Task

```sql
UPDATE tasks
SET title = $1, description = $2, updated_at = NOW()
WHERE id = $3 AND user_id = $4
RETURNING *;
-- updated_at automatically updated via trigger
```

### Toggle Completion

```sql
UPDATE tasks
SET completed = NOT completed, updated_at = NOW()
WHERE id = $1 AND user_id = $2
RETURNING *;
```

### Delete Task

```sql
DELETE FROM tasks
WHERE id = $1 AND user_id = $2;
```

---

## Performance Considerations

1. **Indexes**: Composite indexes on `(user_id, created_at DESC)` and `(user_id, completed)` for efficient sorting/filtering
2. **Connection Pooling**: Use connection pool (pool_size=5, max_overflow=10) to handle concurrent requests
3. **Query Optimization**: All queries filter by indexed `user_id` first
4. **Timestamp Triggers**: Database trigger handles `updated_at` automatically (no application logic needed)
5. **UUID Generation**: Use PostgreSQL's `gen_random_uuid()` for better performance than application-generated UUIDs

---

## Security Considerations

1. **User Isolation**: ALWAYS include `user_id` in WHERE clause
2. **JWT Validation**: Extract `user_id` from validated JWT only, never trust client
3. **SQL Injection**: Use parameterized queries (SQLModel handles this automatically)
4. **No Cascade Deletes**: Tasks persist even if user deleted (acceptable for Phase 2)
5. **Input Validation**: Validate all inputs at Pydantic layer before database operations

---

## Next Steps

1. Generate API contracts (OpenAPI spec) in `contracts/` directory
2. Implement database connection and session management
3. Implement SQLModel models and Pydantic schemas
4. Create database migration scripts
5. Write unit tests for data validation logic

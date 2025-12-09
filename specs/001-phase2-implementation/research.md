# Research & Technical Decisions: Phase 2 Implementation

**Date**: 2025-12-06
**Feature**: Phase 2 Full-Stack Todo Application
**Purpose**: Document key technical decisions, best practices, and implementation patterns

## Research Areas

### 1. Better Auth + JWT Implementation

**Decision**: Use Better Auth library on frontend with JWT plugin for authentication

**Rationale**:
- Better Auth is modern, TypeScript-first auth library for Next.js
- Native JWT support with customizable payload
- Integrates seamlessly with Next.js App Router
- Handles token refresh and session management
- Open-source and actively maintained

**Implementation Pattern**:
```typescript
// Frontend: lib/auth.ts
import { betterAuth } from "better-auth"

export const auth = betterAuth({
  plugins: [jwt()],
  secret: process.env.BETTER_AUTH_SECRET,
  jwt: {
    expiresIn: "7d",
    payload: (user) => ({
      user_id: user.id,
      email: user.email
    })
  }
})
```

**Backend JWT Validation**:
```python
# Backend: middleware.py
from jose import jwt, JWTError
import os

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            os.getenv("BETTER_AUTH_SECRET"),
            algorithms=["HS256"]
        )
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

**Alternatives Considered**:
- NextAuth.js: More complex, heavier, session-first approach
- Custom JWT implementation: More work, security risks
- Auth0/Clerk: Third-party dependency, cost concerns

---

### 2. FastAPI + SQLModel Architecture

**Decision**: Use FastAPI with SQLModel for backend API and database ORM

**Rationale**:
- SQLModel combines SQLAlchemy + Pydantic for type-safe database models
- FastAPI provides automatic OpenAPI documentation
- Async support for better performance
- Type hints throughout reduce bugs
- Excellent developer experience

**Implementation Pattern**:
```python
# Backend: models.py
from sqlmodel import Field, SQLModel
from datetime import datetime
from uuid import UUID, uuid4

class Task(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str = Field(index=True)  # Indexed for query performance
    title: str = Field(max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Best Practices**:
- Use dependency injection for database sessions
- Separate Pydantic schemas for request/response (no SQLModel exposure)
- Index user_id for efficient filtering
- Use UTC timestamps everywhere
- Validate data at Pydantic layer before database

**Alternatives Considered**:
- Django REST Framework: Too heavy, monolithic
- Flask + SQLAlchemy: Less modern, missing async support
- Raw SQL: Too low-level, error-prone

---

### 3. Neon PostgreSQL Connection Handling

**Decision**: Use Neon Serverless PostgreSQL with connection pooling

**Rationale**:
- Serverless architecture (no server management)
- Automatic scaling and connection pooling
- PostgreSQL compatibility (full SQL features)
- Built-in branching for development/staging

**Implementation Pattern**:
```python
# Backend: db.py
from sqlmodel import create_engine, Session
import os

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=3600    # Recycle connections every hour
)

def get_session():
    with Session(engine) as session:
        yield session
```

**Best Practices**:
- Use connection pooling to reduce latency
- Enable pool_pre_ping to handle stale connections
- Use environment variables for connection strings
- Never commit connection strings to version control
- Use migrations (Alembic) for schema changes

**Alternatives Considered**:
- Supabase: More opinionated, includes auth (conflicts with Better Auth)
- PlanetScale: MySQL (preferred PostgreSQL for features)
- RDS PostgreSQL: Requires more management, higher cost

---

### 4. Next.js App Router Patterns

**Decision**: Use Next.js 16 App Router with Server Components and route groups

**Rationale**:
- App Router is the modern Next.js standard (Pages Router deprecated)
- Server Components reduce JavaScript bundle size
- Route groups organize auth/dashboard sections cleanly
- Built-in support for layouts and loading states

**Implementation Pattern**:
```typescript
// Frontend structure:
app/
├── layout.tsx           // Root layout (navbar, providers)
├── page.tsx             // Landing page
├── (auth)/
│   ├── layout.tsx       // Auth layout (centered form)
│   ├── signin/page.tsx
│   └── signup/page.tsx
└── (dashboard)/
    ├── layout.tsx       // Dashboard layout (sidebar, header)
    └── tasks/page.tsx   // Task management (Server Component)

// Server Component pattern:
export default async function TasksPage() {
  // Fetch data on server
  const tasks = await fetchTasks()
  return <TaskList initialTasks={tasks} />
}
```

**Best Practices**:
- Use Server Components by default, Client Components only when needed
- Fetch data in Server Components to reduce client JavaScript
- Use route groups for layout organization
- Implement loading.tsx and error.tsx for better UX
- Use TypeScript for type safety across components

**Alternatives Considered**:
- Pages Router: Deprecated, less modern
- Remix: Different framework, more learning curve
- Create React App: Missing Next.js optimizations (SSR, routing)

---

### 5. User Isolation in Database Queries

**Decision**: Enforce user_id filtering at database query level, never in application logic alone

**Rationale**:
- Defense in depth: multiple layers of security
- Prevents bugs where filter is forgotten
- Database indexes make user_id filtering fast
- Explicit is better than implicit

**Implementation Pattern**:
```python
# Backend: routes/tasks.py
from fastapi import Depends, HTTPException
from middleware import get_current_user

@app.get("/api/{user_id}/tasks")
async def list_tasks(
    user_id: str,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    # Verify JWT user_id matches URL user_id
    if current_user["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Query ALWAYS filters by user_id
    tasks = session.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()
    return tasks
```

**Security Layers**:
1. JWT validation in middleware (401 if invalid)
2. user_id match verification (403 if mismatch)
3. Database query filtering (defense in depth)
4. Database index on user_id (performance)

**Best Practices**:
- Always validate JWT user_id matches URL user_id
- Never trust client-provided user_id without verification
- Use database indexes for performance
- Log authorization failures for security monitoring

**Alternatives Considered**:
- Row-level security (RLS) in PostgreSQL: Good but adds complexity
- Application-level only: Too risky, single point of failure
- GraphQL with field-level auth: Overkill for this project

---

### 6. Frontend API Client Pattern

**Decision**: Create typed API client with automatic JWT attachment

**Rationale**:
- Centralized API logic reduces duplication
- TypeScript types ensure type safety
- Automatic JWT attachment prevents forgetting tokens
- Error handling in one place

**Implementation Pattern**:
```typescript
// Frontend: lib/api.ts
import { auth } from './auth'

class ApiClient {
  private baseURL = process.env.NEXT_PUBLIC_API_URL

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const session = await auth.getSession()
    const token = session?.accessToken

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return response.json()
  }

  async listTasks(userId: string): Promise<Task[]> {
    return this.request<Task[]>(`/api/${userId}/tasks`)
  }

  async createTask(userId: string, data: CreateTaskData): Promise<Task> {
    return this.request<Task>(`/api/${userId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ... other methods
}

export const api = new ApiClient()
```

**Best Practices**:
- Type all request/response shapes
- Handle errors consistently
- Automatically attach JWT to all requests
- Use environment variables for base URL
- Export singleton instance

---

### 7. Error Handling Strategy

**Decision**: Use HTTP status codes with consistent error response format

**Rationale**:
- Standard HTTP semantics (200, 201, 400, 401, 403, 404, 500)
- Consistent error format makes frontend handling easier
- Clear distinction between client errors (4xx) and server errors (5xx)

**Implementation Pattern**:
```python
# Backend: Standard error response
{
  "detail": "Human-readable error message",
  "error_code": "TASK_NOT_FOUND",  # Optional machine-readable code
  "timestamp": "2025-12-06T12:00:00Z"
}

# FastAPI automatically returns this format for HTTPException
```

```typescript
// Frontend: Error handling
try {
  const task = await api.createTask(userId, data)
} catch (error) {
  if (error.status === 401) {
    // Redirect to login
    router.push('/signin')
  } else if (error.status === 400) {
    // Show validation errors to user
    setErrors(error.detail)
  } else {
    // Generic error message
    toast.error('Something went wrong. Please try again.')
  }
}
```

**Status Codes**:
- 200: Success (GET, PUT, PATCH, DELETE)
- 201: Created (POST)
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing JWT)
- 403: Forbidden (valid JWT but not authorized for resource)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

---

### 8. Testing Strategy

**Decision**: Three-tier testing approach (unit, integration, contract)

**Implementation Plan**:
1. **Unit Tests**: Test individual functions/components in isolation
   - Backend: Test models, validators, utilities
   - Frontend: Test components with React Testing Library

2. **Integration Tests**: Test API endpoints end-to-end
   - Backend: Test full request/response cycle with test database
   - Use pytest fixtures for database setup/teardown

3. **Contract Tests**: Verify frontend/backend API contract
   - Test request/response shapes match OpenAPI spec
   - Catch breaking changes early

**Best Practices**:
- Use test database for integration tests (never production)
- Mock external services (e.g., don't call real Neon DB in unit tests)
- Test authentication/authorization thoroughly
- Test edge cases (empty lists, missing fields, invalid tokens)

---

## Summary of Key Decisions

| Area | Decision | Primary Rationale |
|------|----------|-------------------|
| Frontend Auth | Better Auth + JWT | Modern, TypeScript-first, Next.js native |
| Backend Framework | FastAPI + SQLModel | Type-safe, async, excellent DX |
| Database | Neon Serverless PostgreSQL | Serverless, auto-scaling, PostgreSQL features |
| Frontend Framework | Next.js 16 App Router | Modern standard, Server Components |
| User Isolation | Database-level filtering | Security through defense in depth |
| API Client | Typed singleton with auto JWT | Type safety, DRY, automatic auth |
| Error Handling | HTTP status codes + standard format | Clear semantics, consistent handling |
| Testing | Three-tier (unit/integration/contract) | Comprehensive coverage, catch bugs early |

---

## Next Steps

Phase 0 research complete. Proceed to Phase 1:
1. Generate data-model.md (database schema details)
2. Generate API contracts (OpenAPI spec)
3. Generate quickstart.md (setup instructions)
4. Update agent context with new technologies

# Implementation Plan: Phase 2 Full-Stack Todo Application

**Branch**: `001-phase2-implementation` | **Date**: 2025-12-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-phase2-implementation/spec.md`

## Summary

Implement a complete full-stack, multi-user todo application with secure authentication, persistent storage, and modern web interface. The system will transform Phase I CLI prototype into a production-ready web application with Next.js frontend, FastAPI backend, and Neon PostgreSQL database.

Technical approach: Build using monorepo structure with separate frontend/backend. Frontend handles UI and authentication (Better Auth), backend handles API + database operations with JWT validation. All requirements from existing Phase 2 specs (`/specs/overview.md`, `/specs/architecture.md`, `/specs/features/`, `/specs/api/`, `/specs/database/`, `/specs/ui/`) will be implemented.

## Technical Context

**Language/Version**:
- Frontend: TypeScript with Next.js 16+
- Backend: Python 3.13+ with FastAPI

**Primary Dependencies**:
- Frontend: Next.js 16+, React 19+, TailwindCSS, Better Auth (JWT plugin)
- Backend: FastAPI, SQLModel, Neon PostgreSQL driver, python-jose (JWT), pydantic, uvicorn
- Development: UV (Python package manager)

**Storage**: Neon Serverless PostgreSQL (cloud-hosted)

**Testing**:
- Frontend: Jest + React Testing Library
- Backend: pytest + pytest-asyncio
- Integration: End-to-end API contract tests

**Target Platform**: Web application (desktop + mobile browsers)

**Project Type**: Web application (frontend + backend)

**Performance Goals**:
- API response time: < 500ms p95 for standard CRUD operations
- Frontend initial load: < 2 seconds on 3G connection
- Database queries: < 100ms for single task operations
- Support 100 concurrent users (Phase II target)

**Constraints**:
- Stateless backend (no session storage)
- JWT-based authentication only
- All timestamps in UTC ISO8601
- User data isolation enforced at database query level
- Monorepo structure required
- Spec-driven development workflow (no implementation without spec)

**Scale/Scope**:
- Initial target: 100-1000 users
- Database: ~10K tasks total across all users
- Frontend: ~10 pages/components
- Backend: 6 REST API endpoints
- Must be extensible for Phase III (MCP), Phase IV (Docker/K8s), Phase V (Kafka/Dapr)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **Spec-Driven Development**: Feature spec created at `/specs/001-phase2-implementation/spec.md` with all requirements from existing Phase 2 specs consolidated.

✅ **Single Source of Truth**: All specifications in `/specs/` are authoritative; code will conform to specs.

✅ **Separation of Concerns**:
- `/frontend` - UI and client logic only
- `/backend` - APIs, database models, business logic
- `/specs` - All specifications independent

✅ **Stateless Backend**: No session storage; JWT-based authentication only.

✅ **Security First**:
- All API endpoints require valid JWT
- Backend verifies token signatures using shared secret
- User_id enforcement at database query level
- Users can only access their own tasks

✅ **Technology Rules**:
- **Frontend**: Next.js 16+ App Router ✓, TailwindCSS ✓, Better Auth ✓, Typed API client ✓
- **Backend**: FastAPI ✓, SQLModel ✓, UV for package management ✓, Neon PostgreSQL ✓
- **Structure**: main.py, models.py, routes/, db.py ✓

✅ **Authentication Requirements**:
- Better Auth issues JWT with user_id in payload ✓
- Shared secret `BETTER_AUTH_SECRET` ✓
- Backend validates signature, expiration, user_id ✓

✅ **API Requirements**:
- Base URL `/api/{user_id}/tasks` ✓
- All endpoints use JSON ✓
- REST conventions ✓
- Authorization enforcement ✓

✅ **Future Phases Alignment**:
- Modular backend ready for Phase III MCP integration ✓
- Clean API layer for Phase IV containerization ✓
- Extensible database schema for Phase V event sourcing ✓

**Constitution Gate**: ✅ **PASSED** - All constitutional requirements met

## Project Structure

### Documentation (this feature)

```text
specs/001-phase2-implementation/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technical decisions)
├── data-model.md        # Phase 1 output (database schema + models)
├── quickstart.md        # Phase 1 output (setup instructions)
├── contracts/           # Phase 1 output (API contracts)
│   ├── openapi.yaml     # OpenAPI 3.0 spec for REST endpoints
│   └── jwt-schema.json  # JWT token structure
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── main.py              # FastAPI app initialization, router mounting
├── models.py            # SQLModel Task model
├── db.py                # Database engine, session management
├── middleware.py        # JWT authentication middleware
├── routes/
│   └── tasks.py         # Task CRUD endpoints
├── schemas.py           # Pydantic request/response models
├── config.py            # Configuration (env vars, secrets)
├── tests/
│   ├── conftest.py      # Pytest fixtures
│   ├── test_auth.py     # JWT validation tests
│   ├── test_tasks.py    # Task CRUD tests
│   └── test_integration.py  # End-to-end API tests
├── pyproject.toml       # UV project configuration
└── README.md            # Backend setup instructions

frontend/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home/landing page
│   ├── (auth)/
│   │   ├── signin/page.tsx
│   │   └── signup/page.tsx
│   └── (dashboard)/
│       └── tasks/page.tsx   # Main task management page
├── components/
│   ├── TaskList.tsx     # Task list component
│   ├── TaskItem.tsx     # Individual task component
│   ├── TaskForm.tsx     # Create/edit task form
│   └── Navbar.tsx       # Navigation bar
├── lib/
│   ├── api.ts           # Typed API client
│   ├── auth.ts          # Better Auth configuration
│   └── types.ts         # TypeScript types
├── public/              # Static assets
├── tests/
│   ├── components/      # Component tests
│   └── integration/     # E2E tests
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md            # Frontend setup instructions

specs/                   # Existing Phase 2 specifications
├── overview.md
├── architecture.md
├── features/
│   ├── task-crud.md
│   └── authentication.md
├── api/
│   └── rest-endpoints.md
├── database/
│   └── schema.md
└── ui/
    ├── pages.md
    └── components.md
```

**Structure Decision**: Using **Option 2 - Web application** structure with separate `backend/` and `frontend/` directories. This aligns with the constitution's requirement for separation of concerns and supports the multi-tier architecture (Next.js → FastAPI → Neon DB).

The backend follows FastAPI best practices with clear separation of models, routes, and configuration. The frontend uses Next.js 16 App Router with route groups for auth and dashboard sections.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitutional requirements are met. No complexity tracking needed.

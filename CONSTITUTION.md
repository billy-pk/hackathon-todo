# Constitution: hackathon-todo

## Purpose
This constitution governs the architecture, development workflow, and conventions of the **hackathon-todo** project for Phase II of the Hackathon.  
The goal of this phase is to evolve the application from a CLI prototype into a modern **full-stack, authenticated, multi-user Todo web application** built using Spec-Driven Development with GitHub Spec-Kit Plus and Claude Code.

This document defines:
- the technical architecture
- development constraints
- source code organization
- specification workflow
- quality standards
- API + database + UI expectations  
and forms the foundation for all specifications and implementation work in Phase II.

---

## Scope of Phase II
Phase II delivers a complete Full-Stack Todo application with:

### Core Features (Basic Level)
- Add Task  
- Update Task  
- Delete Task  
- View Task List  
- Mark Task Complete / Incomplete  

### Additional Phase-II Requirements
- Fully functional web frontend (Next.js 16+)  
- REST API backend (FastAPI + SQLModel)  
- Persistent PostgreSQL (Neon Serverless)  
- Multi-user support  
- Secure authentication using **Better Auth (JWT mode)**  
- Authorization on backend (user-specific tasks)  
- Complete Spec-Kit integration  
- Spec-Driven implementation using Claude Code 
- Use UV for python virtual environment and dependencies management 

Intermediate and Advanced features will be implemented in later phases.

---

## Development Philosophy
1. **Spec-Driven Development**  
   - No feature is implemented without a written specification.  
   - Specs define WHAT to build; Claude Code generates HOW to build it.  
   - Specs must be clear, testable, and unambiguous.

2. **AI-Generated Implementation**  
   - All production code must be generated or refactored by Claude Code.  
   - Manual code writing is discouraged except for debugging or scaffolding.

3. **Single Source of Truth**  
   - Specifications located in `/specs/` define the authoritative behavior.  
   - Code must always conform to specs; specs must be updated before code changes.

4. **Separation of Concerns**  
   - `/frontend` contains UI and client logic only.  
   - `/backend` contains APIs, database models, and business logic.  
   - Specs remain independent in `/specs`.

5. **Stateless Backend Requests**  
   - Backend must not store session state.  
   - Authentication relies on JWT tokens issued by Better Auth.

6. **Security First**  
   - All API endpoints require a valid JWT.  
   - Backend must verify token signatures using a shared secret.  
   - Users can only access their own tasks.

---

## Technology Rules

### Frontend (Next.js 16+)
- Use App Router and React Server Components by default.  
- TailwindCSS for styling.  
- API calls routed through a typed API client in `/frontend/lib/api.ts`.  
- Better Auth handles:
  - signup
  - signin
  - session management
  - JWT issuing  

### Backend (FastAPI)
- Organized into:
  - `main.py` → API router mounting  
  - `models.py` → SQLModel classes  
  - `routes/` → REST endpoints  
  - `db.py` → database engine + session  
- Validates JWT for every request.  
- Filters all DB operations by authenticated `user_id`.

### Database (Neon PostgreSQL)
- Task Model:  
  - id (UUID)  
  - user_id (string FK)  
  - title  
  - description  
  - completed  
  - created_at  
  - updated_at  
- All timestamps ISO8601 (UTC).  
- SQLModel used for ORM.

---

## Folder Structure Requirements

The project MUST follow this monorepo layout:

# Constitution: hackathon-todo

## Purpose
This constitution governs the architecture, development workflow, and conventions of the **hackathon-todo** project for Phase II of the Hackathon.  
The goal of this phase is to evolve the application from a CLI prototype into a modern **full-stack, authenticated, multi-user Todo web application** built using Spec-Driven Development with GitHub Spec-Kit Plus and Claude Code.

This document defines:
- the technical architecture
- development constraints
- source code organization
- specification workflow
- quality standards
- API + database + UI expectations  
and forms the foundation for all specifications and implementation work in Phase II.

---

## Scope of Phase II
Phase II delivers a complete Full-Stack Todo application with:

### Core Features (Basic Level)
- Add Task  
- Update Task  
- Delete Task  
- View Task List  
- Mark Task Complete / Incomplete  

### Additional Phase-II Requirements
- Fully functional web frontend (Next.js 16+)  
- REST API backend (FastAPI + SQLModel)  
- Persistent PostgreSQL (Neon Serverless)  
- Multi-user support  
- Secure authentication using **Better Auth (JWT mode)**  
- Authorization on backend (user-specific tasks)  
- Complete Spec-Kit integration  
- Spec-Driven implementation using Claude Code  

Intermediate and Advanced features will be implemented in later phases.

---

## Development Philosophy
1. **Spec-Driven Development**  
   - No feature is implemented without a written specification.  
   - Specs define WHAT to build; Claude Code generates HOW to build it.  
   - Specs must be clear, testable, and unambiguous.

2. **AI-Generated Implementation**  
   - All production code must be generated or refactored by Claude Code.  
   - Manual code writing is discouraged except for debugging or scaffolding.

3. **Single Source of Truth**  
   - Specifications located in `/specs/` define the authoritative behavior.  
   - Code must always conform to specs; specs must be updated before code changes.

4. **Separation of Concerns**  
   - `/frontend` contains UI and client logic only.  
   - `/backend` contains APIs, database models, and business logic.  
   - Specs remain independent in `/specs`.

5. **Stateless Backend Requests**  
   - Backend must not store session state.  
   - Authentication relies on JWT tokens issued by Better Auth.

6. **Security First**  
   - All API endpoints require a valid JWT.  
   - Backend must verify token signatures using a shared secret.  
   - Users can only access their own tasks.

---

## Technology Rules

### Frontend (Next.js 16+)
- Use App Router and React Server Components by default.  
- TailwindCSS for styling.  
- API calls routed through a typed API client in `/frontend/lib/api.ts`.  
- Better Auth handles:
  - signup
  - signin
  - session management
  - JWT issuing  

### Backend (FastAPI)
- Organized into:
  - `main.py` → API router mounting  
  - `models.py` → SQLModel classes  
  - `routes/` → REST endpoints  
  - `db.py` → database engine + session  
- Validates JWT for every request.  
- Filters all DB operations by authenticated `user_id`.

### Database (Neon PostgreSQL)
- Task Model:  
  - id (UUID)  
  - user_id (string FK)  
  - title  
  - description  
  - completed  
  - created_at  
  - updated_at  
- All timestamps ISO8601 (UTC).  
- SQLModel used for ORM.

---

## Folder Structure Requirements

The project MUST follow this monorepo layout:

# Constitution: hackathon-todo

## Purpose
This constitution governs the architecture, development workflow, and conventions of the **hackathon-todo** project for Phase II of the Hackathon.  
The goal of this phase is to evolve the application from a CLI prototype into a modern **full-stack, authenticated, multi-user Todo web application** built using Spec-Driven Development with GitHub Spec-Kit Plus and Claude Code.

This document defines:
- the technical architecture
- development constraints
- source code organization
- specification workflow
- quality standards
- API + database + UI expectations  
and forms the foundation for all specifications and implementation work in Phase II.

---

## Scope of Phase II
Phase II delivers a complete Full-Stack Todo application with:

### Core Features (Basic Level)
- Add Task  
- Update Task  
- Delete Task  
- View Task List  
- Mark Task Complete / Incomplete  

### Additional Phase-II Requirements
- Fully functional web frontend (Next.js 16+)  
- REST API backend (FastAPI + SQLModel)  
- Persistent PostgreSQL (Neon Serverless)  
- Multi-user support  
- Secure authentication using **Better Auth (JWT mode)**  
- Authorization on backend (user-specific tasks)  
- Complete Spec-Kit integration  
- Spec-Driven implementation using Claude Code  

Intermediate and Advanced features will be implemented in later phases.

---

## Development Philosophy
1. **Spec-Driven Development**  
   - No feature is implemented without a written specification.  
   - Specs define WHAT to build; Claude Code generates HOW to build it.  
   - Specs must be clear, testable, and unambiguous.

2. **AI-Generated Implementation**  
   - All production code must be generated or refactored by Claude Code.  
   - Manual code writing is discouraged except for debugging or scaffolding.

3. **Single Source of Truth**  
   - Specifications located in `/specs/` define the authoritative behavior.  
   - Code must always conform to specs; specs must be updated before code changes.

4. **Separation of Concerns**  
   - `/frontend` contains UI and client logic only.  
   - `/backend` contains APIs, database models, and business logic.  
   - Specs remain independent in `/specs`.

5. **Stateless Backend Requests**  
   - Backend must not store session state.  
   - Authentication relies on JWT tokens issued by Better Auth.

6. **Security First**  
   - All API endpoints require a valid JWT.  
   - Backend must verify token signatures using a shared secret.  
   - Users can only access their own tasks.

---

## Technology Rules

### Frontend (Next.js 16+)
- Use App Router and React Server Components by default.  
- TailwindCSS for styling.  
- API calls routed through a typed API client in `/frontend/lib/api.ts`.  
- Better Auth handles:
  - signup
  - signin
  - session management
  - JWT issuing  

### Backend (FastAPI)
- Organized into:
  - `main.py` → API router mounting  
  - `models.py` → SQLModel classes  
  - `routes/` → REST endpoints  
  - `db.py` → database engine + session  
- Validates JWT for every request.  
- Filters all DB operations by authenticated `user_id`.

### Database (Neon PostgreSQL)
- Task Model:  
  - id (UUID)  
  - user_id (string FK)  
  - title  
  - description  
  - completed  
  - created_at  
  - updated_at  
- All timestamps ISO8601 (UTC).  
- SQLModel used for ORM.

---

## Folder Structure Requirements

The project MUST follow this monorepo layout:

hackathon-todo/
├── .spec-kit/
│ └── config.yaml
├── specs/
│ ├── overview.md
│ ├── architecture.md
│ ├── features/
│ ├── api/
│ ├── database/
│ └── ui/
├── CLAUDE.md
├── frontend/
│ ├── CLAUDE.md
│ └── (Next.js app files)
├── backend/
│ ├── CLAUDE.md
│ └── (FastAPI app files)
└── README.md


**All code generation and refactoring relies on this structure.**

---

## Specification Workflow

### 1. Every change begins with writing or updating a spec:
Examples:
- `/specs/features/task-crud.md`  
- `/specs/api/rest-endpoints.md`  
- `/specs/database/schema.md`  
- `/specs/ui/pages.md`

### 2. Specs must include:
- User stories  
- Acceptance criteria  
- Data rules  
- API contracts  
- UI behaviors (if applicable)

### 3. Implementation is requested via Claude Code:
Example command:
> "Implement @specs/api/rest-endpoints.md in backend/ according to backend/CLAUDE.md."

### 4. Code is reviewed and tested  
If incorrect → update the **spec**, not the code.

---

## Coding Standards

### Backend
- Use Pydantic models for requests and responses.  
- Use SQLModel ORM for database operations.  
- Use type hints everywhere.  
- Handle errors using `HTTPException`.  
- All route paths must be under `/api`.

### Frontend
- Use TypeScript.  
- Reusable UI components in `/components`.  
- API client must attach JWT automatically.  
- Pages follow App Router conventions.

### Documentation
- README must explain setup and running instructions.  
- Each spec file must be concise and structured.

---

## Authentication Requirements

### Better Auth (Frontend)
- Must issue JWT tokens.  
- Must include user_id in JWT payload.  
- Must expose token to frontend API client.

### Backend JWT Validation
- Shared secret `BETTER_AUTH_SECRET` required.  
- Must decode and verify:  
  - signature  
  - expiration  
  - user_id  

### Authorization
- Backend MUST reject:
  - requests without JWT  
  - mismatched user_id in URL vs. JWT  
  - attempts to modify someone else’s tasks

---

## API Requirements

### Base URL

/api/{user_id}/tasks


### Endpoints
- GET → list tasks  
- POST → create task  
- GET (single) → get task  
- PUT → update  
- PATCH → toggle completed  
- DELETE → delete  

All endpoints must:
- use JSON  
- follow REST conventions  
- return consistent structured responses  
- enforce user authorization  

---

## Future Phases Alignment
Phase II must be designed so that Phase III–V can be added without breaking architecture:

| Phase | Requirement to Support |
|-------|-------------------------|
| Phase III | Agents SDK + MCP tools |
| Phase IV | Docker + Kubernetes + Helm |
| Phase V | Kafka + Dapr + Cloud deployment |

Therefore:
- Backend must be modular.  
- API layer must be cleanly separated.  
- Database schema must be extensible.  
- Specs must anticipate future additions.

---

## Final Clause
All contributors, including AI coding agents, must adhere to this constitution.  
If any conflict arises between code and spec or between spec and constitution, **the constitution overrides everything**.




# hackathon-todo – Root Instructions for Claude Code

## Project Overview
This is a monorepo for a spec-driven, full-stack Todo web app:

- Frontend: Next.js (App Router, TypeScript, Tailwind)
- Backend: FastAPI + SQLModel
- Database: Neon PostgreSQL
- Auth: Better Auth (JWT)
- Specs: in /specs, managed by Spec-Kit Plus

## Directory Structure
- /specs        – All feature, API, DB, and UI specifications
- /frontend     – Next.js app
- /backend      – FastAPI app
- /.spec-kit    – Spec-Kit structure config
- /.specify     – Spec-Kit Plus internal files (created by `sp init`)

## How to Work on This Project
1. Always read the relevant spec in `/specs` first.
2. Update the spec if requirements change.
3. Use Spec-Kit Plus commands (`sp.specify`, `sp.plan`, `sp.tasks`, `sp.implement`) to drive work.
4. Use the subfolder CLAUDE.md files for backend/frontend-specific implementation details.

## Spec References
- Project overview: @specs/overview.md
- Architecture: @specs/architecture.md
- Task CRUD: @specs/features/task-crud.md
- Auth: @specs/features/authentication.md
- API endpoints: @specs/api/rest-endpoints.md
- DB schema: @specs/database/schema.md
- UI pages/components: @specs/ui/pages.md, @specs/ui/components.md

## Active Technologies
- Neon Serverless PostgreSQL (cloud-hosted) (001-phase2-implementation)

## Recent Changes
- 001-phase2-implementation: Added Neon Serverless PostgreSQL (cloud-hosted)
- use context7 mcp server to get up-to-date, version-specific documentation and code examples of libraries.
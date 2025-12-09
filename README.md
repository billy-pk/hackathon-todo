# hackathon-todo - Phase 2 Full-Stack Todo Application

A modern, secure, full-stack todo application built with Next.js, FastAPI, and PostgreSQL. This project implements a complete task management system with JWT-based authentication, responsive UI, and data isolation between users.

## 🚀 Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete tasks
- 🔐 **Secure Authentication** - JWT-based authentication with Better Auth
- 👥 **Multi-User Support** - Complete data isolation between users
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- ⚡ **Optimistic UI** - Instant feedback with automatic rollback on errors
- 🎯 **Task Management** - Mark tasks as complete/incomplete, filter by status
- 🏥 **Health Checks** - Database connection monitoring endpoint
- ♿ **Accessible** - ARIA labels and keyboard navigation support

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Architecture](#-architecture)

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Authentication**: Better Auth (JWT plugin)
- **UI Components**: Custom responsive components

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.13+
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: JWT validation with python-jose
- **Server**: Uvicorn

### Development Tools
- **Package Manager**:
  - Frontend: npm
  - Backend: UV (Python package manager)
- **Version Control**: Git

## 📁 Project Structure

```
hackathon-todo/
├── frontend/               # Next.js application
│   ├── app/               # App Router pages and layouts
│   │   ├── (auth)/        # Authentication pages (signin, signup)
│   │   ├── (dashboard)/   # Protected dashboard pages
│   │   └── page.tsx       # Landing page
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskList.tsx
│   ├── lib/              # Utilities and configurations
│   │   ├── api.ts        # API client with JWT
│   │   ├── auth.ts       # Server-side auth config
│   │   ├── auth-client.ts # Client-side auth hooks
│   │   └── types.ts      # TypeScript interfaces
│   └── package.json
│
├── backend/              # FastAPI application
│   ├── main.py          # App initialization and health checks
│   ├── config.py        # Environment configuration
│   ├── db.py            # Database engine and session
│   ├── models.py        # SQLModel task model
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── middleware.py    # JWT authentication middleware
│   ├── routes/          # API route handlers
│   │   └── tasks.py     # Task CRUD endpoints
│   ├── migrations/      # Database migrations
│   │   └── 001_create_tasks_table.sql
│   ├── scripts/         # Utility scripts
│   │   └── migrate.py   # Migration runner
│   └── pyproject.toml
│
└── specs/               # Feature specifications
    ├── overview.md
    ├── architecture.md
    └── 001-phase2-implementation/
        ├── spec.md
        ├── plan.md
        ├── tasks.md
        └── data-model.md
```

## 🏁 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.13+
- **UV** Python package manager ([installation guide](https://github.com/astral-sh/uv))
- **Neon PostgreSQL** account and database ([sign up](https://neon.tech))

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hackathon-todo
```

### 2. Set Up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Edit .env.local with your configuration:
# - NEXT_PUBLIC_API_URL=http://localhost:8000
# - BETTER_AUTH_SECRET=<your-secret-key>
# - DATABASE_URL=<your-neon-postgres-url>
# - BETTER_AUTH_URL=http://localhost:3000

# Start development server
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

### 3. Set Up Backend

```bash
cd backend

# Install dependencies using UV
uv pip install -e .

# Create environment file
cp .env.example .env

# Edit .env with your configuration:
# - DATABASE_URL=<your-neon-postgres-url>
# - BETTER_AUTH_SECRET=<same-secret-as-frontend>
# - API_HOST=0.0.0.0
# - API_PORT=8000

# Run database migrations
python scripts/migrate.py

# Start development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at [http://localhost:8000](http://localhost:8000)

API documentation (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)

## 🔐 Environment Variables

### Frontend (.env.local)

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth Configuration
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@host/database

# Next.js Configuration (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (.env)

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@host/database

# Authentication
BETTER_AUTH_SECRET=your-secret-key-min-32-chars

# Server Configuration
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development
```

**Important**: Use the same `BETTER_AUTH_SECRET` in both frontend and backend for JWT validation to work correctly.

## 💻 Development

### Frontend Development

```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Format code
npm run format
```

### Backend Development

```bash
cd backend

# Start dev server with auto-reload
uvicorn main:app --reload

# Run with custom host/port
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Run migrations
python scripts/migrate.py
```

### Database Migrations

Migrations are located in `backend/migrations/`. To create a new migration:

1. Create a new SQL file: `backend/migrations/00X_description.sql`
2. Write your migration SQL
3. Run: `python backend/scripts/migrate.py`

## 📚 API Documentation

### Authentication Flow

1. **Sign Up**: `POST /api/auth/signup` (handled by Better Auth)
2. **Sign In**: `POST /api/auth/signin` (handled by Better Auth)
3. **Get Session**: `GET /api/auth/session` (handled by Better Auth)

Better Auth automatically handles user registration, login, and JWT token generation.

### Task Endpoints

All task endpoints require JWT authentication via `Authorization: Bearer <token>` header.

#### List Tasks
```http
GET /api/{user_id}/tasks?status=all
```

Query parameters:
- `status`: `all` | `pending` | `completed` (default: `all`)

#### Create Task
```http
POST /api/{user_id}/tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

#### Get Single Task
```http
GET /api/{user_id}/tasks/{task_id}
```

#### Update Task
```http
PUT /api/{user_id}/tasks/{task_id}
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description"
}
```

#### Toggle Completion
```http
PATCH /api/{user_id}/tasks/{task_id}/complete
```

#### Delete Task
```http
DELETE /api/{user_id}/tasks/{task_id}
```

### Health Check
```http
GET /api/health
```

Returns database connection status and environment info.

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm test
```

### Backend Testing

Comprehensive testing procedures are documented in `backend/TESTING.md`.

#### Manual Testing

1. **Concurrent Operations** (T089):
   - Open multiple browser tabs
   - Perform simultaneous create/update/delete operations
   - Verify data consistency

2. **Data Isolation** (T090):
   - Create two user accounts
   - Verify User A cannot access User B's tasks
   - Test all CRUD operations across users

3. **Performance Testing**:
   - Measure API response times (target: < 500ms p95)
   - Test frontend load time (target: < 2 seconds)

See `backend/TESTING.md` for detailed test procedures.

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build
# Deploy to Vercel or your preferred hosting platform
```

Environment variables must be set in your deployment platform.

### Backend Deployment

The backend can be deployed to:
- **Heroku**: Add `Procfile` with `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Railway**: Configure start command in `railway.toml`
- **Docker**: Use provided Dockerfile (if available)
- **AWS/GCP**: Deploy as containerized application

Ensure `DATABASE_URL` points to your production Neon database.

## 🏗 Architecture

### Request Flow

```
User → Next.js → Better Auth → JWT → FastAPI → SQLModel → Neon DB
         ↑                        ↓          ↓
    Authorization Header   Verify Token   Filter by user_id
```

### Key Design Decisions

1. **Stateless Backend**: No session storage; all authentication via JWT
2. **JWT-Based Auth**: Shared secret between frontend and backend
3. **User Isolation**: All database queries filtered by `user_id` from JWT
4. **Optimistic UI**: Immediate feedback with automatic rollback on errors
5. **Responsive Design**: Mobile-first approach with Tailwind breakpoints
6. **Security**: CORS configuration, JWT validation, ownership verification

### Database Schema

**tasks table**:
- `id` (UUID, Primary Key)
- `user_id` (VARCHAR, indexed)
- `title` (VARCHAR, required)
- `description` (TEXT, optional)
- `completed` (BOOLEAN, default: false)
- `created_at` (TIMESTAMP WITH TIME ZONE)
- `updated_at` (TIMESTAMP WITH TIME ZONE)

**Indexes**:
- `idx_tasks_user_id` ON (user_id)
- `idx_tasks_user_created` ON (user_id, created_at DESC)
- `idx_tasks_user_completed` ON (user_id, completed)

## 📝 License

This project is part of Phase 2 of the Hackathon Todo project.

## 🤝 Contributing

This is a learning project for implementing spec-driven development with full-stack technologies.

## 📞 Support

For issues or questions:
1. Check the documentation in `/specs`
2. Review the implementation plan in `/specs/001-phase2-implementation/plan.md`
3. See testing procedures in `backend/TESTING.md`

---

**Built with**: Next.js • FastAPI • PostgreSQL • TailwindCSS • Better Auth • TypeScript • Python

Phase 2 Full-Stack Implementation - December 2025

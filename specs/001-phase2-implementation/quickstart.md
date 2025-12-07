# Quickstart Guide: Phase 2 Todo Application

**Last Updated**: 2025-12-06
**Version**: 1.0.0

This guide will help you set up and run the Phase 2 full-stack todo application locally.

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20+ (LTS recommended)
- **Python**: 3.11+
- **UV**: Python package manager ([installation guide](https://github.com/astral-sh/uv))
- **PostgreSQL**: Not required locally (using Neon cloud database)
- **Git**: For version control

Check versions:
```bash
node --version  # Should be v20+
python --version  # Should be 3.11+
uv --version  # Should show UV version
```

---

## Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hackathon-todo.git
cd hackathon-todo
```

### 2. Set Up Environment Variables

Create `.env` files for both frontend and backend:

**Backend `.env`** (in `backend/.env`):
```env
# Database
DATABASE_URL=postgresql://username:password@ep-example.neon.tech/hackathon_todo?sslmode=require

# Authentication
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production

# Environment
ENVIRONMENT=development

# API Config
API_HOST=0.0.0.0
API_PORT=8000
```

**Frontend `.env.local`** (in `frontend/.env.local`):
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000

# Authentication (same secret as backend)
BETTER_AUTH_SECRET=your-super-secret-key-change-this-in-production

# Environment
NEXT_PUBLIC_ENVIRONMENT=development
```

**Important**:
- Use the same `BETTER_AUTH_SECRET` in both frontend and backend
- Never commit `.env` files to version control
- Change secrets in production

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Create Virtual Environment with UV

```bash
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 3. Install Dependencies

```bash
uv pip install -r requirements.txt
```

**Or** if using `pyproject.toml`:
```bash
uv pip install -e .
```

### 4. Run Database Migrations

```bash
# Create tables in Neon database
python scripts/migrate.py
```

### 5. Start Backend Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000

**API Documentation** (auto-generated):
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Frontend Setup

### 1. Navigate to Frontend Directory (from project root)

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Frontend will be available at: http://localhost:3000

---

## Verifying the Setup

### 1. Check Backend Health

Open: http://localhost:8000/docs

You should see the FastAPI Swagger UI with all API endpoints listed.

### 2. Check Frontend

Open: http://localhost:3000

You should see the landing page.

### 3. Test Full Flow

1. **Register** a new account at http://localhost:3000/signup
2. **Sign in** with your credentials
3. **Create** a new task
4. **View** your task list
5. **Update** a task
6. **Mark** task as complete/incomplete
7. **Delete** a task

---

## Running Tests

### Backend Tests

```bash
cd backend
pytest
```

**Run with coverage**:
```bash
pytest --cov=. --cov-report=html
```

### Frontend Tests

```bash
cd frontend
npm test
# or
npm run test:watch  # Watch mode
```

---

## Database Setup (Neon PostgreSQL)

### Creating a Neon Database

1. Sign up at [https://neon.tech](https://neon.tech)
2. Create a new project named `hackathon-todo`
3. Copy the connection string
4. Add to `backend/.env` as `DATABASE_URL`

### Running Migrations

Migrations are located in `backend/migrations/`:
```
backend/migrations/
├── 001_create_tasks_table.sql
└── ...
```

**Apply migrations**:
```bash
python scripts/migrate.py
```

### Viewing Database

Use Neon dashboard or connect with any PostgreSQL client:
```bash
psql $DATABASE_URL
```

---

## Project Structure

```text
hackathon-todo/
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── models.py            # SQLModel models
│   ├── db.py                # Database connection
│   ├── middleware.py        # JWT authentication
│   ├── routes/              # API endpoints
│   ├── schemas.py           # Pydantic schemas
│   ├── tests/               # Backend tests
│   ├── migrations/          # Database migrations
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
├── frontend/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   ├── lib/                 # Utilities (API client, auth)
│   ├── public/              # Static assets
│   ├── tests/               # Frontend tests
│   ├── package.json         # Node dependencies
│   └── .env.local           # Environment variables
│
└── specs/                   # Feature specifications
    ├── overview.md
    ├── architecture.md
    └── 001-phase2-implementation/
        ├── spec.md
        ├── plan.md
        ├── research.md
        ├── data-model.md
        ├── quickstart.md
        └── contracts/
```

---

## Common Commands

### Backend

```bash
# Activate virtual environment
cd backend && source .venv/bin/activate

# Start server
uvicorn main:app --reload

# Run tests
pytest

# Format code
black .

# Lint code
ruff check .

# Type check
mypy .
```

### Frontend

```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

---

## Troubleshooting

### Backend Issues

**Issue**: `ModuleNotFoundError: No module named 'fastapi'`
**Solution**: Ensure virtual environment is activated and dependencies are installed:
```bash
source .venv/bin/activate
uv pip install -r requirements.txt
```

**Issue**: `Database connection failed`
**Solution**: Check `DATABASE_URL` in `backend/.env` is correct and Neon database is accessible.

**Issue**: `JWT token validation failed`
**Solution**: Ensure `BETTER_AUTH_SECRET` is the same in both frontend and backend `.env` files.

### Frontend Issues

**Issue**: `Cannot find module 'next'`
**Solution**: Install dependencies:
```bash
npm install
```

**Issue**: `API request failed with 401 Unauthorized`
**Solution**:
1. Check that backend is running on http://localhost:8000
2. Verify `BETTER_AUTH_SECRET` matches between frontend and backend
3. Try signing out and signing in again

**Issue**: `Network error when calling API`
**Solution**:
1. Verify backend is running
2. Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local` is correct
3. Check browser console for CORS errors

### Database Issues

**Issue**: `Relation "tasks" does not exist`
**Solution**: Run database migrations:
```bash
cd backend
python scripts/migrate.py
```

**Issue**: `SSL connection error`
**Solution**: Ensure `sslmode=require` is in `DATABASE_URL`:
```
DATABASE_URL=postgresql://...?sslmode=require
```

---

## Development Workflow

1. **Specs First**: Always update specs before implementing features
2. **Branch per Feature**: Create feature branch from main
3. **Run Tests**: Ensure all tests pass before committing
4. **Code Review**: Submit PR for review
5. **Merge**: Merge to main after approval

---

## Production Deployment

### Backend (Recommended: Railway/Render/Fly.io)

1. Set environment variables in platform dashboard
2. Connect GitHub repository
3. Deploy `backend/` directory
4. Run migrations on first deploy

### Frontend (Recommended: Vercel/Netlify)

1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `.next`
4. Add environment variables
5. Deploy

### Database

Neon automatically handles scaling and backups. No additional setup needed.

---

## Next Steps

- Read the full documentation in `/specs/`
- Explore the API using Swagger UI at http://localhost:8000/docs
- Review the architecture in `/specs/architecture.md`
- Check out user stories in `/specs/001-phase2-implementation/spec.md`

---

## Support

For issues or questions:
- Check the troubleshooting section above
- Review specifications in `/specs/`
- Check GitHub Issues
- Contact the development team

---

## License

[Your License Here]

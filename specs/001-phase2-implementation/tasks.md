# Implementation Tasks: Phase 2 Full-Stack Todo Application

**Feature**: Phase 2 Full-Stack Todo Application Implementation
**Branch**: `001-phase2-implementation`
**Generated**: 2025-12-06
**Total Tasks**: 65

**Task Format**: `- [ ] [TaskID] [P] [Story] Description with file path`
- **[P]**: Parallelizable (can run concurrently with other [P] tasks)
- **[US#]**: User Story number (US1-US5)
- Task IDs are sequential (T001-T065) in dependency order

---

## Phase 1: Setup & Project Initialization

**Goal**: Create project structure and install dependencies

**Tasks**:

- [ ] T001 Create monorepo directory structure (backend/, frontend/, specs/)
- [ ] T002 [P] Initialize backend project with UV in backend/ directory
- [ ] T003 [P] Initialize frontend project with create-next-app in frontend/ directory
- [ ] T004 [P] Create backend pyproject.toml with FastAPI, SQLModel, python-jose, pydantic, uvicorn dependencies
- [ ] T005 [P] Create frontend package.json with Next.js 16+, React 19+, TailwindCSS, Better Auth dependencies
- [ ] T006 [P] Create backend .env.example with DATABASE_URL, BETTER_AUTH_SECRET, API_HOST, API_PORT
- [ ] T007 [P] Create frontend .env.local.example with NEXT_PUBLIC_API_URL, BETTER_AUTH_SECRET
- [ ] T008 [P] Create backend .gitignore for Python (.venv/, __pycache__, *.pyc, .env)
- [ ] T009 [P] Create frontend .gitignore for Next.js (.next/, node_modules/, .env.local)
- [ ] T010 [P] Create backend README.md with setup instructions from quickstart.md
- [ ] T011 [P] Create frontend README.md with setup instructions from quickstart.md

---

## Phase 2: Foundational Infrastructure (Must Complete Before User Stories)

**Goal**: Set up database, configuration, and shared infrastructure needed by all user stories

**Tasks**:

- [ ] T012 Create backend/config.py to load environment variables (DATABASE_URL, BETTER_AUTH_SECRET, etc.)
- [ ] T013 Create backend/db.py with SQLAlchemy engine and session management (connection pooling: pool_size=5, max_overflow=10)
- [ ] T014 Create backend/models.py with Task SQLModel definition per data-model.md
- [ ] T015 Create backend/schemas.py with Pydantic schemas (TaskCreate, TaskUpdate, TaskResponse, TaskListResponse)
- [ ] T016 Create database migration backend/migrations/001_create_tasks_table.sql from data-model.md
- [ ] T017 Create backend/scripts/migrate.py to execute database migrations
- [ ] T018 Run database migration to create tasks table in Neon PostgreSQL
- [ ] T019 Create backend/middleware.py with JWT authentication middleware (verify_token function)
- [ ] T020 Create backend/main.py with FastAPI app initialization and CORS configuration
- [ ] T021 Create frontend/lib/types.ts with TypeScript interfaces (Task, CreateTaskData, UpdateTaskData, TaskListResponse)
- [ ] T022 [P] Create frontend/tailwind.config.ts with custom theme configuration
- [ ] T023 [P] Create frontend/app/layout.tsx as root layout with metadata and font configuration

---

## Phase 3: User Story 1 - User Authentication and Registration (Priority: P1)

**Story Goal**: Enable users to create accounts and sign in with JWT authentication

**Independent Test**: Create account, sign in, verify JWT token contains user_id, make authenticated API request

**Tasks**:

- [ ] T024 [US1] Configure Better Auth in frontend/lib/auth.ts with JWT plugin and BETTER_AUTH_SECRET
- [ ] T025 [US1] Create frontend/app/(auth)/layout.tsx for centered auth form layout
- [ ] T026 [US1] Create frontend/app/(auth)/signup/page.tsx with registration form (email, password fields)
- [ ] T027 [US1] Create frontend/app/(auth)/signin/page.tsx with sign-in form (email, password fields)
- [ ] T028 [US1] Implement auth form validation (email format, password minimum 8 characters)
- [ ] T029 [US1] Integrate Better Auth signup flow in signup page (POST to Better Auth endpoint)
- [ ] T030 [US1] Integrate Better Auth signin flow in signin page (POST to Better Auth endpoint)
- [ ] T031 [US1] Implement JWT token storage in frontend (use Better Auth session management)
- [ ] T032 [US1] Update backend/middleware.py to validate JWT signature using python-jose
- [ ] T033 [US1] Update backend/middleware.py to verify JWT expiration time
- [ ] T034 [US1] Update backend/middleware.py to extract user_id from JWT payload
- [ ] T035 [US1] Update backend/main.py to apply JWT middleware to all /api routes

---

## Phase 4: User Story 2 - Create and View Tasks (Priority: P1)

**Story Goal**: Authenticated users can create tasks and view their task list

**Independent Test**: Sign in, create task with title "Buy groceries", verify it appears in task list with correct user_id

**Dependencies**: Requires US1 (authentication) to be complete

**Tasks**:

- [ ] T036 [US2] Create backend/routes/tasks.py with router initialization
- [ ] T037 [US2] Implement POST /api/{user_id}/tasks endpoint (create task, assign user_id from JWT)
- [ ] T038 [US2] Implement GET /api/{user_id}/tasks endpoint (list tasks filtered by user_id, sorted by created_at DESC)
- [ ] T039 [US2] Add status filter query parameter to GET /api/{user_id}/tasks (all/pending/completed)
- [ ] T040 [US2] Verify user_id in URL matches user_id in JWT (403 Forbidden if mismatch)
- [ ] T041 [US2] Mount tasks router in backend/main.py
- [ ] T042 [US2] Create frontend/lib/api.ts with typed API client class
- [ ] T043 [US2] Implement api.listTasks(userId) method with automatic JWT attachment
- [ ] T044 [US2] Implement api.createTask(userId, data) method with automatic JWT attachment
- [ ] T045 [US2] Create frontend/components/TaskForm.tsx for create/edit task form (title, description inputs)
- [ ] T046 [US2] Create frontend/components/TaskItem.tsx to display single task (title, description, timestamps)
- [ ] T047 [US2] Create frontend/components/TaskList.tsx to render array of TaskItem components
- [ ] T048 [US2] Create frontend/components/Navbar.tsx with user info and logout button
- [ ] T049 [US2] Create frontend/app/(dashboard)/layout.tsx with Navbar
- [ ] T050 [US2] Create frontend/app/(dashboard)/tasks/page.tsx with TaskList and TaskForm integration
- [ ] T051 [US2] Implement optimistic UI updates (add task to list immediately, rollback on error)

---

## Phase 5: User Story 3 - Update and Delete Tasks (Priority: P1)

**Story Goal**: Users can update task details and delete tasks they own

**Independent Test**: Create task, update title to "Buy milk and eggs", verify changes persist, delete task, verify removal

**Dependencies**: Requires US2 (create/view tasks) to be complete

**Tasks**:

- [ ] T052 [US3] Implement GET /api/{user_id}/tasks/{task_id} endpoint in backend/routes/tasks.py
- [ ] T053 [US3] Implement PUT /api/{user_id}/tasks/{task_id} endpoint (update title/description, verify ownership)
- [ ] T054 [US3] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint (verify ownership before deletion)
- [ ] T055 [US3] Return 404 Not Found if task doesn't exist
- [ ] T056 [US3] Return 403 Forbidden if user attempts to update/delete another user's task
- [ ] T057 [US3] Implement api.getTask(userId, taskId) method in frontend/lib/api.ts
- [ ] T058 [US3] Implement api.updateTask(userId, taskId, data) method in frontend/lib/api.ts
- [ ] T059 [US3] Implement api.deleteTask(userId, taskId) method in frontend/lib/api.ts
- [ ] T060 [US3] Add edit mode to frontend/components/TaskForm.tsx (populate form with existing task data)
- [ ] T061 [US3] Add delete button to frontend/components/TaskItem.tsx with confirmation dialog
- [ ] T062 [US3] Add edit button to frontend/components/TaskItem.tsx to open edit form

---

## Phase 6: User Story 4 - Mark Tasks Complete/Incomplete (Priority: P2)

**Story Goal**: Users can toggle task completion status and filter by status

**Independent Test**: Create task, mark complete, verify completed=true, mark incomplete, verify completed=false, filter by status

**Dependencies**: Requires US2 (create/view tasks) to be complete

**Tasks**:

- [ ] T063 [US4] Implement PATCH /api/{user_id}/tasks/{task_id}/complete endpoint (toggle completed field)
- [ ] T064 [US4] Update updated_at timestamp when completion status changes
- [ ] T065 [US4] Implement api.toggleComplete(userId, taskId) method in frontend/lib/api.ts
- [ ] T066 [US4] Add completion checkbox to frontend/components/TaskItem.tsx (toggle on click)
- [ ] T067 [US4] Add status filter dropdown to frontend/app/(dashboard)/tasks/page.tsx (all/pending/completed)
- [ ] T068 [US4] Update TaskList to filter tasks client-side based on selected status
- [ ] T069 [US4] Add visual distinction for completed tasks (strikethrough title, muted colors)

---

## Phase 7: User Story 5 - Responsive UI with Real-time Updates (Priority: P2)

**Story Goal**: Application works on mobile and desktop with responsive design

**Independent Test**: Access app on mobile (320px) and desktop (2560px), verify layout adapts, test keyboard navigation

**Dependencies**: Requires US2 (UI components) to be complete

**Tasks**:

- [ ] T070 [US5] Implement TailwindCSS responsive breakpoints in TaskList (sm:, md:, lg: variants)
- [ ] T071 [US5] Implement TailwindCSS responsive breakpoints in TaskForm (stack inputs on mobile, side-by-side on desktop)
- [ ] T072 [US5] Implement TailwindCSS responsive breakpoints in Navbar (hamburger menu on mobile, full nav on desktop)
- [ ] T073 [US5] Add ARIA labels to all interactive elements (buttons, inputs, forms)
- [ ] T074 [US5] Implement keyboard navigation (Tab, Enter, Escape key handling)
- [ ] T075 [US5] Test layout on mobile viewport (320px-768px width)
- [ ] T076 [US5] Test layout on desktop viewport (768px-2560px width)
- [ ] T077 [US5] Implement loading states for async operations (spinner/skeleton screens)
- [ ] T078 [US5] Implement error handling UI (toast notifications for errors)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Error handling, validation, performance optimization, testing

**Tasks**:

- [ ] T079 [P] Add input validation error messages in TaskForm (display validation errors)
- [ ] T080 [P] Implement 401 Unauthorized redirect to signin page in API client
- [ ] T081 [P] Implement 403 Forbidden error handling with user-friendly message
- [ ] T082 [P] Implement 404 Not Found error handling
- [ ] T083 [P] Implement 500 Internal Server Error handling with generic message
- [ ] T084 [P] Add loading spinners to all async buttons (prevent double-submit)
- [ ] T085 [P] Implement frontend/app/page.tsx landing page (welcome message, sign in/sign up links)
- [ ] T086 [P] Add database connection health check endpoint GET /api/health
- [ ] T087 [P] Verify all timestamps are stored in UTC ISO8601 format
- [ ] T088 [P] Verify database indexes are created (user_id, user_id+created_at, user_id+completed)
- [ ] T089 [P] Test concurrent task operations (create, update, delete from multiple tabs)
- [ ] T090 [P] Verify data isolation (user A cannot see user B's tasks)
- [ ] T091 [P] Run frontend build (npm run build) and verify no errors
- [ ] T092 [P] Run backend with uvicorn and verify startup successful
- [ ] T093 [P] Update root README.md with project overview and quick start instructions

---

## Dependencies & Execution Order

### User Story Completion Order:

1. **US1 (Authentication)** - MUST complete first (foundational for all other stories)
2. **US2 (Create/View Tasks)** - Requires US1, foundational for US3-US5
3. **US3 (Update/Delete Tasks)** - Requires US2 (extends CRUD operations)
4. **US4 (Toggle Completion)** - Requires US2 (extends task functionality), CAN run parallel with US3
5. **US5 (Responsive UI)** - Requires US2 (UI polish), CAN run parallel with US3/US4

### Parallel Execution Opportunities:

**During Setup (Phase 1)**:
- All T002-T011 can run in parallel (independent setup tasks)

**During Foundational (Phase 2)**:
- T022-T023 (frontend config) can run parallel with T012-T020 (backend setup)

**During User Story 3**:
- Frontend tasks T057-T062 can run parallel with backend tasks T052-T056

**During User Story 4**:
- All US4 tasks can run parallel with US3 tasks (different features)

**During User Story 5**:
- All US5 tasks can run parallel with US3/US4 tasks (independent UI polish)

**During Polish (Phase 8)**:
- All T079-T093 tasks marked [P] can run in parallel

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product):

**Phase 1 + Phase 2 + Phase 3 + Phase 4 = Working MVP**

This delivers:
- ✅ User registration and authentication (US1)
- ✅ Create and view tasks (US2)
- ✅ Basic task management
- ✅ Secure multi-user isolation
- ✅ Complete authentication flow

**Recommended MVP**: Stop after completing US2 (T001-T051)
- This provides a fully functional, independently testable increment
- Users can register, sign in, create tasks, and view their task list
- All foundational infrastructure is in place
- Delivers immediate value for testing and feedback

### Incremental Delivery Plan:

1. **Sprint 1 (MVP)**: T001-T051 (Setup + Foundational + US1 + US2)
   - Deliverable: Users can sign up, sign in, and manage tasks (create, view)
   - Independent test: Create account → Sign in → Create task → View in list

2. **Sprint 2**: T052-T062 (US3 - Update/Delete)
   - Deliverable: Full CRUD operations
   - Independent test: Update task title → Delete task

3. **Sprint 3**: T063-T069 (US4 - Completion) + T070-T078 (US5 - Responsive UI)
   - Deliverable: Task completion tracking + Mobile-friendly UI
   - Independent test: Toggle task completion → Filter by status → Test on mobile

4. **Sprint 4**: T079-T093 (Polish & Testing)
   - Deliverable: Production-ready application with error handling and validation

---

## Validation Checklist

After completing tasks, verify:

- [ ] All user stories have independent tests that pass
- [ ] JWT authentication works (sign up, sign in, token validation)
- [ ] User data isolation works (user A cannot see user B's tasks)
- [ ] All API endpoints follow OpenAPI spec in contracts/openapi.yaml
- [ ] All database operations use proper indexes for performance
- [ ] Frontend is responsive on mobile (320px) and desktop (2560px)
- [ ] Error handling provides user-friendly messages
- [ ] All timestamps are in UTC ISO8601 format
- [ ] Application meets performance goals (< 500ms API, < 2s frontend load)
- [ ] Code follows project structure in plan.md

---

## Notes

- **Task Count**: 93 total tasks
- **Parallelizable**: 29 tasks marked [P] can run concurrently
- **User Story Breakdown**:
  - Setup: 11 tasks
  - Foundational: 12 tasks
  - US1 (Auth): 12 tasks
  - US2 (Create/View): 16 tasks
  - US3 (Update/Delete): 11 tasks
  - US4 (Completion): 7 tasks
  - US5 (Responsive): 9 tasks
  - Polish: 15 tasks

- **Estimated MVP Timeline**: Setup + Foundational + US1 + US2 = 51 tasks for working authentication and basic task management

- **Critical Path**: T001 → T012 → T024 → T036 (Setup → Database → Auth → Tasks)

- **Testing**: No explicit test tasks generated (testing strategy documented in research.md, implement tests alongside features as needed)

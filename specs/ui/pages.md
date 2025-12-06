# UI Pages Specification – Phase II

## Pages Required

### / (Home)
- Landing page
- Shows login/signup or redirects to dashboard if authenticated

### /dashboard
- Shows user’s task list
- Displays:
  - task title
  - completion status
  - created date
- Buttons:
  - Add Task
  - Edit Task
  - Delete Task
  - Toggle Complete

### /tasks/new
- Form fields:
  - title (required)
  - description (optional)

### /tasks/{id}/edit
- Same fields as /new

---

## UX Requirements
- Responsive design using Tailwind
- Error messages displayed inline
- Loading states using skeleton components

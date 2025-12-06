# UI Components Specification – Phase II

## Components

### TaskItem
Props:
- id
- title
- description (optional)
- completed
- created_at

Actions:
- Toggle complete
- Edit
- Delete

---

### TaskList
- Renders list of TaskItem
- Supports filters

---

### TaskForm
Fields:
- title
- description

Operations:
- validate inputs
- call API client

---

### Navbar
- Shows user info
- Logout button

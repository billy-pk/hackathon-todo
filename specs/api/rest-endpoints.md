# REST API Endpoints – Phase II

## Base URL
/api/{user_id}/tasks

All endpoints require:
Authorization: Bearer <jwt>
Content-Type: application/json

---

## GET /api/{user_id}/tasks
Returns list of tasks for authenticated user.

Query Parameters:
- `status`: all | pending | completed  
- `sort`: created | title | due_date (future use)

---

## POST /api/{user_id}/tasks
Creates a new task.

Request Body:
{
"title": "Buy groceries",
"description": "Milk, eggs"
}

---

## GET /api/{user_id}/tasks/{id}
Returns single task by id.

---

## PUT /api/{user_id}/tasks/{id}
Updates full task record.

---

## PATCH /api/{user_id}/tasks/{id}/complete
Toggles completion status.

---

## DELETE /api/{user_id}/tasks/{id}
Deletes task if owned by user.

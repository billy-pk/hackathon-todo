from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional, List


class TaskCreate(BaseModel):
    """Request schema for creating a new task"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

    class Config:
        json_schema_extra = {  # Pydantic v2: replaces schema_extra
            "example": {
                "title": "Buy groceries",
                "description": "Milk, eggs, bread"
            }
        }


class TaskUpdate(BaseModel):
    """Request schema for updating a task"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)

    class Config:
        json_schema_extra = {  # Pydantic v2: replaces schema_extra
            "example": {
                "title": "Buy groceries and cook dinner",
                "description": "Updated description"
            }
        }


class TaskResponse(BaseModel):
    """Response schema for task data"""
    id: UUID
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2: replaces orm_mode
        json_schema_extra = {  # Pydantic v2: replaces schema_extra
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "user_123",
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "completed": False,
                "created_at": "2025-12-06T12:00:00Z",
                "updated_at": "2025-12-06T12:00:00Z"
            }
        }


class TaskListResponse(BaseModel):
    """Response schema for task list"""
    tasks: List[TaskResponse]
    total: int

    class Config:
        json_schema_extra = {  # Pydantic v2: replaces schema_extra
            "example": {
                "tasks": [
                    {
                        "id": "123e4567-e89b-12d3-a456-426614174000",
                        "user_id": "user_123",
                        "title": "Buy groceries",
                        "description": "Milk, eggs, bread",
                        "completed": False,
                        "created_at": "2025-12-06T12:00:00Z",
                        "updated_at": "2025-12-06T12:00:00Z"
                    }
                ],
                "total": 1
            }
        }
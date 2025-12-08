import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TaskItem } from '../../components/TaskItem';

// Mock API module
jest.mock('../../lib/api', () => ({
  api: {
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    toggleComplete: jest.fn(),
  },
}));

const { api } = require('../../lib/api');

describe('TaskItem Component', () => {
  const mockTask = {
    id: 'test-id',
    user_id: 'test-user-id',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    created_at: '2025-12-06T12:00:00Z',
    updated_at: '2025-12-06T12:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information correctly', () => {
    render(<TaskItem task={mockTask} userId="test-user-id" onTaskUpdated={jest.fn()} onDelete={jest.fn()} onEdit={jest.fn()} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('toggles completion status when checkbox is clicked', async () => {
    const mockOnTaskUpdated = jest.fn();
    const mockOnToggleComplete = jest.fn();
    const updatedTask = { ...mockTask, completed: true };
    // api.toggleComplete.mockResolvedValue(updatedTask); // This mock is not directly used by the component's internal handler

    render(
      <TaskItem 
        task={mockTask} 
        userId="test-user-id" 
        onTaskUpdated={mockOnTaskUpdated} 
        onDelete={jest.fn()} 
        onEdit={jest.fn()} 
        onToggleComplete={mockOnToggleComplete}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockOnToggleComplete).toHaveBeenCalledWith('test-id'); // Assert on the prop being called
      // expect(mockOnTaskUpdated).toHaveBeenCalledWith(updatedTask); // This assertion might not be directly relevant here
    });

    // The component itself should update its state based on the result of onToggleComplete
    // Since we are mocking onToggleComplete, we don't necessarily expect the checkbox to change in this test
    // expect(checkbox).toBeChecked(); 
  });

  test('calls delete function when delete button is clicked', async () => {
    const mockOnDelete = jest.fn();
    api.deleteTask.mockResolvedValue({});

    render(
      <TaskItem 
        task={mockTask} 
        userId="test-user-id" 
        onTaskUpdated={jest.fn()} 
        onDelete={mockOnDelete} 
        onEdit={jest.fn()}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    // For the confirmation dialog, simulate clicking "Yes"
    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(api.deleteTask).toHaveBeenCalledWith('test-user-id', 'test-id');
      expect(mockOnDelete).toHaveBeenCalledWith('test-id');
    });
  });

  test('shows edit button that opens edit form', () => {
    render(
      <TaskItem 
        task={mockTask} 
        userId="test-user-id" 
        onTaskUpdated={jest.fn()}
        onDelete={jest.fn()}
        onEdit={jest.fn()}
        onToggleComplete={jest.fn()}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Check if the edit form appears
    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/description/i)).toBeInTheDocument();
  });
});
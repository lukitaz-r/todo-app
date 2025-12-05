import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Task } from '@/app/types/tasks';

interface TasksState {
  items: Task[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TasksState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const data = await response.json();
  return data as Task[];
});

export const addTask = createAsyncThunk('tasks/addTask', async (newTask: Omit<Task, 'id' | 'dateCreated'>) => {
  const response = await fetch('/api/data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  });
  if (!response.ok) {
    throw new Error('Failed to add task');
  }
  const data = await response.json();
  return data as Task;
});

export const updateTask = createAsyncThunk('tasks/updateTask', async (task: Task) => {
  const response = await fetch('/api/data', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error('Failed to update task');
  }
  const data = await response.json();
  return data as Task;
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: string) => {
  const response = await fetch(`/api/data?id=${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
  return id;
});

export const deleteAllTasks = createAsyncThunk('tasks/deleteAllTasks', async () => {
  const response = await fetch('/api/data', {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete tasks');
  }
  return;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((task) => (task._id || task.id) === (action.payload._id || action.payload.id));
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => (task._id || task.id) !== action.payload);
      })
      .addCase(deleteAllTasks.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default tasksSlice.reducer;

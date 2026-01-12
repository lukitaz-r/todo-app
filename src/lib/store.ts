import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './features/tasks/tasksSlice';

/**
 * Creates and configures the Redux store.
 * Crea y configura el store de Redux.
 * 
 * @returns {AppStore} The configured store instance.
 */
export const makeStore = () => {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
    },
  });
};

// Infer the type of makeStore / Inferir el tipo de makeStore
export type AppStore = ReturnType<typeof makeStore>;

// Infer the `RootState` and `AppDispatch` types from the store itself
// Inferir los tipos `RootState` y `AppDispatch` del propio store
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

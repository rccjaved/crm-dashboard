// app/lib/store/slices/activitySlice.js
import { createSlice } from "@reduxjs/toolkit";

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    logs: [],
    loading: false,
    error: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },
  },
  reducers: {
    setActivityLogs: (state, action) => {
      state.logs = action.payload.data || [];
      if (action.payload.meta) {
        state.pagination = {
          current_page: action.payload.meta.current_page || 1,
          last_page: action.payload.meta.last_page || 1,
          per_page: action.payload.meta.per_page || 10,
          total: action.payload.meta.total || 0,
        };
      }
      state.error = null;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    deleteActivityLog: (state, action) => {
      state.logs = state.logs.filter((log) => log.id !== action.payload);
    },

    addActivityLog: (state, action) => {
      state.logs.unshift(action.payload);
    },

    updateActivityLog: (state, action) => {
      const index = state.logs.findIndex((log) => log.id === action.payload.id);
      if (index !== -1) {
        state.logs[index] = { ...state.logs[index], ...action.payload };
      }
    },

    // Clear all logs
    clearActivityLogs: (state) => {
      state.logs = [];
      state.pagination = {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
      };
    },

    // Set pagination
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },
  },
});

// Export actions
export const {
  setActivityLogs,
  setLoading,
  setError,
  clearError,
  deleteActivityLog,
  addActivityLog,
  updateActivityLog,
  clearActivityLogs,
  setPagination,
} = activitySlice.actions;

// Export reducer
export default activitySlice.reducer;

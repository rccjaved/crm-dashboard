import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },
    isLoading: false,
    error: null,
    updatingUserId: null, // Track which user is being updated
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload.users;
      state.pagination = action.payload.pagination;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
    addUser: (state, action) => {
      state.users.unshift(action.payload);
    },
    // New reducers for update functionality
    startUpdatingUser: (state, action) => {
      state.updatingUserId = action.payload;
    },
    stopUpdatingUser: (state) => {
      state.updatingUserId = null;
    },
    updateUserModules: (state, action) => {
      const { userId, modules } = action.payload;
      const userIndex = state.users.findIndex((user) => user.id === userId);
      if (userIndex !== -1) {
        state.users[userIndex].modules = modules;
        state.users[userIndex].moduleName = modules.join(", ");
      }
    },
  },
});

export const {
  setUsers,
  setLoading,
  setError,
  deleteUser,
  addUser,
  startUpdatingUser,
  stopUpdatingUser,
  updateUserModules,
} = usersSlice.actions;

export default usersSlice.reducer;

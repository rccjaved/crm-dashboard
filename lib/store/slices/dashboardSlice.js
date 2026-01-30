import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  dashboardData: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDashboardData: (state, action) => {
      state.dashboardData = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearDashboard: (state) => {
      state.dashboardData = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setDashboardData,
  setLoading,
  setError,
  clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;




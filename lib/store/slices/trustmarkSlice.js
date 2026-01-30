import { createSlice } from "@reduxjs/toolkit";

const trustmarkSlice = createSlice({
  name: "trustmark",
  initialState: {
    trustmarks: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    pagination: {
      total: 0,
      per_page: 15,
      current_page: 1,
      last_page: 1,
    },
  },
  reducers: {
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setSubmitting(state, action) {
      state.isSubmitting = action.payload;
    },
    setTrustmarks(state, action) {
      state.trustmarks = action.payload.trustmarks || action.payload;
      state.pagination = action.payload.pagination || state.pagination;
      state.error = null;
    },
    addTrustmark(state, action) {
      state.trustmarks.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateTrustmark(state, action) {
      const index = state.trustmarks.findIndex(
        (trustmark) => trustmark.id === action.payload.id
      );
      if (index !== -1) {
        state.trustmarks[index] = action.payload;
      }
    },
    deleteTrustmark(state, action) {
      state.trustmarks = state.trustmarks.filter(
        (trustmark) => trustmark.id !== action.payload
      );
      state.pagination.total -= 1;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setSubmitting,
  setTrustmarks,
  addTrustmark,
  updateTrustmark,
  deleteTrustmark,
  setError,
  clearError,
} = trustmarkSlice.actions;

export default trustmarkSlice.reducer;

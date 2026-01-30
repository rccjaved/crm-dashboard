import { createSlice } from "@reduxjs/toolkit";

const complaintsSlice = createSlice({
  name: "complaints",
  initialState: {
    complaints: [],
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
    setComplaints(state, action) {
      state.complaints = action.payload;
      state.error = null;
    },
    addComplaint(state, action) {
      state.complaints.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateComplaint(state, action) {
      const index = state.complaints.findIndex(
        (complaint) => complaint.id === action.payload.id
      );
      if (index !== -1) {
        state.complaints[index] = action.payload;
      }
    },
    deleteComplaint(state, action) {
      state.complaints = state.complaints.filter(
        (complaint) => complaint.id !== action.payload
      );
      state.pagination.total -= 1;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    setPagination(state, action) {
      state.pagination = action.payload;
    },
  },
});

export const {
  setLoading,
  setSubmitting,
  setComplaints,
  addComplaint,
  updateComplaint,
  deleteComplaint,
  setError,
  clearError,
  setPagination,
} = complaintsSlice.actions;

export default complaintsSlice.reducer;

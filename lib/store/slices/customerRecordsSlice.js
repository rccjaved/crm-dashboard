import { createSlice } from "@reduxjs/toolkit";

const customerRecordsSlice = createSlice({
  name: "customerRecords",
  initialState: {
    customerRecords: [],
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
    setCustomerRecords(state, action) {
      state.customerRecords = action.payload.customerRecords || action.payload;
      state.pagination = action.payload.pagination || state.pagination;
      state.error = null;
    },
    addCustomerRecord(state, action) {
      state.customerRecords.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateCustomerRecord(state, action) {
      const index = state.customerRecords.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.customerRecords[index] = action.payload;
      }
    },
    deleteCustomerRecord(state, action) {
      state.customerRecords = state.customerRecords.filter(
        (record) => record.id !== action.payload
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
  setCustomerRecords,
  addCustomerRecord,
  updateCustomerRecord,
  deleteCustomerRecord,
  setError,
  clearError,
} = customerRecordsSlice.actions;

export default customerRecordsSlice.reducer;

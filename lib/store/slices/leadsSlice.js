import { createSlice } from "@reduxjs/toolkit";

const leadsSlice = createSlice({
  name: "leads",
  initialState: {
    leads: [],
    isLoading: false,
    isSubmitting: false,
    error: null,
    pagination: {
      total: 0,
      per_page: 20,
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
    setLeads(state, action) {
      // accept API response shape or raw array
      if (action.payload && action.payload.data) {
        state.leads = action.payload.data;
        state.pagination = {
          total: action.payload.total || state.pagination.total,
          per_page: action.payload.per_page || state.pagination.per_page,
          current_page: action.payload.current_page || state.pagination.current_page,
          last_page: action.payload.last_page || state.pagination.last_page,
        };
      } else {
        state.leads = action.payload || [];
      }
      state.error = null;
    },
    addLead(state, action) {
      state.leads.unshift(action.payload);
      state.pagination.total += 1;
    },
    updateLead(state, action) {
      const idx = state.leads.findIndex((l) => l.id === action.payload.id);
      if (idx !== -1) state.leads[idx] = action.payload;
    },
    deleteLead(state, action) {
      state.leads = state.leads.filter((l) => l.id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
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
  setLeads,
  addLead,
  updateLead,
  deleteLead,
  setError,
  clearError,
} = leadsSlice.actions;

export default leadsSlice.reducer;

// If you have this file, either remove it or update to:
import { store } from "@/lib/store";

export const authService = {
  getCurrentUser: () => {
    // Get from Redux store instead of localStorage
    return store.getState().auth.userInfo;
  },

  isAuthenticated: () => {
    // Get from Redux store instead of localStorage
    return !!store.getState().auth.token;
  },

  logout: () => {
    // This should be handled by Redux actions
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};

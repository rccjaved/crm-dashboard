import { createSlice } from "@reduxjs/toolkit";

// Helper function to safely access localStorage
const getStoredAuth = () => {
  if (typeof window !== "undefined") {
    return {
      userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
      token: localStorage.getItem("token")
        ? localStorage.getItem("token")
        : null,
      modules: localStorage.getItem("modules")
        ? JSON.parse(localStorage.getItem("modules"))
        : [],
    };
  }
  return {
    userInfo: null,
    token: null,
    modules: [],
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getStoredAuth(),
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, modules } = action.payload;
      state.userInfo = user;
      state.token = token;
      state.modules = modules || [];

      // Store in localStorage (client-side only)
      if (typeof window !== "undefined") {
        localStorage.setItem("userInfo", JSON.stringify(user));
        localStorage.setItem("token", token);
        localStorage.setItem("modules", JSON.stringify(modules || []));
      }
    },
    logout: (state) => {
      state.userInfo = null;
      state.token = null;
      state.modules = [];

      // Remove from localStorage (client-side only)
      if (typeof window !== "undefined") {
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token");
        localStorage.removeItem("modules");
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

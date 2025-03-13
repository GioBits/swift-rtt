import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "./authActions";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("✅ Login exitoso", action.payload);
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("❌ Error en login:", action.payload);
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
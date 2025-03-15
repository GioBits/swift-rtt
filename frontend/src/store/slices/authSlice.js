import { createSlice } from "@reduxjs/toolkit";
import { fetchCurrentUser, loginUser } from "./authActions";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("✅ Login exitoso", action.payload);
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        console.log("❌ Error en login:", action.payload);
        state.user = null;
        state.isAuthenticated = false;
        state.error = action;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        console.log("✅ Login exitoso fetch", action.payload);
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        console.log("❌ Error fetch", action.payload);
        state.user = action.payload.user;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
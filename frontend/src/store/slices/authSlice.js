import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    const { user, password } = credentials;

    if (user === "admin" && password === "admin") {
      const fakeToken = "fake-jwt-token-12345";
      const userData = { name: "Admin", email: "admin@host.com" };

      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(userData));

      return { token: fakeToken, user: userData };
    } else {
      return thunkAPI.rejectWithValue("Credenciales incorrectas");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
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
        state.error = action.payload;
      });
  },
  
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

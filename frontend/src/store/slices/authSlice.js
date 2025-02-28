import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

function decodeJWT(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJSON = atob(payloadBase64);
    return JSON.parse(payloadJSON);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    const fakeToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3NDA3NTkwNTAsImV4cCI6MTc3MjI5NTA1OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImlkIjoiMzQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20ifQ.TleIsUJCWQHyRJpv6xZb25LWmVGGkJtb5n663eILKgs";

    const decoded = decodeJWT(fakeToken);
    if (!decoded) {
      return thunkAPI.rejectWithValue("Error al procesar el token");
    }

    const userData = {
      id: decoded.id,
      email: decoded.Email,
    };

    localStorage.setItem("token", fakeToken);
    localStorage.setItem("user", JSON.stringify(userData));

    return { token: fakeToken, user: userData };
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
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

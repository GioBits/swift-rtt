import { createAsyncThunk } from "@reduxjs/toolkit";
import { decodeJWT } from "./authUtils";
import userService from "../../service/userService";
import { apiService } from "../../service/api";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {

      const response = await userService.login(credentials);
      return {user: response};
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// ✅ Fetch user session from the backend on page reload
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      const response = await apiService.get("api/users/me");
      console.log(response)
      return { user: response }; // Should return { id, username }
    } catch (error) {
      return thunkAPI.rejectWithValue("Session expired");
    }
  }
);
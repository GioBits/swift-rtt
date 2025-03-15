import { createAsyncThunk } from "@reduxjs/toolkit";
import { decodeJWT } from "./authUtils";
import userService from "../../service/userService";

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

import { createAsyncThunk } from "@reduxjs/toolkit";
import { decodeJWT } from "./authUtils";
import userService from "../../service/userService";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      //const response = await userService.login(credentials);
      //const { access_token: token} = response;
      await userService.login(credentials);
      const userData = await apiService.get("/api/auth/me");

      return { user: userData };
      /* 
      const decoded = decodeJWT(token);
      if (!decoded) {
        return thunkAPI.rejectWithValue("Error al procesar el token");
      }

      const userData = {
        id: decoded.id,
        username: decoded.username,
      };

      return { token, user: userData };      */
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

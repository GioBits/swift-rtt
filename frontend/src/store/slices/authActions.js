import { createAsyncThunk } from "@reduxjs/toolkit";
import { decodeJWT } from "./authUtils";
import userService from "../../service/userService";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await userService.login(credentials);
      const { access_token: token} = response;

      const decoded = decodeJWT(token);
      if (!decoded) {
        return thunkAPI.rejectWithValue("Error al procesar el token");
      }

      const userData = {
        id: decoded.id,
        username: decoded.username,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      return { token, user: userData };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

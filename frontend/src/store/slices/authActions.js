import { createAsyncThunk } from "@reduxjs/toolkit";
import { decodeJWT } from "./authUtils";
import userService from "../../service/userService";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await userService.login(credentials);
      console.log(response)
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


export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    const fakeToken =
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE3NDA3NTkwNTAsImV4cCI6MTc3MjI5NTA1OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImlkIjoiMzQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20ifQ.TleIsUJCWQHyRJpv6xZb25LWmVGGkJtb5n663eILKgs";

    const decoded = decodeJWT(fakeToken);
    if (!decoded) {
      return thunkAPI.rejectWithValue("Error al procesar el token");
    }

    const newUser = {
      id: decoded.id,
      name: userData.name,
      username: userData.username,
    };

    localStorage.setItem("token", fakeToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    return { token: fakeToken, user: newUser };
  }
);
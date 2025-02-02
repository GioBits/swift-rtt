import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null,
  origin: null, // Identifica de dónde proviene el mensaje
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError: (state, action) => {
      state.message = action.payload.message;
      state.type = "error";
      state.origin = action.payload.origin || null;
    },
    setSuccess: (state, action) => {
      state.message = action.payload.message;
      state.type = "success";
      state.origin = action.payload.origin || null;
    },
    clearError: (state) => {
      state.message = null;
      state.type = null;
      state.origin = null;
    },
  },
});


export const { setError, setSuccess, clearError } = errorSlice.actions;
export const errorReducer = errorSlice.reducer;

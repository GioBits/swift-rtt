import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: null,
  type: null, // 'error' o 'success'
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.message = action.payload.message;
      state.type = 'error';
    },
    setSuccess: (state, action) => {
      state.message = action.payload.message;
      state.type = 'success';
    },
    clearError: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { setError, setSuccess, clearError } = errorSlice.actions;
export const errorReducer = errorSlice.reducer;

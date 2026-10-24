import { createSlice, configureStore } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: localStorage.getItem('token'), user: null },
  reducers: {
    setCredentials(state, { payload }) {
      state.token = payload.token;
      state.user = payload.user;
      localStorage.setItem('token', payload.token);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;

export const store = configureStore({
  reducer: { auth: authSlice.reducer }
});

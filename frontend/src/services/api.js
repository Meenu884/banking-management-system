import axios from 'axios';
import { store, logout } from '../store';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) store.dispatch(logout());
    return Promise.reject(err);
  }
);

export const authApi = {
  login: (data) => api.post('/auth/login', data).then((r) => r.data)
};

export const accountApi = {
  list: () => api.get('/accounts').then((r) => r.data)
};

export const txApi = {
  list: (params) => api.get('/transactions', { params }).then((r) => r.data),
  transfer: (data) => api.post('/transactions/transfer', data).then((r) => r.data)
};

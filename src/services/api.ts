import axios from 'axios';
import Cookies from 'js-cookie';
import { ILoginInput, IRegisterInput } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: (data: IRegisterInput) => api.post('/auth/register', data),

  login: (data: ILoginInput) => api.post('/auth/login', data),

  getCurrentUser: () => api.get('/auth/me'),

  logout: () => {
    Cookies.remove('token');
  },
};

export default api;

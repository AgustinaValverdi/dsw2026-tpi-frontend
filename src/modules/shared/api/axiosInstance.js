import axios from 'axios';
import { clearSession, getToken } from '../../auth/helpers/session';

const instance = axios.create({
  baseURL: import.meta.env.DEV ? '/' : import.meta.env.VITE_BACKEND_URL,
});

instance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const isAuthRequest = (url = '') => url.includes('api/auth/');

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 && !isAuthRequest(error.config?.url)) {
      clearSession();

      const isAdminArea = window.location.pathname.startsWith('/admin');

      window.location.href = isAdminArea ? '/admin/login' : '/login';
    }

    return Promise.reject(error);
  }
);

export { instance };

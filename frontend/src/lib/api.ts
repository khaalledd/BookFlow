import axios from 'axios';

// The NestJS backend is currently running on localhost:3000
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      typeof window !== 'undefined' &&
      error.response?.status === 401 &&
      !originalRequest?._retry
    ) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const refreshRes = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const accessToken =
          refreshRes.data?.data?.accessToken || refreshRes.data?.accessToken;

        if (!accessToken) {
          return Promise.reject(error);
        }

        localStorage.setItem('access_token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

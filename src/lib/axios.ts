// src/lib/axios.ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { store } from "../store/store";
import { logout, setCredentials } from "../store/slieces/authslice";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-session")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const res = await axiosInstance.get(
        `/auth/refresh-session`,
        { withCredentials: true }
      );

      const { id, role, access_token } = res.data.data;

      store.dispatch(
        setCredentials({
          accessToken: access_token,
          id,
          role,
        })
      );

      originalRequest.headers.Authorization = `Bearer ${access_token}`;

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      store.dispatch(logout());

      window.location.href = "/auth/login";

      return Promise.reject(refreshError);
    }
  }
);

export default axiosInstance;
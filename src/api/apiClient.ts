import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/useAuthStore";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {    
    "Content-Type": "application/json",
  },
});

export const authClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

let refreshPromise: Promise<{
  accessToken: string;
  refreshToken: string;
}> | null = null;

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/Refresh")) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const { refreshToken, user } = useAuthStore.getState();

    if (!refreshToken || !user) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    try {
      if (!refreshPromise) {
        refreshPromise = authClient
          .post("/auth/Refresh", {
            refreshToken,
          })
          .then((response) => response.data)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const tokens = await refreshPromise;

      useAuthStore.getState().setAuth(
        user,
        tokens.accessToken,
        tokens.refreshToken
      );

      originalRequest.headers.Authorization =
        `Bearer ${tokens.accessToken}`;

      return apiClient(originalRequest);
    } catch (err) {
      useAuthStore.getState().logout();
      return Promise.reject(err);
    }
  }
);
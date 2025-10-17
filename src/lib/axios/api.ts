import { AUTH_API } from "@/constants/apis/auth-api";
import { clearAdmin } from "@/store/slices/adminSlice";
import { clearUser } from "@/store/slices/userSlice";
import { store } from "@/store/store";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response) {
      const { status } = error.response;

      if (status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue requests while refreshing
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => api(originalRequest))
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const res = await refreshApi.post(AUTH_API.REFRESH_TOKEN);
          console.log("Auth refresh token response: ", res);
          processQueue(null);

          // Retry the original request
          return api(originalRequest);
        } catch (err) {
          console.log("error while refreshing token");
          processQueue(err);

          // 🔑 Add logout logic here
          store.dispatch(clearUser());
          store.dispatch(clearAdmin());
          toast.error("Session expired. Please login again.");

          window.location.href = "/login";
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      if (status === 403) {
        toast.error("You don’t have permission for this action.");
      }

      if (status === 404) {
        toast.error("The requested resource was not found.");
      }

      if (status >= 500) {
        toast.error("Server error. Please try again later.");
      }
    } else {
      // No response (network error, CORS issue, etc.)
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default api;

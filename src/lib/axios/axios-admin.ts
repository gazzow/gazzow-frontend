import { clearAdmin } from "@/store/slices/adminSlice";
import { store } from "@/store/store";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "react-toastify";

const axiosAdmin = axios.create({
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

axiosAdmin.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    console.log("axios error checking : ", error.response?.status);
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refreshing
        console.log("refreshing token");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosAdmin(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh endpoint
        const res = await axiosAdmin.post("/auth/refresh");
        console.log("Auth refresh token response: ", res.data);
        processQueue(null);

        // Retry the original request
        return axiosAdmin(originalRequest);
      } catch (err) {
        processQueue(err);
        //  Handle logout here
        window.location.href = "/admin/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    } else if (error.response?.status === 403) {
      store.dispatch(clearAdmin());
      toast.error("Unauthorized access");
      console.log("Error while refresh token 401");

      window.location.href = "/admin/login";
    }

    return Promise.reject(error);
  }
);

export default axiosAdmin;

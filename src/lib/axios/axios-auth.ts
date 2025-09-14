import axios from "axios";

const axiosAuth = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL+'/auth',
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default axiosAuth;
  
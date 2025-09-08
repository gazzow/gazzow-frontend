import axios from "axios";

const axiosAdmin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL + "/admin",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export default axiosAdmin;

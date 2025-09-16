import axiosAdmin from "@/lib/axios/axios-admin";

export const adminAuthService = {
  async login(data: Record<string, string>) {
    const res = await axiosAdmin.post("/admin/auth/login", data);
    return res.data;
  },
};

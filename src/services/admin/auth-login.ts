import api from "@/lib/axios/api";

export const adminAuthService = {
  async login(data: Record<string, string>) {
    const res = await api.post("/admin/auth/login", data);
    return res.data;
  },
};

import { ADMIN_API } from "@/constants/apis/admin/admin-api";
import api from "@/lib/axios/api";

export const adminAuthService = {
  async login(data: Record<string, string>) {
    const res = await api.post(ADMIN_API.LOGIN, data);
    return res.data;
  },
  async logout() {
    return api.post(ADMIN_API.LOGOUT);
  },
};

import { ADMIN_API } from "@/constants/apis/admin/admin-api";
import api from "@/lib/axios/api";

export const userManagementService = {
  getUsers: async (params: {
    skip?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sortField?: string;
    sortOrder?: string;
  }) => {
    const res = await api.get(ADMIN_API.USERS, {
      params,
    });
    console.log("get user response : ", res);
    return res.data;
  },

  async updateStatus(userId: string, status: string) {
    const res = await api.patch(ADMIN_API.UPDATE_STATUS(userId), {
      status,
    });
    console.log("update status response", res);
    return res.data;
  },

  async getSingleUser(userId: string) {
    const res = await api.get(ADMIN_API.SINGLE_USER(userId));
    console.log("User profile modal response: ", res);
    return res.data;
  },
};

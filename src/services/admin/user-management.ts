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
    const res = await api.get(`/admin/users`, {
      params,
    });
    console.log("get user response : ", res);
    return res.data;
  },

  async updateStatus(userId: string, status: string) {
    const res = await api.patch(`/admin/users/${userId}/status`, {
      status,
    });
    console.log("update status response", res);
    return res.data;
  },

  async getSingleUser(userId: string) {
    const res = await api.get(`/admin/users/${userId}`);
    console.log("User profile modal response: ", res);
    return res.data;
  },
};

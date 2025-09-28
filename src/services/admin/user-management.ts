import api from "@/lib/axios/api";

export const userManagementService = {
  async getUsers(skip: number, limit: number) {
    const res = await api.get(`/admin/users`, { params: { skip, limit } });
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

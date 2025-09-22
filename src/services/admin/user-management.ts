import axiosAdmin from "@/lib/axios/axios-admin";

export const userManagementService = {
  async getUsers(skip: number, limit: number) {
    const res = await axiosAdmin.get(`/admin/users?limit=${limit}&skip=${skip}`);
    return res.data;
  },
  async updateStatus(userId: string, status: string) {
    const res = await axiosAdmin.patch(`/admin/users/${userId}/status`, {
      status,
    });
    return res.data
  },
};

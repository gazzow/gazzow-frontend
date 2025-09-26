import api from "@/lib/axios/api";

export const userManagementService = {
  async getUsers(skip: number, limit: number) {
    const res = await api.get(`/admin/users`, {params:{skip, limit}});
    return res.data;
  },
  async updateStatus(userId: string, status: string) {
    const res = await api.patch(`/admin/users/${userId}/status`, {
      status,
    });
    return res.data
  },
};

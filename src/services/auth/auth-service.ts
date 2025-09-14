import axiosUser from "@/lib/axios/axios-user";

export const authService = {
  async login(data: Record<string, string>) {
    const res = await axiosUser.post("/auth/login", data);
    console.log(`response: ${JSON.stringify(res.data)}`);
    return res.data;
  },
  async logout() {
    return axiosUser.post("/auth/logout");
  },
};

import axiosUser from "@/lib/axios/axios-user";

export const authService = {
  async login(formData: Record<string, string>) {
    const res = await axiosUser.post("/auth/login", formData);
    console.log(`response: ${JSON.stringify(res.data)}`);
    return res.data;
  },
  async logout() {
    return axiosUser.post("/auth/logout");
  },
  async signup(formData: Record<string, string>) {
    const res = await axiosUser.post("/auth/register", formData);
    return res.data;
  },
};

import axiosAuth from "@/lib/axios/axios-auth";

export const authService = {
  async login(data: Record<string, string>) {
    const res = await axiosAuth.post("/login", data);
    console.log(`response: ${JSON.stringify(res.data)}`);
    return res.data;
  },
  async logout() {
    return axiosAuth.post("/logout");
  },
};

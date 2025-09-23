import api from "@/lib/axios/api";

export const authService = {
  async login(formData: Record<string, string>) {
    const res = await api.post("/auth/login", formData);
    console.log(`response: ${JSON.stringify(res.data)}`);
    return res.data;
  },
  async logout() {
    return api.post("/auth/logout");
  },
  async signup(formData: Record<string, string>) {
    const res = await api.post("/auth/register", formData);
    return res.data;
  },
};

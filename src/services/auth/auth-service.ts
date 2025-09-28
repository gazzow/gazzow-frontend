import api from "@/lib/axios/api";

export const authService = {
  async signup(formData: Record<string, string>) {
    const res = await api.post("/auth/register", formData);
    return res.data;
  },
  async verifyUser(email: string, otp: string) {
    const res = await api.post("/auth/verify-otp", { email, otp });
    console.log("verify user response: ", res);
    return res.data;
  },
  async login(formData: Record<string, string>) {
    const res = await api.post("/auth/login", formData);
    console.log(`response: ${JSON.stringify(res.data)}`);
    return res.data;
  },
  async forgotPassword(email: string) {
    const res = await api.post("/auth/forgot-password", {
      email,
    });
    console.log(`forgot pass response: ${JSON.stringify(res.data)}`);
    return res.data;
  },
  async resetPassword(email: string, password: string) {
    const res = await api.put("/auth/reset-password", { email, password });
    console.log("response in reset-password: ", res);
    return res.data;
  },
  async verifyOtp(endpoint: string, email: string, otp: string) {
    const res = await api.post(endpoint, { email, otp });
    console.log("verify otp response: ", res);
    return res.data;
  },
  async logout() {
    return api.post("/auth/logout");
  },
};

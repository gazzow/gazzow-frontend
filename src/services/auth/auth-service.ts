import { AUTH_API } from "@/constants/apis/auth-api";
import api from "@/lib/axios/api";

export const authService = {
  async signup(formData: Record<string, string>) {
    const res = await api.post(AUTH_API.REGISTER, formData);
    return res.data;
  },
  async verifyUser(email: string, otp: string) {
    const res = await api.post(AUTH_API.VERIFY_USER, { email, otp });
    console.log("verify user response: ", res);
    return res.data;
  },
  async login(formData: Record<string, string>) {
    const res = await api.post(AUTH_API.LOGIN, formData);
    console.log(`response: ${JSON.stringify(res.data)}`);
    return res.data;
  },
  async forgotPassword(email: string) {
    const res = await api.post(AUTH_API.FORGOT_PASSWORD, {
      email,
    });
    console.log(`forgot pass response: ${JSON.stringify(res.data)}`);
    return res.data;
  },
  async resetPassword(email: string, password: string) {
    const res = await api.put(AUTH_API.RESET_PASSWORD, { email, password });
    console.log("response in reset-password: ", res);
    return res.data;
  },
  async verifyOtp(endpoint: string, email: string, otp: string) {
    const res = await api.post(endpoint, { email, otp });
    console.log("verify otp response: ", res);
    return res.data;
  },
  async logout() {
    return api.post(AUTH_API.LOGOUT);
  },
};

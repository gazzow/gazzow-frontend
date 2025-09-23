import api from "@/lib/axios/api";

export const userService = {
  async getUser() {
    const res = await api.get("/profile/me");
    console.log("user profile response: ", res);
    return res.data; //{user, success, message}
  },
};

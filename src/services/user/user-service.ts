import axiosUser from "@/lib/axios/axios-user";

export const userService = {
    
  async getUser() {
    const res = await axiosUser.get("/profile/me");
    console.log("user profile response: ", res);
    return res.data; //{user, success, message}
  },

};

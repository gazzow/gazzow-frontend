import api from "@/lib/axios/api";
import { OnboardingInput } from "@/validators/onboarding";
import { ProfileUpdateInput } from "@/validators/profile-update";

export const userService = {
  async getUser() {
    const res = await api.get("/profile/me");
    console.log("user profile response: ", res);
    return res.data; 
  },

  async updateProfile(data: ProfileUpdateInput | OnboardingInput){ 
     const res = await api.put("/profile/update", data);
     console.log("Update profile response: ", res);
     return res.data
  }
};

import { USER_API } from "@/constants/apis/user-api";
import api from "@/lib/axios/api";
import { OnboardingInput } from "@/validators/onboarding";
import { ProfileUpdateInput } from "@/validators/profile-update";

export const userService = {
  async getUser() {
    const res = await api.get(USER_API.PROFILE);
    console.log("user profile response: ", res);
    return res.data; 
  },
  async updateProfile(data: ProfileUpdateInput | OnboardingInput){ 
     const res = await api.put(USER_API.UPDATE_PROFILE, data);
     console.log("Update profile response: ", res);
     return res.data
  }
};

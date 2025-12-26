"use client";

import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { authService } from "@/services/auth/auth-service";
import { notificationService } from "@/services/user/notification.service";
import { clearUser } from "@/store/slices/userSlice";
import { persistor, useAppDispatch } from "@/store/store";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export function useLogout() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await notificationService.deleteToken();
      await authService.logout();

      toast.success("Logged out successfully");
      // clear user store
      dispatch(clearUser());
      // clear persisted state
      persistor.purge();

      router.push(AUTH_ROUTES.LOGIN);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Logout failed");
      }
    }
  };

  return { handleLogout };
}

"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { setUserProfile } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user/user-service";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import axios from "axios";
import { toast } from "react-toastify";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";

export default function SuccessPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    userService
      .getUser()
      .then((res) => {
        console.log("User data on success:", res.data);
        dispatch(setUserProfile(res.data));
        router.replace(USER_ROUTES.HOME);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log("success error: ", error.response?.data);
          toast.error(error.response?.data?.message || "Something went wrong!");
          router.replace(AUTH_ROUTES.LOGIN)
        } else {
          console.log("unexpected error: ", error);
        }
      });
  }, [dispatch, router]);

  return <LoadingSpinner />;
}

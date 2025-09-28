"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/store";
import { setUserProfile } from "@/store/slices/userSlice";
import { useRouter } from "next/navigation";
import { userService } from "@/services/user/user-service";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";

export default function SuccessPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    userService
      .getUser()
      .then((res) => {
        console.log("User data on success:", res.data);

        dispatch(setUserProfile(res.data));
        router.replace("/home");
      })
      .catch((err) => console.error(err));
  }, [dispatch, router]);

  return <LoadingSpinner />;
}

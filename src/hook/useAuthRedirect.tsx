import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthRedirect = (isLogin: boolean) => {
  const userId = useAppSelector((state) => state.user?.id);
  const router = useRouter();

  useEffect(() => {
    if (!userId && !isLogin) {
      router.replace("/login");
    } else if (userId && isLogin) {
      router.replace("/home");
    }
  }, [userId, isLogin, router]);

  return userId;
};

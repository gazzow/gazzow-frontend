import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthRedirect = (isAuth: boolean) => {
  const userId = useAppSelector((state) => state.user?.id);
  const router = useRouter();

  useEffect(() => {
    if (!userId && !isAuth) {
      router.replace("/login");
    } else if (userId && isAuth) {
      router.replace("/home");
    }
  }, [userId, isAuth, router]);

  return userId;
};

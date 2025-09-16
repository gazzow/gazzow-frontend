import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthRedirect = (isAuth: boolean) => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user.id && !isAuth) {
      router.replace("/login");
    } else if (user.id && isAuth) {
      if (user.isOnboarding) {
        router.replace("/onboarding");
      } else {
        router.replace("/home");
      }
    }
  }, [user, isAuth, router]);

  return user;
};

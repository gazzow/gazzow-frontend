import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthRedirect = (isAuth: boolean) => {
  const user = useAppSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!user.id && !isAuth) {
      router.replace(AUTH_ROUTES.LOGIN);
    } else if (user.id && isAuth) {
      if (user.isOnboarding) {
        router.replace(USER_ROUTES.ONBOARDING);
      } else {
        router.replace(USER_ROUTES.HOME);
      }
    }
  }, [user, isAuth, router]);

  return user;
};

"use client";

import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authEndpoints: string[] = Object.values(AUTH_ROUTES) || [];
  const isAuth: boolean = authEndpoints.includes(usePathname());
  const user = useAuthRedirect(isAuth);

  if (user.id) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  return <main className="flex-1">{children}</main>;
}

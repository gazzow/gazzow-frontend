"use client";

import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authEndpoints: string[] = ["/login", "/signup", "/forgot-password", "/forgot-password/verify-otp", "/verify-otp", "/reset-password"];
  const isAuth: boolean = authEndpoints.includes(usePathname());
  const user = useAuthRedirect(isAuth);

  if (user.id) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading...
      </div>
    );
  }
  return <main className="flex-1">{children}</main>;
}

"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { usePathname } from "next/navigation";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authEndpoints: string[] = [
    "/login",
    "/signup",
    "/forgot-password",
    "/forgot-password/verify-otp",
    "/verify-otp",
    "/reset-password",
  ];
  const isAuth = authEndpoints.includes(usePathname());
  const isOnboarding = usePathname() === "/onboarding";
  const userId = useAuthRedirect(isAuth);
  console.log("user id: ", userId);

  if (isOnboarding) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="flex bg-primary">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 text-white">{children}</main>
      </div>
    </div>
  );
}

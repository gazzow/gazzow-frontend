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
  const user = useAuthRedirect(isAuth);
  console.log("user id: ", user.id);

  return (
    <div className="flex bg-primary">
      {!user.isOnboarding && <Navbar />}

      <div className="flex flex-1 overflow-hidden">
        {!user.isOnboarding && <Sidebar />}

        <main className="flex-1 text-white">{children}</main>
      </div>
    </div>
  );
}

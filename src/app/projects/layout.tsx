"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { usePathname } from "next/navigation";

export default function ProjectLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authEndpoints: string[] = Object.values(AUTH_ROUTES) || [];
  const isAuth = authEndpoints.includes(usePathname());
  const user = useAuthRedirect(isAuth);
  console.log("user id: ", user.id);

  return (
    <div className="flex bg-primary">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 text-white">
          <div className="min-h-screen mt-16 bg-primary p-6 flex text-black dark:text-white transition ease-in-out">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

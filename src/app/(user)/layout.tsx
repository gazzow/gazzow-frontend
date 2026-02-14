"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { NavigationProvider } from "@/providers/NavigationProvider";
import { usePathname } from "next/navigation";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authEndpoints: string[] = Object.values(AUTH_ROUTES) || [];
  const isAuth = authEndpoints.includes(usePathname());
  const user = useAuthRedirect(isAuth);

  if (user.id === null) return;

  return (
    <div className="flex bg-primary">
      <NavigationProvider>
        {!user.isOnboarding && <Navbar />}

        <div className="flex flex-1 overflow-hidden">
          {!user.isOnboarding && <Sidebar />}

          <main className="flex-1 text-white">{children}</main>
        </div>
      </NavigationProvider>
    </div>
  );
}

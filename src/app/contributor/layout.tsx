"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { useAuthRedirect } from "@/hook/useAuthRedirect";
import { NavigationProvider } from "@/providers/NavigationProvider";
import { usePathname } from "next/navigation";

export default function ContributorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authEndpoints: string[] = Object.values(AUTH_ROUTES) || [];
  const isAuth = authEndpoints.includes(usePathname());
  const user = useAuthRedirect(isAuth);

  if (user.id === null) return;

  return (
    <div className="flex">
      <NavigationProvider>
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 w-full text-black dark:text-white transition-colors">
            <div
              className="min-h-[90vh] w-full mt-16 p-6 flex justify-center
            transition-colors"
            >
              {children}
            </div>
          </main>
        </div>
      </NavigationProvider>
    </div>
  );
}

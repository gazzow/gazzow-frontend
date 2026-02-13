"use client";

import Navbar from "@/components/layout/admin/Navbar";
import Sidebar from "@/components/layout/admin/Sidebar";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import { useAppSelector } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const isLogin = pathname === ADMIN_ROUTES.LOGIN;

  const router = useRouter();
  const admin = useAppSelector((state) => state.admin);

  useEffect(() => {
    if (!admin.id && !isLogin) {
      router.replace(ADMIN_ROUTES.LOGIN);
    } else if (admin.id && isLogin) {
      router.replace(ADMIN_ROUTES.DASHBOARD);
    }
    setChecking(false);
  }, [router, isLogin, admin]);


  return (
    <div className="flex bg-primary">
      {!isLogin && <Navbar />}

      <div className="flex flex-1 overflow-hidden">
        {!isLogin && <Sidebar />}
        {checking ? (
          <div className="flex h-screen w-screen items-center justify-center text-white">
            Loading...
          </div>
        ) : (
          <main className={`${isLogin ? "" : " mt-16"} flex-1 text-whiteD`}>
            {children}
          </main>
        )}
      </div>
    </div>
  );
}

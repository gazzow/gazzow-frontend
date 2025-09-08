"use client";

import Navbar from "@/components/layout/admin/Navbar";
import Sidebar from "@/components/layout/admin/Sidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <div className="flex bg-primary">
      {!isLogin && <Navbar />}

      <div className="flex flex-1 overflow-hidden">
        {!isLogin && <Sidebar />}

        <main className="flex-1 text-white">{children}</main>
      </div>
    </div>
  );
}

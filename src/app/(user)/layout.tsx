"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { useAppSelector } from "@/store/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const isLogin = usePathname() === '/login';
  const userId = useAppSelector(state => state.user?.id);
  const router = useRouter();



  useEffect(() => {
    if(!userId && !isLogin){
      router.replace('/login')
    }else if(userId && isLogin) {
      router.replace('/home');
    }
  }, [userId, isLogin, router])

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

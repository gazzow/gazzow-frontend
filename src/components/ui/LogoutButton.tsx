"use client";

import { useLogout } from "@/hook/useLogout";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

export function LogoutButton() {
  const { handleLogout } = useLogout();
  const pathname = usePathname();
  const isRootPage = pathname === "/";

  return (
    <button
      onClick={handleLogout}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition cursor-pointer
    ${isRootPage ? "bg-red-500/30" : "hover:bg-gray-200 dark:hover:bg-secondary"}
    text-black dark:text-white`}
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden md:flex">Log out</span>
    </button>
  );
}

"use client";

import { useLogout } from "@/hook/useLogout";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { handleLogout } = useLogout();
  return (
    <button
      onClick={handleLogout}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:text-red-600 hover:bg-red-100 dark:hover:bg-secondary text-black dark:text-white transition transform duration-200`}
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden md:flex">Log out</span>
    </button>
  );
}

"use client";

import { useLogout } from "@/hook/useLogout";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const { handleLogout } = useLogout();

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary/30 hover:text-white transition cursor-pointer"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden md:flex">Logout</span>
    </button>
  );
}

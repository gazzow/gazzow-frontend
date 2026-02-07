"use client";

import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
// import { useTheme } from "@/hook/useTheme";
import Link from "next/link";

export default function Navbar() {
  // const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 w-full z-50  bg-primary backdrop-blur-md border-b border-border-primary/70">
      <div className="max-w-10xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href={ADMIN_ROUTES.DASHBOARD}
          className="text-2xl font-bold text-btn-primary hover:text-btn-primary-hover"
        >
          Gazzow
        </Link>

        {/* Right Side */}
        <div className="flex justify-center items-center text-center gap-4">
          {/* Toggle Theme */}
          <button className="px-4 py3 cursor-pointer">

          </button>
        </div>
      </div>
    </nav>
  );
}

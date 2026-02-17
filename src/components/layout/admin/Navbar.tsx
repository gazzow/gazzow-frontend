"use client";

import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import { useTheme } from "@/hook/useTheme";
import Link from "next/link";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 
  bg-white dark:bg-primary/70 
  backdrop-blur-xl 
  border-b border-gray-200 dark:border-border-primary
  shadow-sm dark:shadow-none
  transition-colors duration-300"
    >
      <div className="max-w-10xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href={ADMIN_ROUTES.DASHBOARD}
          className="
        text-2xl font-bold 
        text-gray-800 dark:text-btn-primary
        hover:text-black dark:hover:text-btn-primary-hover
        transition-colors duration-300
      "
        >
          Gazzow
        </Link>

        {/* Right Side */}
        <div className="flex justify-center items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

"use client";

import { USER_ROUTES } from "@/constants/routes/user-routes";
import { useTheme } from "@/hook/useTheme";
import { MessageSquare, Moon, Sun } from "lucide-react";
import Link from "next/link";
import UserProfileMenu from "../ui/UserProfileMenu";
import { NotificationBellIcon } from "../ui/NotificationBellIcon";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-primary backdrop-blur-md border-b border-border-primary/70 transition ease-in-out">
      <div className="max-w-10xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href={USER_ROUTES.HOME}
          className="text-2xl font-bold text-btn-primary hover:text-btn-primary-hover"
        >
          Gazzow
        </Link>

        {/* Right Side */}
        <div className="flex justify-center items-center text-center gap-3">
          {/* Message Button */}
          {/* <button className="p-2 bg-secondary/70 rounded-xl cursor-pointer hover:bg-secondary transition ease-in-out duration-200 text-text-secondary ">
            <MessageSquare size={24} />
          </button> */}

          {/* Notification Bell */}
          <NotificationBellIcon />

          {/* Toggle Theme */}
          <button
            onClick={toggleTheme}
            className="
    p-2 rounded-xl cursor-pointer
    transition-all duration-200 ease-in-out
    active:scale-95

    bg-slate-100 hover:bg-slate-200
    dark:bg-slate-800 dark:hover:bg-slate-700

    text-slate-700 dark:text-slate-200
    shadow-sm hover:shadow-md
  "
          >
            {theme === "light" ? (
              <Sun size={22} className="text-amber-500" />
            ) : (
              <Moon size={22} className="text-slate-300" />
            )}
          </button>

          <UserProfileMenu />
        </div>
      </div>
    </nav>
  );
}

"use client";

import { USER_ROUTES } from "@/constants/routes/user-routes";
import Link from "next/link";
import UserProfileMenu from "../ui/UserProfileMenu";
import { NotificationBellIcon } from "../ui/NotificationBellIcon";
import { ThemeToggle } from "../ui/ThemeToggle";

export default function Navbar() {

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
          {/* Notification Bell */}
          <NotificationBellIcon />

          {/* Toggle Theme */}
          <ThemeToggle />

          <UserProfileMenu />
        </div>
      </div>
    </nav>
  );
}

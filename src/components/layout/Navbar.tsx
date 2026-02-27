"use client";

import { USER_ROUTES } from "@/constants/routes/user-routes";
import Link from "next/link";
import UserProfileMenu from "../ui/UserProfileMenu";
import { NotificationBellIcon } from "../ui/NotificationBellIcon";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Menu, X } from "lucide-react";
import { useNavigation } from "@/providers/NavigationProvider";

export default function Navbar() {
  const { open, setOpen } = useNavigation();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-primary backdrop-blur-md border-b border-border-primary/70 transition ease-in-out">
      <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16">
        {/* LEFT */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Sidebar Toggle */}
          {open ? (
            <Menu
              onClick={() => setOpen(false)}
              className="text-black dark:text-text-secondary w-5 h-5 sm:w-6 sm:h-6 cursor-pointer md:hidden"
            />
          ) : (
            <Menu
              onClick={() => setOpen(true)}
              className="text-black dark:text-text-secondary w-5 h-5 sm:w-6 sm:h-6 cursor-pointer"
            />
          )}

          {/* Logo */}
          <Link
            href={USER_ROUTES.HOME}
            className="text-lg sm:text-xl md:text-2xl font-bold text-btn-primary hover:text-btn-primary-hover whitespace-nowrap"
          >
            Gazzow
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* Notification */}
          <div className="scale-90 sm:scale-100">
            <NotificationBellIcon />
          </div>

          {/* Theme */}
          <div className="hidden md:flex scale-90 sm:scale-100">
            <ThemeToggle />
          </div>

          {/* Profile */}
          <div className="scale-90 sm:scale-100">
            <UserProfileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

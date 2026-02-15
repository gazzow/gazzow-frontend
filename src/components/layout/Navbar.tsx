"use client";

import { USER_ROUTES } from "@/constants/routes/user-routes";
import Link from "next/link";
import UserProfileMenu from "../ui/UserProfileMenu";
import { NotificationBellIcon } from "../ui/NotificationBellIcon";
import { ThemeToggle } from "../ui/ThemeToggle";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { useEffect } from "react";
import { useNavigation } from "@/providers/NavigationProvider";

export default function Navbar() {
  const { open, setOpen } = useNavigation();
  useEffect(() => {
    console.log(open);
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-primary backdrop-blur-md border-b border-border-primary/70 transition ease-in-out">
      <div className="max-w-10xl mx-auto px-2 sm:px-4 md:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center justify-center gap-5">
          <Link
            href={USER_ROUTES.HOME}
            className="text-xl sm:text-2xl font-bold text-btn-primary hover:text-btn-primary-hover"
          >
            Gazzow
          </Link>
          {open ? (
            <PanelRightOpen
              onClick={() => setOpen(false)}
              className="text-black dark:text-text-secondary mt-1 w-5 h-5 md:w-[18px] md:h-[18px] cursor-pointer"
            ></PanelRightOpen>
          ) : (
            <PanelLeftOpen
              onClick={() => setOpen(true)}
              className="text-black dark:text-text-secondary mt-1 w-5 h-5 md:w-[18px] md:h-[18px] cursor-pointer"
            ></PanelLeftOpen>
          )}
        </div>

        {/* Right Side */}
        <div className="flex justify-center items-center text-center gap-2 md:gap-3">
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

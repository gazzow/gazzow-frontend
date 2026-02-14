"use client";

import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { useAppSelector } from "@/store/store";
import Link from "next/link";
import { ThemeToggle } from "../ui/ThemeToggle";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTheme } from "@/hook/useTheme";

export default function AuthNavbar() {
  const userId = useAppSelector((state) => state.user.id);
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <nav
      className="
      fixed top-0 left-0 w-full z-50
      bg-white dark:bg-primary
      backdrop-blur-md
      border-b border-border-primary/70
    "
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl sm:text-2xl font-bold text-btn-primary hover:text-btn-primary-hover"
        >
          Gazzow
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6 lg:gap-8">
          {["features", "projects", "about"].map((item) => (
            <Link
              key={item}
              href={`#${item}`}
              className="
                text-gray-800 dark:text-text-primary
                hover:text-btn-primary
                transition
              "
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />

          {/* Desktop Auth */}
          <div className="hidden md:block">
            {userId === null ? (
              <Link
                href={AUTH_ROUTES.LOGIN}
                className="px-4 py-2 bg-btn-primary hover:bg-btn-primary-hover text-text-primary rounded-lg"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href={USER_ROUTES.HOME}
                className="px-4 py-2 bg-btn-primary hover:bg-btn-primary-hover text-text-primary rounded-lg"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl dark:bg-secondary"
          >
            {open ? (
              <X  className="w-5 h-5 md:w-[22px] md:h-[22px]" color={theme == "dark" ? "white" : "black"} />
            ) : (
              <Menu className="w-5 h-5 md:w-[22px] md:h-[22px]" color={theme == "dark" ? "white" : "black"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="
          md:hidden
          px-4 pb-4
          bg-white dark:bg-primary
          border-t border-border-primary dark:border-secondary
        "
        >
          <div className="flex flex-col gap-4 pt-4">
            {["features", "projects", "about"].map((item) => (
              <Link
                key={item}
                href={`#${item}`}
                className="text-gray-800 dark:text-text-primary"
                onClick={() => setOpen(false)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Link>
            ))}

            {userId === null ? (
              <Link
                href={AUTH_ROUTES.LOGIN}
                className="px-4 py-2 bg-btn-primary text-text-primary rounded-lg text-center"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href={USER_ROUTES.HOME}
                className="px-4 py-2 bg-btn-primary text-text-primary rounded-lg text-center"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

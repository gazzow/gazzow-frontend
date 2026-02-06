"use client";

import { AUTH_ROUTES } from "@/constants/routes/auth-routes";
import { useTheme } from "@/hook/useTheme";
import { useAppSelector } from "@/store/store";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "../ui/LogoutButton";

export default function AuthNavbar() {
  const { theme, toggleTheme } = useTheme();
  const userId = useAppSelector((state) => state.user.id);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-primary backdrop-blur-md border-b border-border-primary/70">
      <div className="max-w-10xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-btn-primary hover:text-btn-primary-hover"
        >
          Gazzow
        </Link>

        {/* Links */}
        <div className="hidden md:flex gap-8 ">
          <Link
            href="#features"
            className="text-black dark:text-text-primary dark:hover:text-text-secondary"
          >
            Features
          </Link>
          <Link
            href="#projects"
            className="text-black dark:text-text-primary dark:hover:text-text-secondary"
          >
            Projects
          </Link>
          <Link
            href="#about"
            className="text-black dark:text-text-primary dark:hover:text-text-secondary"
          >
            About
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex justify-center items-center text-center gap-4">
          {/* Toggle Theme */}
          <button onClick={toggleTheme} className="px-4 py3">
            {theme === "light" ? (
              <Moon size={18} className="cursor-pointer text-secondary"></Moon>
            ) : (
              <Sun
                size={18}
                className="cursor-pointer dark:text-yellow-400"
              ></Sun>
            )}
          </button>

          {userId === null ? (
            <>
              <Link
                href={AUTH_ROUTES.LOGIN}
                className="text-black dark:text-text-primary dark:hover:text-text-secondary "
              >
                Sign In
              </Link>
              <Link
                href={AUTH_ROUTES.SIGNUP}
                className="px-4 py-2 bg-btn-primary hover:bg-btn-primary-hover text-text-primary rounded-lg"
              >
                Get Started
              </Link>
              ,
            </>
          ) : (
            <LogoutButton></LogoutButton>
          )}
        </div>
      </div>
    </nav>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAppSelector } from "@/store/store";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { PricingButton } from "./PricingButton";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogout } from "@/hook/useLogout";

export default function UserProfileMenu() {
  const { imageUrl, name, email } = useAppSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { handleLogout } = useLogout();

  // Close when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOnProfileClick = () => {
    setOpen(false);
    router.push(USER_ROUTES.PROFILE);
  };

  return (
    <div
      ref={ref}
      className="
    relative rounded-xl
    bg-slate-100 hover:bg-slate-200
    dark:bg-slate-800 dark:hover:bg-slate-700
    transition-all duration-200
  "
    >
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
      flex items-center gap-2 pl-3 pr-1 py-1 rounded-full
      transition cursor-pointer
      hover:bg-slate-200 dark:hover:bg-slate-700
    "
      >
        <span className="text-sm font-medium hidden md:block text-slate-700 dark:text-slate-200">
          {name && name.split(" ").length > 2
            ? name?.split(" ").slice(0, 2).join(" ")
            : name || "Guest"}
        </span>

        <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0 ring-2 ring-white dark:ring-slate-900">
          <Image
            src={imageUrl || "/avatar.png"}
            alt={name || "User"}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="
        absolute right-0 mt-3 w-72 z-50 overflow-hidden p-3
        rounded-xl border shadow-xl

        bg-white border-slate-200
        dark:bg-slate-900 dark:border-slate-700
      "
        >
          {/* User Info */}
          <div className="flex gap-3 items-center pb-3 border-b border-slate-200 dark:border-slate-700">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 ring-2 ring-white dark:ring-slate-800">
              <Image
                src={imageUrl || "/avatar.png"}
                alt={name || "User"}
                fill
                className="object-cover"
                sizes="36px"
              />
            </div>

            <div className="flex flex-col text-slate-800 dark:text-slate-200">
              <p className="text-md font-semibold">{name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {email}
              </p>
            </div>
          </div>

          {/* Premium Button */}
          <div className="py-3 border-b border-slate-200 dark:border-slate-700">
            <PricingButton />
          </div>

          {/* Menu */}
          <div className="pt-2 space-y-1">
            <button
              onClick={handleOnProfileClick}
              className="
            w-full flex items-center gap-2 px-3 py-2 rounded-md
            text-slate-700 dark:text-slate-200
            hover:bg-slate-100 dark:hover:bg-slate-800
            transition cursor-pointer
          "
            >
              <User size={18} />
              <span>Your Profile</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="
            w-full flex items-center gap-2 px-3 py-2 rounded-md
            text-red-600 dark:text-red-400
            hover:bg-red-50 dark:hover:bg-red-900/30
            transition cursor-pointer
          "
            >
              <LogOut size={18} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

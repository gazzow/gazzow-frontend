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
      className="relative bg-secondary/70 rounded-xl hover:bg-secondary transition ease-in-out duration-200 "
    >
      {/* Avatar Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-full hover:bg-muted transition cursor-pointer"
      >
        <span className="text-sm text-white font-medium hidden md:block  ">
          {name && name.split(" ").length > 2
            ? name?.split(" ").slice(0, 2).join(" ")
            : name || "Guest"}
        </span>
        <div className="relative w-8 h-8 rounded-xl overflow-hidden shrink-0">
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
        <div className="absolute right-0 mt-3 w-72 rounded-xl bg-primary dark:bg-background border border-border-primary shadow-xl z-50 overflow-hidden p-2 ">
          {/* User Info */}
          <div className="flex gap-3 items-center">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0">
              <Image
                src={imageUrl || "/avatar.png"}
                alt={name || "User"}
                fill
                className="object-cover "
                sizes="36px"
              />
            </div>
            <div className="flex flex-col items-start justify-center text-white">
              <p className="text-md font-bold">{name}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          {/* Premium Button */}
          <div className="py-3 border-b border-b-gray-600">
            {/* Pricing Button  */}
            <PricingButton />
          </div>

          {/* Menu */}
          <div className="p-2 space-y-1">
            <button
              onClick={handleOnProfileClick}
              className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-md text-text-secondary hover:bg-secondary/70 hover:text-text-primary cursor-pointer transition"
            >
              <User size={18}></User>
              <span>Your Profile</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2 py-1 rounded-md text-md text-text-secondary hover:bg-red-500/40 hover:text-text-primary cursor-pointer transition"
            >
              <LogOut size={18}></LogOut>
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

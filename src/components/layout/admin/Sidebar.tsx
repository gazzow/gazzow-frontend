"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  CalendarClock,
  Star,
  CreditCard,
  Package,
  Wallet,
  Bell,
  ShieldAlert,
  User,
  LogOut,
} from "lucide-react";
import { authService } from "@/services/auth/auth-service";
import { toast } from "react-toastify";
import axios from "axios";
import { useAppDispatch } from "@/store/store";
import { clearAdmin } from "@/store/slices/adminSlice";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";

const sections = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: ADMIN_ROUTES.DASHBOARD,
      },
    ],
  },
  {
    title: "User Management",
    items: [{ label: "Users", icon: Users, href: ADMIN_ROUTES.USER_MANAGEMENT }],
  },
  {
    title: "Project & Tasks",
    items: [
      { label: "Projects", icon: FolderKanban, href: "" },
      { label: "Tasks", icon: CheckSquare, href: "" },
      { label: "Meetings", icon: CalendarClock, href: "" },
      { label: "Reviews", icon: Star, href: "" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Subscriptions", icon: CreditCard, href: "" },
      { label: "Plans", icon: Package, href: "" },
      { label: "Payments", icon: Wallet, href: "" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Notifications", icon: Bell, href: "" },
      { label: "Reports", icon: ShieldAlert, href: "" },
      { label: "Profile", icon: User, href: ADMIN_ROUTES.PROFILE },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await authService.logout();

      toast.success("Logged out successfully");
      dispatch(clearAdmin());
      router.push("/admin/login"); // redirect
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error", error.response?.data);
        toast.error(error.response?.data?.message || "Logout failed");
      }
    }
  };

  return (
    <aside className="h-full mt-16 p-4 flex flex-col bg-primary text-text-secondary border-r border-border-primary/70">
      {sections.map((section) => (
        <div key={section.title} className="mb-4">
          <h4 className="hidden md:flex text-xs uppercase tracking-wide text-gray-500 mb-2">
            {section.title}
          </h4>
          <ul className="space-y-1">
            {section.items.map(({ label, icon: Icon, href }) => {
              const active = pathname === href;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                      active
                        ? "bg-purple-600 text-white"
                        : "hover:bg-secondary/30 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:flex">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-secondary/30 hover:text-white transition cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden md:flex">Logout</span>
      </button>
    </aside>
  );
}

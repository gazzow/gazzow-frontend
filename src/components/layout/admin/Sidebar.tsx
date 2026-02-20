"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CreditCard,
  Package,
  Wallet,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch } from "@/store/store";
import { clearAdmin } from "@/store/slices/adminSlice";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import { adminAuthService } from "@/services/admin/admin-auth.service";
import { handleApiError } from "@/utils/handleApiError";

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
    items: [
      { label: "Users", icon: Users, href: ADMIN_ROUTES.USER_MANAGEMENT },
    ],
  },
  {
    title: "Project Management",
    items: [
      { label: "Projects", icon: FolderKanban, href: ADMIN_ROUTES.PROJECTS },
      // { label: "Reviews", icon: Star, href: "" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Plans", icon: Package, href: ADMIN_ROUTES.PLANS },
      {
        label: "Subscriptions",
        icon: CreditCard,
        href: ADMIN_ROUTES.SUBSCRIPTIONS,
      },
      { label: "transaction", icon: Wallet, href: ADMIN_ROUTES.TRANSACTIONS },
    ],
  },
  // {
  //   title: "Platform",
  //   items: [
  //     { label: "Notifications", icon: Bell, href: "" },
  //     { label: "Reports", icon: ShieldAlert, href: "" },
  //     { label: "Profile", icon: User, href: ADMIN_ROUTES.PROFILE },
  //   ],
  // },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();

      toast.success("Logged out successfully");
      dispatch(clearAdmin());
      router.push(ADMIN_ROUTES.LOGIN);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <aside
      className="
  min-h-screen mt-16 p-4 flex flex-col
  bg-white dark:bg-primary
  text-gray-700 dark:text-text-secondary
  border-r border-gray-200 dark:border-border-primary
  transition-colors duration-300
"
    >
      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          {/* Section Title */}
          <h4
            className="
        hidden md:flex text-xs uppercase tracking-wide 
        text-gray-400 dark:text-gray-500 mb-2 px-2
      "
          >
            {section.title}
          </h4>

          <ul className="space-y-1">
            {section.items.map(({ label, icon: Icon, href }) => {
              const active = pathname === href;

              return (
                <li key={label}>
                  <Link
                    href={href}
                    className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg
                  transition-all duration-200
                  
                  ${
                    active
                      ? `
                      bg-btn-primary
                      text-text-primary 
                      dark:bg-btn-primary
                      shadow-sm
                    `
                      : `
                      hover:bg-gray-100 
                      dark:hover:bg-secondary/30
                      hover:text-gray-900 
                      dark:hover:text-white
                    `
                  }
                `}
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

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="
      flex items-center gap-3 px-3 py-2 rounded-lg
      transition-all duration-200
      hover:bg-gray-100 
      dark:hover:bg-secondary/30
      hover:text-red-600
      dark:hover:text-red-400
      cursor-pointer
    "
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden md:flex">Logout</span>
      </button>
    </aside>
  );
}

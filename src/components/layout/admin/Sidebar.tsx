"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

const sections = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" }],
  },
  {
    title: "User Management",
    items: [
      { label: "Users", icon: Users, href: "/admin/user-management" },
    ],
  },
  {
    title: "Project & Tasks",
    items: [
      { label: "Projects", icon: FolderKanban, href: "#/admin/projects" },
      { label: "Tasks", icon: CheckSquare, href: "#/admin/tasks" },
      { label: "Scheduled Meetings", icon: CalendarClock, href: "#/admin/meetings" },
      { label: "Reviews", icon: Star, href: "#/admin/reviews" },
    ],
  },
  {
    title: "Business",
    items: [
      { label: "Subscriptions", icon: CreditCard, href: "#/admin/subscriptions" },
      { label: "Plans", icon: Package, href: "#/admin/plans" },
      { label: "Payments", icon: Wallet, href: "#/admin/payments" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Notifications", icon: Bell, href: "#/admin/notifications" },
      { label: "Reports & Abuse", icon: ShieldAlert, href: "#/admin/reports" },
      { label: "Profile", icon: User, href: "#/admin/profile" },
      { label: "Logout", icon: LogOut, href: "#/admin/logout" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-w-60 h-full mt-16 p-4 flex flex-col bg-primary text-text-secondary border-r border-border-primary">
      {sections.map((section) => (
        <div key={section.title} className="mb-6">
          <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
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
                        : "hover:bg-secondary hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}

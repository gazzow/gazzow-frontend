"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Star,
  Folder,
  GitPullRequest,
  MessageSquare,
  CreditCard,
  Bell,
  Wallet,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { LogoutButton } from "../ui/LogoutButton";

const sections = [
  { label: "Dashboard", icon: Home, href: "/home" },
  { label: "Projects", icon: Folder, href: "#" },
  { label: "My Contributions", icon: GitPullRequest, href: "#" },
  { label: "Messages", icon: MessageSquare, href: "#" },
  { label: "Subscription", icon: CreditCard, href: "#" },
  { label: "Notifications", icon: Bell, href: "#" },
  { label: "Quick saves", icon: Star, href: "#" },
  { label: "Wallet", icon: Wallet, href: "#" },
  { label: "Profile", icon: User, href: "/profile/me" },
  { label: "Settings", icon: Settings, href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="min-w-60 h-full mt-16 p-4 flex flex-col gap-2 bg-white dark:bg-primary text-primary dark:text-text-secondary border-r border-border-primary/70">
      {sections.map(({ label, icon: Icon, href }) => (
        <ul key={label}>
          <li key={label}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                pathname === href
                  ? "bg-btn-primary text-white"
                  : "hover:bg-secondary/30 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          </li>
        </ul>
      ))}
      <LogoutButton />
    </aside>
  );
}

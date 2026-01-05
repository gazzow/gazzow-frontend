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
} from "lucide-react";
import { LogoutButton } from "../ui/LogoutButton";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { CONTRIBUTOR_ROUTES } from "@/constants/routes/contributor-routes";

const sections = [
  { label: "Dashboard", icon: Home, href: USER_ROUTES.HOME },
  {
    label: "Projects",
    icon: Folder,
    href: PROJECT_ROUTES.BROWSE,
    matchPaths: Object.values(PROJECT_ROUTES),
  },
  {
    label: "Contributions",
    icon: GitPullRequest,
    href: CONTRIBUTOR_ROUTES.ACTIVE,
    matchPaths: Object.values(CONTRIBUTOR_ROUTES),
  },
  // { label: "Messages", icon: MessageSquare, href: "#" },
  { label: "Pricing", icon: CreditCard, href: USER_ROUTES.PRICING },
  { label: "Notifications", icon: Bell, href: USER_ROUTES.NOTIFICATIONS },
  { label: "Favorites", icon: Star, href: USER_ROUTES.FAVORITES },
  // { label: "Wallet", icon: Wallet, href: "#" },
  {
    label: "Profile",
    icon: User,
    href: USER_ROUTES.PROFILE,
    matchPaths: [USER_ROUTES.EDIT_PROFILE],
  },
  // { label: "Settings", icon: Settings, href: "#" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="md:min-w-40 h-full mt-16 p-4 flex flex-col gap-2 bg-white dark:bg-primary text-primary dark:text-text-secondary border-r border-border-primary/70 transition ease-in-out">
      {sections.map(({ label, icon: Icon, href, matchPaths }) => (
        <ul key={label}>
          <li key={label}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                pathname === href ||
                matchPaths?.includes(pathname) ||
                pathname.split("/").includes(label.toLowerCase())
                  ? "bg-btn-primary text-white"
                  : "hover:bg-secondary/30 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:flex">{label}</span>
            </Link>
          </li>
        </ul>
      ))}
      <LogoutButton />
    </aside>
  );
}

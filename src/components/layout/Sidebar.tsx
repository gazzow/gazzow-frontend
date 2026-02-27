"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Star,
  Folder,
  GitPullRequest,
  CreditCard,
  Bell,
  Wallet,
  User,
  PanelRightOpen,
  PanelLeftOpen,
} from "lucide-react";
import { LogoutButton } from "../ui/LogoutButton";
import { USER_ROUTES } from "@/constants/routes/user-routes";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { CONTRIBUTOR_ROUTES } from "@/constants/routes/contributor-routes";
import { useNavigation } from "@/providers/NavigationProvider";

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
  { label: "Transactions", icon: Wallet, href: USER_ROUTES.TRANSACTIONS },
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
  const { open, setOpen } = useNavigation();

  return (
    <aside
      className={`min-h-[90vh] pt-20 px-2 md:px-4 ${
        open ? "flex" : "hidden"
      } flex-col justify-between bg-white dark:bg-primary text-primary dark:text-text-secondary border-r border-border-primary/70 transition ease-in-out`}
    >
      {/* TOP MENU */}
      <div className="flex flex-col gap-2 flex-1">
        {sections.map(({ label, icon: Icon, href, matchPaths }) => (
          <ul key={label}>
            <li>
              <Link
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
                  pathname === href ||
                  matchPaths?.includes(pathname) ||
                  pathname.split("/").includes(label.toLowerCase())
                    ? "bg-btn-primary text-white"
                    : "hover:bg-btn-primary/20 dark:hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:flex">{label}</span>
              </Link>
            </li>
          </ul>
        ))}
      </div>

      {/* BOTTOM FIXED AREA */}
      <div className="flex justify-center items-center gap-4 pb-4">
        {/* Logout */}
          <LogoutButton />

        {/* Sidebar Toggle */}
        <div className="hidden md:flex px-2">
          {open ? (
            <PanelRightOpen
              onClick={() => setOpen(false)}
              className="text-black dark:text-text-secondary w-5 h-5 md:w-[18px] md:h-[16px] cursor-pointer"
            />
          ) : (
            <PanelLeftOpen
              onClick={() => setOpen(true)}
              className="text-black dark:text-text-secondary w-5 h-5 md:w-[18px] md:h-[16px] cursor-pointer"
            />
          )}
        </div>
      </div>
    </aside>
  );
}

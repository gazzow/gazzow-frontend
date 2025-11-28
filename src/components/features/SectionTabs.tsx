"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  name: string;
  href: string;
};
interface ProjectTabsProp {
  tabs: Tab[];
}

export function SectionTabs({ tabs }: ProjectTabsProp) {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-gray-700">
      <div className="flex gap-6 relative">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.name} href={tab.href}>
              <button
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {tab.name}
                {isActive && (
                  <div className="mt-1 h-[2px] bg-purple-500 w-full rounded-full"></div>
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

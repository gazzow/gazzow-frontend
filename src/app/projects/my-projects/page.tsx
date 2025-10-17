"use client";
import ProjectTabs from "@/components/features/ProjectTabs";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { Plus } from "lucide-react";
import Link from "next/link";

const tabs = [
  { name: "Browse Projects", href: PROJECT_ROUTES.BROWSE },
  { name: "My Projects", href: PROJECT_ROUTES.MY_PROJECTS },
];

export default function MyProject() {
  return (
    <div className="max-w-7xl w-full shadow-lg space-y-6">
      <div className="flex justify-between">
        <div>
          <h1 className="text-white font-semibold text-2xl">Projects</h1>
          <p className="text-text-secondary">
            Discover and manage projects that match your expertise
          </p>
        </div>
        <div>
          <Link href={PROJECT_ROUTES.CREATE}>
            <button className="flex gap-2 bg-btn-primary py-2 px-4 rounded-lg cursor-pointer">
              <Plus size={22} />
              Post Project
            </button>
          </Link>
        </div>
      </div>

      {/* Project Tab */}
      <ProjectTabs tabs={tabs} />

      <div className="py-4">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search projects"
            className=" text-gray-300 w-full max-w-md px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <h1>Show created Projects</h1>
        </div>
      </div>
    </div>
  );
}

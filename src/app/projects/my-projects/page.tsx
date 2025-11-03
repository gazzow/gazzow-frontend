"use client";
import CreatedProjectCard from "@/components/features/CreatedProjectCard";
import ProjectTabs from "@/components/features/ProjectTabs";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { projectService } from "@/services/user/project-service";
import { IProject } from "@/types/project";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const tabs = [
  { name: "Browse Projects", href: PROJECT_ROUTES.BROWSE },
  { name: "My Projects", href: PROJECT_ROUTES.MY_PROJECTS },
];

export default function MyProject() {
  const [projects, setProjects] = useState<IProject[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.MyProjects();
        if (res.success) {
          console.log("res data: ", res.data);
          setProjects(res.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      }
    };
    fetchProjects();
  }, []);

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length > 0 ? (
            projects.map((p) => (
              <CreatedProjectCard
                key={p.id}
                id={p.id}
                title={p.title}
                budgetMin={p.budgetMin}
                budgetMax={p.budgetMax}
                durationMin={p.durationMin}
                durationMax={p.durationMax}
                durationUnit={p.durationUnit}
                applicants={12}
                progress={75}
                contributors={p.contributors.length}
                status="Active"
              />
            ))
          ) : (
            <p>No project found</p>
          )}
        </div>
      </div>
    </div>
  );
}

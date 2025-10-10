"use client"

import ProjectCard from "@/components/features/ProjectCard";
import { projectService } from "@/services/user/project-service";
import axios from "axios";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IProject } from "../../types/project";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";


export default function ProjectList() {
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await projectService.listProjects();
        if (res.success) {
          console.log("res data: ", res.data);
          setProjects(res.data);
        }
      } catch (error) {
        if(axios.isAxiosError(error)){
          toast.error(error.response?.data.message)
        }
      }
    };
    fetchProjects();
  }, []);

  const [projects, setProjects] = useState<IProject[]>([]);

  return (
    <div className="max-w-7xl w-full shadow-lg space-y-8">
      <div className="flex justify-between">
        <div>
          <h1 className="text-white font-semibold text-4xl">Projects</h1>
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
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search projects"
            className=" text-gray-300 w-full max-w-md px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.length > 0 ? projects.map((p) => (
            <ProjectCard key={p.id} {...p} />
          )) : 
          <p>No project found</p>
          }
        </div>
      </div>
    </div>
  );
}

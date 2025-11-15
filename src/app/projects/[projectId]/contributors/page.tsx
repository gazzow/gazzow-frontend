"use client";

import ContributorCard from "@/components/features/ContributorCard";
import ProjectTabs from "@/components/features/ProjectTabs";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { projectTabPermissions } from "@/constants/common/tab-permission";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { useRole } from "@/hook/useRole";
import { projectService } from "@/services/user/project-service";
import {
  ContributorStatus,
  IPopulatedContributor,
  IProject,
} from "@/types/project";

import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const tabRoutes = [
  { name: "Overview", path: "" },
  { name: "Applications", path: "/applications" },
  { name: "Contributors", path: "/contributors" },
  { name: "Tasks", path: "/tasks" },
  { name: "Team Chat", path: "/chat" },
  { name: "Meetings", path: "/meetings" },
  { name: "Payments", path: "/payments" },
];

export default function ApplicationsList() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const [project, setProject] = useState<IProject | null>(null);
  const [contributors, setContributors] = useState<
    IPopulatedContributor[] | []
  >([]);

  const currentRole = useRole(project);

  const visibleTabs = useMemo(() => {
    if (!projectId) return [];
    return tabRoutes
      .filter((tab) => projectTabPermissions[currentRole].includes(tab.name))
      .map((tab) => ({
        name: tab.name,
        href: `/projects/${projectId}${tab.path}`,
      }));
  }, [projectId, currentRole]);

  const onBackClick = () => {
    router.replace(PROJECT_ROUTES.MY_PROJECTS);
  };

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        console.log("projectId: ", projectId);

        const res = await projectService.getProject(projectId);
        if (res.success) {
          console.log("res data: ", res.data);
          setProject(res.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      }
    };
    fetchProject();
  }, [projectId]);

  const fetchContributors = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await projectService.listProjectContributors(projectId);

      if (res.success) {
        setContributors(res.data.contributors);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  }, [projectId]);

  useEffect(() => {
    fetchContributors();
  }, [fetchContributors]);

  const handleStatusChange = (id: string, newStatus: ContributorStatus) => {
    if (contributors.length <= 0) return;
    const updatedContributors = contributors?.map((c) =>
      c.userId === id ? { ...c, status: newStatus } : c
    );
    setContributors(updatedContributors);
  };

  if (!projectId) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl w-full shadow-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full">
          <button onClick={onBackClick} className="cursor-pointer">
            <ArrowLeft />
          </button>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-semibold ">
              {project?.title}
            </h1>
            {project?.createdAt && (
              <p className="text-sm text-gray-400">
                Posted {new Date(project?.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ProjectTabs tabs={visibleTabs} />

      {/* Contributors List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contributors?.map((c, index) => (
          <ContributorCard
            key={index}
            contributor={c}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

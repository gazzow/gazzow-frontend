"use client";

import ApplyModal from "@/components/features/ApplyModal";
import { SectionTabs } from "@/components/features/SectionTabs";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { projectTabPermissions } from "@/constants/common/tab-permission";
import { CONTRIBUTOR_ROUTES } from "@/constants/routes/contributor-routes";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { useRole } from "@/hook/useRole";
import { projectService } from "@/services/user/project-service";
import { IProject, Role } from "@/types/project";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Edit,
  Eye,
  Files,
  Trash,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const [project, setProject] = useState<IProject | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);

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

  const onBackClick = () => {
    if (currentRole === Role.CREATOR) {
      router.replace(PROJECT_ROUTES.MY_PROJECTS);
    } else if (currentRole === Role.CONTRIBUTOR) {
      router.replace(CONTRIBUTOR_ROUTES.ACTIVE);
    } else {
      router.replace(PROJECT_ROUTES.BROWSE);
    }
  };

  const handleViewFile = async (fileKey: string) => {
    try {
      const res = await projectService.generateSignedUrl(
        encodeURIComponent(fileKey)
      );

      if (res.success) {
        toast.success(res.message);
      }
      window.open(res.data, "_black", "noopener,noreferrer");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Failed to get signed URL");
      }
    }
  };

  const handleConfirmModal = () => {
    setConfirmModal(true);
  };

  const handleApplyModal = () => {
    setApplyModal(!applyModal);
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
                Posted{" "}
                {new Date(project?.createdAt).toLocaleDateString("en-GB")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <SectionTabs tabs={visibleTabs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="col-span-2 space-y-8">
          {/* Project Description */}
          <div className="bg-secondary/30 border border-border-primary p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Project Description</h2>
            {project?.description && (
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            )}
          </div>

          {/* Required Skills */}
          <div className="bg-secondary/30 border border-border-primary p-6 rounded-2xl shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {project?.requiredSkills &&
                project.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm bg-gray-800 rounded-full border border-gray-700 hover:border-gray-500 cursor-pointer"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>

          {/* Uploaded Documents */}
          {project?.documents && project.documents.length > 0 && (
            <div className="bg-secondary/30 border border-border-primary p-6 rounded-2xl shadow-lg">
              <div className="flex items-center gap-1">
                <Files size={18} />
                <h2 className="text-lg font-semibold">Attachments</h2>
              </div>
              <ul className="mt-3 space-y-2">
                {project.documents.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between bg-secondary px-3 py-4 rounded-lg text-sm text-gray-300"
                  >
                    <span>{file.name}</span>
                    <div className="flex gap-4">
                      <button
                        onClick={() => handleViewFile(file.key)}
                        className="flex gap-2 hover:text-red-300 text-xs cursor-pointer"
                      >
                        <Eye size={18} />
                        <span>view</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Project Info */}
          <div className="bg-secondary/30 border border-border-primary p-6 rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Budget</h2>
              <div className="flex items-center text-gray-300">
                <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                {project?.budgetMax && project?.budgetMin && (
                  <span>
                    {project.budgetMin} - {project.budgetMax}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Duration</h2>
              <div className="flex items-center text-gray-300">
                <Calendar className="w-4 h-4 mr-1 text-blue-400" />
                {project?.durationMin &&
                  project?.durationMax &&
                  project?.durationUnit && (
                    <span>
                      {project.durationMin} - {project.durationMax}{" "}
                      {project.durationUnit}
                    </span>
                  )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Applicants</h2>
              <div className="flex items-center text-gray-300">
                <Users className="w-4 h-4 mr-1 text-purple-400" />
                <span>12 Applied</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Status</h2>
              {project?.status && (
                <span className="text-green-400 font-medium">
                  {project.status.slice(0, 1).toUpperCase() +
                    project.status.slice(1)}
                </span>
              )}
            </div>

            <div className="flex space-x-3">
              {currentRole === Role.CREATOR ? (
                <>
                  <button className="flex-1 flex items-center justify-center gap-2 bg-btn-primary hover:bg-btn-primary-hover text-white py-2 rounded-lg font-medium cursor-pointer">
                    <Edit size={16} />
                    <span>Edit Project</span>
                  </button>
                  <button
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium cursor-pointer"
                    onClick={handleConfirmModal}
                  >
                    <Trash size={16} />
                    <span>Delete</span>
                  </button>
                </>
              ) : currentRole === Role.CONTRIBUTOR ? null : (
                <button
                  className="flex-1 bg-btn-primary hover:bg-btn-primary-hover text-white py-2 rounded-lg font-medium cursor-pointer"
                  onClick={handleApplyModal}
                >
                  Apply to contribute
                </button>
              )}
            </div>
          </div>

          {/* Confirm Delete Modal */}
          {confirmModal && (
            <div className="fixed inset-0 bg-primary/60  flex justify-center items-center">
              <div className="bg-white dark:bg-secondary p-4 rounded shadow flex flex-col">
                <p className="font-bold text-black dark:text-white">
                  Are you sure you want to delete this project?
                </p>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    className="bg-red-400 text-white py-1 px-4 hover:  rounded cursor-pointer"
                    onClick={() => setConfirmModal(false)}
                  >
                    No
                  </button>
                  <button className="bg-green-400 py-1 px-4 rounded text-gray-950 cursor-pointer">
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Apply Modal */}
          {applyModal && (
            <ApplyModal
              projectId={projectId}
              key={projectId}
              closeModal={handleApplyModal}
            ></ApplyModal>
          )}
        </div>
      </div>
    </div>
  );
}

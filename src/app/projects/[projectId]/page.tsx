"use client";

import ApplyModal from "@/components/features/ApplyModal";
import EditProjectModal from "@/components/features/EditProjectModal";
import { InfoRow } from "@/components/features/InfoRow";
import { SectionTabs } from "@/components/features/SectionTabs";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { projectTabPermissions } from "@/constants/common/tab-permission";
import { CONTRIBUTOR_ROUTES } from "@/constants/routes/contributor-routes";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { useRole } from "@/hook/useRole";
import { projectService } from "@/services/user/project-service";
import { userService } from "@/services/user/user-service";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const tabRoutes = [
  { name: "Overview", path: "" },
  { name: "Applications", path: "/applications" },
  { name: "Contributors", path: "/contributors" },
  { name: "Tasks", path: "/tasks" },
  { name: "Team Chat", path: "/chat" },
  // { name: "Payments", path: "/payments" },
];

export default function ProjectDetails() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const [project, setProject] = useState<IProject | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);

  const [editProjectModal, setEditProjectModal] = useState<boolean>(false);

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

  const fetchProject = useCallback(async () => {
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
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

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
        encodeURIComponent(fileKey),
      );

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

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await projectService.deleteProject(id);
      if (res.success) {
        toast.success("Project deleted successfully");
        router.push(PROJECT_ROUTES.MY_PROJECTS);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Failed to delete project");
      }
    }
  };

  const handleApplyClick = async () => {
    try {
      const res = await userService.getUser();
      if (res.success && res.data.stripeAccountId) {
        setApplyModal(true);
      } else {
        toast.info(
          "Please complete your Stripe setup in Settings before applying for jobs. You need to be able to receive payments to work on paid projects.",
          {},
        );
      }
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log("Error fetching user data: ", e.response?.data);
      }
    }
  };

  const handleEditProjectClick = () => {
    setEditProjectModal(true);
  };

  const onProjectEditUpdated = () => {
    setEditProjectModal(true);
    fetchProject();
  };

  if (!projectId) return <LoadingSpinner />;

  const formattedStatus =
    project?.status &&
    project.status.slice(0, 1).toUpperCase() + project.status.slice(1);

  return (
    <div className="max-w-7xl w-full space-y-8 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onBackClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
          >
            <ArrowLeft />
          </button>

          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
              {project?.title}
            </h1>

            {project?.createdAt && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Posted {new Date(project.createdAt).toLocaleDateString("en-GB")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <SectionTabs tabs={visibleTabs} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <div className="col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white border border-gray-200 dark:bg-secondary/30 dark:border-border-primary p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Project Description</h2>

            {project?.description && (
              <p className="text-sm leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-400">
                {project.description}
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-white border border-gray-200 dark:bg-secondary/30 dark:border-border-primary p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Required Skills</h2>

            <div className="flex flex-wrap gap-2">
              {project?.requiredSkills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-sm rounded-full border transition
                    bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200
                    dark:bg-secondary/30 dark:border-border-primary dark:text-gray-300 dark:hover:bg-secondary cursor-pointer"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Attachments */}
          {project?.documents && project?.documents?.length > 0 && (
            <div className="bg-white border border-gray-200 dark:bg-secondary/30 dark:border-border-primary p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <Files size={18} />
                <h2 className="text-lg font-semibold">Attachments</h2>
              </div>

              <ul className="mt-4 space-y-2">
                {project.documents.map((file, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between px-4 py-3 rounded-lg text-sm
                      bg-gray-100 hover:bg-gray-200
                      dark:bg-secondary dark:hover:bg-secondary transition"
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                      {file.name}
                    </span>

                    <button
                      onClick={() => handleViewFile(file.key)}
                      className="flex items-center gap-2 text-xs hover:text-blue-500 cursor-pointer"
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="space-y-6 lg:sticky lg:top-6 h-fit">
          <div className="bg-white border border-gray-200 dark:bg-secondary/30 dark:border-border-primary p-6 rounded-2xl shadow-sm space-y-5">
            {/* Budget */}
            <InfoRow
              icon={<DollarSign className="w-4 h-4 text-green-500" />}
              label="Budget"
              value={
                project?.budgetMin && project?.budgetMax
                  ? `${project.budgetMin} - ${project.budgetMax}`
                  : "-"
              }
            />

            {/* Duration */}
            <InfoRow
              icon={<Calendar className="w-4 h-4 text-blue-500" />}
              label="Duration"
              value={
                project?.durationMin &&
                project?.durationMax &&
                project?.durationUnit
                  ? `${project.durationMin} - ${project.durationMax} ${project.durationUnit}`
                  : "-"
              }
            />

            {/* Applicants */}
            <InfoRow
              icon={<Users className="w-4 h-4 text-purple-500" />}
              label="Applicants"
              value="12 Applied"
            />

            {/* Status */}
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Status</h2>
              <span className="px-2 py-1 text-xs rounded-md font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                {formattedStatus}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-3">
              {currentRole === Role.CREATOR ? (
                <>
                  <button
                    onClick={handleEditProjectClick}
                    className="flex-1 flex items-center justify-center gap-2 bg-btn-primary hover:bg-btn-primary-hover text-white py-2 rounded-lg font-medium transition cursor-pointer"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    onClick={handleConfirmModal}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium transition cursor-pointerD"
                  >
                    <Trash size={16} />
                    Delete
                  </button>
                </>
              ) : currentRole === Role.CONTRIBUTOR ? null : (
                <button
                  onClick={handleApplyClick}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                >
                  Apply to contribute
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="w-full max-w-md bg-white dark:bg-primary border border-gray-200 dark:border-border-primary p-6 rounded-2xl shadow-xl">
            <p className="font-semibold text-lg">
              Are you sure you want to delete this project?
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmModal(false)}
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-secondary dark:hover:bg-secondary/80 cursor-pointer"
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                onClick={() => {
                  console.log("Deleting project with id: ", projectId);
                  handleDeleteProject(projectId);
                  setConfirmModal(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other Modals */}
      {applyModal && (
        <ApplyModal
          projectId={projectId}
          key={projectId}
          closeModal={() => setApplyModal(false)}
        />
      )}

      {editProjectModal && (
        <EditProjectModal
          isOpen={editProjectModal}
          onClose={() => setEditProjectModal(false)}
          onUpdated={onProjectEditUpdated}
          projectId={projectId}
        />
      )}
    </div>
  );
}

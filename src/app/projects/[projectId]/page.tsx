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
import { paymentService } from "@/services/user/payment-service";
import { projectService } from "@/services/user/project-service";
import { IProject, ProjectStatus, Role } from "@/types/project";
import { handleApiError } from "@/utils/handleApiError";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  DollarSign,
  Edit,
  Eye,
  Files,
  Trash,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

  const [project, setProject] = useState<IProject | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [editProjectModal, setEditProjectModal] = useState<boolean>(false);
  const [openStatusModal, setOpenStatusModal] = useState<boolean>(false);
  const statusModalRef = useRef<HTMLDivElement | null>(null);

  const router = useRouter();

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
      const res = await projectService.getProject(projectId);
      if (res.success) {
        setProject(res.data);
      }
    } catch (error) {
      handleApiError(error);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  useEffect(() => {
    const handleMouseDownEvent = (e: MouseEvent) => {
      if (
        statusModalRef.current &&
        !statusModalRef.current.contains(e.target as HTMLElement)
      ) {
        setOpenStatusModal(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDownEvent);

    return () =>
      document.removeEventListener("mousedown", handleMouseDownEvent);
  });

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
      handleApiError(error);
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

  const handleProjectStatusChange = async (status: ProjectStatus) => {
    setOpenStatusModal(false);
    try {
      setProject((prev) => {
        if (!prev) return prev;
        return { ...prev, status };
      });

      const res = await projectService.updateStatus(projectId, status);
      if (!res.success) {
        fetchProject();
      }
    } catch (error) {
      fetchProject();
      handleApiError(error);
    }
  };

  const handleApplyClick = async () => {
    try {
      const res = await paymentService.checkOnboardingStatus();
      if (res.success && res.data.isOnboarded) {
        setApplyModal(true);
      } else {
        toast.warn(
          <p className="text-sm">
            Please complete your Stripe setup in your Profile before posting a
            project. Payment configuration is required to manage project funding
            and transactions.
          </p>,
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

  if (!projectId || !project) return <LoadingSpinner />;

  const formattedStatus =
    project.status.slice(0, 1).toUpperCase() + project.status.slice(1);

  const statusColor =
    project.status === ProjectStatus.OPEN
      ? "text-blue-800 bg-blue-100"
      : project.status === ProjectStatus.COMPLETED
        ? "text-green-800 bg-green-100"
        : "text-yellow-800 bg-yellow-100";

  return (
    <div className="max-w-7xl w-full space-y-8 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onBackClick}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-secondary/30 transition cursor-pointer"
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

            <p className="text-sm leading-relaxed whitespace-pre-line text-gray-600 dark:text-gray-400">
              {project.description}
            </p>
          </div>

          {/* Skills */}
          <div className="bg-white border border-gray-200 dark:bg-secondary/30 dark:border-border-primary p-6 rounded-2xl shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Required Skills</h2>

            <div className="flex flex-wrap gap-2">
              {project.requiredSkills.map((skill, idx) => (
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
          {project.documents.length > 0 && (
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
              value={`${project.budgetMin} - ${project.budgetMax}`}
            />

            {/* Duration */}
            <InfoRow
              icon={<Calendar className="w-4 h-4 text-blue-500" />}
              label="Duration"
              value={`${project.durationMin} - ${project.durationMax} ${project.durationUnit}`}
            />

            {/* Applicants */}
            <InfoRow
              icon={<Users className="w-4 h-4 text-purple-500" />}
              label="Contributors"
              value={project.contributors.length}
            />

            {/* Status */}
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Status</h2>

              <div className="relative">
                <button
                  onClick={() => setOpenStatusModal((prev) => !prev)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                >
                  {formattedStatus}
                  <ChevronDown className="w-4 h-4 text-gray-600 dark:text-white cursor-pointer" />
                </button>

                {openStatusModal && (
                  <div
                    ref={statusModalRef}
                    className="
          absolute right-0 mt-2 w-40
          bg-white dark:bg-secondary
          border border-gray-200 dark:border-border-primary
          rounded-md shadow-lg z-10
        "
                  >
                    {[
                      ProjectStatus.OPEN,
                      ProjectStatus.IN_PROGRESS,
                      ProjectStatus.COMPLETED,
                    ].map((status) => (
                      <button
                        key={status}
                        className="
              w-full text-left px-3 py-2 text-sm
              hover:bg-gray-100 dark:hover:bg-primary/40
              transition cursor-pointer
            "
                        onClick={() => handleProjectStatusChange(status)}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 ">
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
                  className="flex-1 bg-btn-primary hover:bg-btn-primary-hover text-white py-2 rounded-lg font-medium cursor-pointer transition"
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

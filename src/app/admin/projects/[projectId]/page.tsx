"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { projectManagementService } from "@/services/admin/project-management";
import axios from "axios";
import { toast } from "react-toastify";
import { IProject } from "@/types/project";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Eye,
  Files,
  Trash,
} from "lucide-react";
import { projectService } from "@/services/user/project-service";
import { ADMIN_ROUTES } from "@/constants/routes/admin-routes";
import ConfirmModal from "@/components/features/ConfirmModal";

export default function AdminProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();

  const router = useRouter();

  const [project, setProject] = useState<IProject | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        console.log("projectId: ", projectId);
        const res = await projectManagementService.getProjectDetails(projectId);
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

  const onBackClick = () => {
    router.replace(ADMIN_ROUTES.PROJECTS);
  };

  const handleConfirmModal = () => {
    setConfirmModal(true);
  };

  if (!project) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="max-w-7xl shadow-lg space-y-6 p-8 text-white">
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
        <section className="space-y-6">
          {/* Project Info */}
          <div className="bg-secondary/30 border border-border-primary p-6 rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Budget</h2>
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
              <h2 className="text-lg font-semibold">Contributors</h2>
              {project?.contributors.length > 0 ? (
                <span className="font-medium ">
                  {project.contributors.length}
                </span>
              ) : (
                0
              )}
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Status</h2>
              {project?.status && (
                <span className="text-green-400 font-medium uppercase">
                  {project.status}
                </span>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium cursor-pointer"
                onClick={handleConfirmModal}
              >
                <Trash size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Confirm Delete Modal */}
          {confirmModal && (
            <ConfirmModal
              title="Delete Project"
              message="Are you sure you want to delete this project?"
              cancelLabel="Cancel"
              confirmLabel="Yes, delete"
              onCancel={() => setConfirmModal(!confirmModal)}
            />
          )}
        </section>
      </div>
    </div>
  );
}

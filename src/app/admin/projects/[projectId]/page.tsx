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

export default function AdminProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();

  const router = useRouter();

  const [project, setProject] = useState<IProject | null>(null);

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
        encodeURIComponent(fileKey),
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

  if (!project) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div
      className="
  max-w-7xl mx-auto p-8 space-y-6
  bg-gray-50 dark:bg-transparent
  text-gray-800 dark:text-white
  transition-colors duration-300
"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full">
          <button
            onClick={onBackClick}
            className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft />
          </button>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white">
              {project?.title}
            </h1>

            {project?.createdAt && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Posted{" "}
                {new Date(project?.createdAt).toLocaleDateString("en-GB")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SECTION */}
        <div className="col-span-2 space-y-8">
          {/* Description */}
          <div
            className="
        bg-white dark:bg-secondary/20
        border border-gray-200 dark:border-border-primary
        p-6 rounded-2xl shadow-sm dark:shadow-none
      "
          >
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Project Description
            </h2>

            {project?.description && (
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            )}
          </div>

          {/* Skills */}
          <div
            className="
        bg-white dark:bg-secondary/20
        border border-gray-200 dark:border-border-primary
        p-6 rounded-2xl shadow-sm dark:shadow-none
      "
          >
            <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {project?.requiredSkills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="
              px-3 py-1 text-sm rounded-full
              bg-gray-100 dark:bg-gray-700
              text-gray-700 dark:text-gray-200
              border border-gray-200 dark:border-gray-600
            "
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Attachments */}
          {project?.documents?.length > 0 && (
            <div
              className="
          bg-white dark:bg-secondary/20
          border border-gray-200 dark:border-border-primary
          p-6 rounded-2xl shadow-sm dark:shadow-none
        "
            >
              <div className="flex items-center gap-2 mb-3">
                <Files size={18} />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Attachments
                </h2>
              </div>

              <ul className="space-y-2">
                {project.documents.map((file, i) => (
                  <li
                    key={i}
                    className="
                flex items-center justify-between
                bg-gray-100 dark:bg-secondary
                px-4 py-3 rounded-lg text-sm
                text-gray-700 dark:text-gray-300
              "
                  >
                    <span>{file.name}</span>

                    <button
                      onClick={() => handleViewFile(file.key)}
                      className="flex gap-2 text-xs hover:text-btn-primary cursor-pointer"
                    >
                      <Eye size={16} />
                      view
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <section className="space-y-6">
          <div
            className="
        bg-white dark:bg-secondary/20
        border border-gray-200 dark:border-border-primary
        p-6 rounded-2xl shadow-sm dark:shadow-none
        space-y-4
      "
          >
            {/* Budget */}
            <div className="flex justify-between">
              <h2 className="font-semibold text-gray-800 dark:text-white">
                Budget
              </h2>
              <span className="flex items-center text-gray-600 dark:text-gray-300">
                <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                {project?.budgetMin} - {project?.budgetMax}
              </span>
            </div>

            {/* Duration */}
            <div className="flex justify-between">
              <h2 className="font-semibold text-gray-800 dark:text-white">
                Duration
              </h2>
              <span className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 mr-1 text-blue-500" />
                {project?.durationMin} - {project?.durationMax}{" "}
                {project?.durationUnit}
              </span>
            </div>

            {/* Contributors */}
            <div className="flex justify-between">
              <h2 className="font-semibold text-gray-800 dark:text-white">
                Contributors
              </h2>
              <span>{project?.contributors?.length || 0}</span>
            </div>

            {/* Status */}
            <div className="flex justify-between">
              <h2 className="font-semibold text-gray-800 dark:text-white">
                Status
              </h2>
              <span className="text-green-500 font-medium uppercase">
                {project?.status}
              </span>
            </div>

            {/* Delete */}
            <div className="pt-4">
              <button
                className="
            w-full flex items-center justify-center gap-2
            bg-red-500 hover:bg-red-600
            text-white py-2 rounded-lg font-medium
            transition cursor-pointer
          "
              >
                <Trash size={16} />
                Delete
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

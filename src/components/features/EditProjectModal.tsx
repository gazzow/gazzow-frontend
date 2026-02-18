"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectService } from "@/services/user/project-service";
import SkillSelector from "@/components/ui/SkillSelector";
import ProjectFileUpload from "@/components/features/FileUpload";
import { toast } from "react-toastify";
import axios from "axios";
import { EditProjectInput, editProjectSchema } from "@/validators/edit-project";
import { IProject } from "@/types/project";

interface Props {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void;
}

const experiences = ["beginner", "intermediate", "expert"];

export default function EditProjectModal({
  projectId,
  isOpen,
  onClose,
  onUpdated,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditProjectInput>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: {
      requiredSkills: [],
    },
  });

  const selectedSkills = watch("requiredSkills");

  // Load project when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchProject = async () => {
      try {
        const res = await projectService.getProject(projectId);
        const p = res.data;

        reset({
          title: p.title,
          description: p.description,
          requiredSkills: p.requiredSkills,
          visibility: p.visibility,
          developersNeeded: String(p.developersNeeded), // Convert to string
          experience: p.experience,
          budgetMin: String(p.budgetMin), // Convert to string
          budgetMax: String(p.budgetMax), // Convert to string
          durationMin: String(p.durationMin), // Convert to string
          durationMax: String(p.durationMax), // Convert to string
          durationUnit: p.durationUnit,
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message || "Failed to load project");
        } else {
          toast.error("Failed to load project");
        }
      }
    };

    fetchProject();
  }, [isOpen, projectId, reset]);

  const onSubmit = async (values: EditProjectInput) => {
    try {
      setLoading(true);

      const data = {
        ...values,
        developersNeeded: Number(values.developersNeeded),
        budgetMin: Number(values.budgetMin),
        budgetMax: Number(values.budgetMax),
        durationMin: Number(values.durationMin),
        durationMax: Number(values.durationMax),
      };
      console.log(data);
      console.log("======================================");
      console.log("converting data to form");
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "projectDocuments" || value === undefined || value === null)
          return;
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, String(v)));
        } else {
          formData.append(key, String(value));
        }
      });

      if (files.length) {
        files.forEach((file) => {
          formData.append("files", file);
        });
      }

      console.log("======================================");
      console.log(formData);

      const res = await projectService.updateProject(
        projectId,
        data as IProject,
      );
      if (res.success) {
        toast.success(res.message || "Project updated");
        onUpdated();
        onClose();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Failed to update project");
      } else {
        toast.error("Failed to update project");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-6xl max-h-[92vh] overflow-y-auto custom-scroll
    bg-white dark:bg-[#0b1220]
    text-gray-900 dark:text-gray-100
    rounded-xl sm:rounded-2xl
    p-5 sm:p-8 md:p-10
    border border-gray-200 dark:border-[#1f2937]
    shadow-xl transition-colors"
      >
        {/* Header */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-1">
          Edit Project
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8">
          Update the details of your project.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10 sm:space-y-12"
        >
          {/* Basic Information */}
          <section className="space-y-5 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-medium border-b pb-2 border-gray-200 dark:border-gray-700">
              Basic Information
            </h3>

            {/* Title */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                Project Title
              </label>
              <input
                {...register("title")}
                placeholder="Enter your project title"
                className="w-full rounded-lg p-3 text-sm
            bg-gray-50 dark:bg-[#0f1624]
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            border border-gray-300 dark:border-[#1f2937]
            focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                Project Description
              </label>
              <textarea
                {...register("description")}
                rows={6}
                placeholder="Describe your project"
                className="w-full rounded-lg p-3 text-sm resize-none
            bg-gray-50 dark:bg-[#0f1624]
            text-gray-900 dark:text-white
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            border border-gray-300 dark:border-[#1f2937]
            focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <SkillSelector
              requiredSkills={selectedSkills}
              setRequiredSkills={(skills) =>
                setValue("requiredSkills", skills, { shouldValidate: true })
              }
              errors={errors}
            />

            {/* Visibility + Developers + Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Visibility */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Visibility
                </label>
                <div className="flex gap-4 text-gray-700 dark:text-gray-300">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="public"
                      {...register("visibility")}
                      className="accent-purple-500 cursor-pointer"
                    />
                    Public
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="invite"
                      {...register("visibility")}
                      className="accent-purple-500 cursor-pointer"
                    />
                    Invite
                  </label>
                </div>
              </div>

              {/* Developers */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Developers Needed
                </label>
                <input
                  {...register("developersNeeded")}
                  placeholder="e.g., 6"
                  className="w-full rounded-lg p-3 text-sm
              bg-gray-50 dark:bg-[#0f1624]
              border border-gray-300 dark:border-[#1f2937]
              focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Experience Level
                </label>
                <select
                  {...register("experience")}
                  className="w-full rounded-lg p-3 text-sm
              bg-gray-50 dark:bg-[#0f1624]
              border border-gray-300 dark:border-[#1f2937]
              focus:ring-2 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="">Select Experience</option>
                  {experiences.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp[0].toUpperCase() + exp.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Budget & Timeline */}
          <section className="space-y-5 sm:space-y-6">
            <h3 className="text-lg sm:text-xl font-medium border-b pb-2 border-gray-200 dark:border-gray-700">
              Budget & Timeline
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Budget Range ($)
                </label>
                <div className="flex gap-3">
                  <input
                    {...register("budgetMin")}
                    placeholder="Min"
                    className="flex-1 rounded-lg p-3 text-sm bg-gray-50 dark:bg-[#0f1624] border border-gray-300 dark:border-[#1f2937] focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    {...register("budgetMax")}
                    placeholder="Max"
                    className="flex-1 rounded-lg p-3 text-sm bg-gray-50 dark:bg-[#0f1624] border border-gray-300 dark:border-[#1f2937] focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Project Duration
                </label>
                <div className="flex gap-3">
                  <input
                    {...register("durationMin")}
                    placeholder="Min"
                    className="flex-1 rounded-lg p-3 text-sm bg-gray-50 dark:bg-[#0f1624] border border-gray-300 dark:border-[#1f2937] focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    {...register("durationMax")}
                    placeholder="Max"
                    className="flex-1 rounded-lg p-3 text-sm bg-gray-50 dark:bg-[#0f1624] border border-gray-300 dark:border-[#1f2937] focus:ring-2 focus:ring-purple-500"
                  />
                  <select
                    {...register("durationUnit")}
                    className="flex-1 rounded-lg p-3 text-sm bg-gray-50 dark:bg-[#0f1624] border border-gray-300 dark:border-[#1f2937]  cursor-pointer focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Unit</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <ProjectFileUpload
            label="Add more documents"
            onFilesChange={setFiles}
          />

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg
          bg-gray-200 dark:bg-gray-700
          text-gray-900 dark:text-white
          hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg
          bg-purple-600 text-white
          hover:bg-purple-700
          disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

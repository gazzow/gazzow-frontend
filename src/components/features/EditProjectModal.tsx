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
        data as IProject
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-gray-900/95 w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl p-10 border border-gray-800 shadow-xl m-4">
        <h2 className="text-3xl font-semibold text-white mb-2">Edit Project</h2>
        <p className="text-gray-400 text-sm mb-8">
          Update the details of your project.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Basic Information */}
          <section className="space-y-6">
            <h3 className="text-xl font-medium text-white border-b border-gray-700 pb-2">
              Basic Information
            </h3>

            {/* Title */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Project Title
              </label>
              <input
                {...register("title")}
                placeholder="Enter your project title"
                className="w-full rounded-lg bg-gray-800 p-3 text-sm text-white placeholder-gray-500 outline-none border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Project Description
              </label>
              <textarea
                {...register("description")}
                rows={8}
                placeholder="Describe your project"
                className="w-full rounded-lg bg-gray-800 p-3 text-sm text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Required Skills */}
            <SkillSelector
              requiredSkills={selectedSkills}
              setRequiredSkills={(skills) =>
                setValue("requiredSkills", skills, { shouldValidate: true })
              }
              errors={errors}
            />

            {/* Visibility, Developers, Experience */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Visibility */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Visibility
                </label>
                <div className="flex gap-4 text-gray-300">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="public"
                      {...register("visibility")}
                      className="accent-purple-500"
                    />
                    Public
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="invite"
                      {...register("visibility")}
                      className="accent-purple-500"
                    />
                    Invite
                  </label>
                </div>
                {errors.visibility && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.visibility.message}
                  </p>
                )}
              </div>

              {/* Developers */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Developers Needed
                </label>
                <input
                  type="text"
                  {...register("developersNeeded")}
                  placeholder="e.g., 6"
                  className="w-full rounded-lg bg-gray-800 p-3 text-sm text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                {errors.developersNeeded && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.developersNeeded.message}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Experience Level
                </label>
                <select
                  {...register("experience")}
                  className="w-full rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select Experience</option>
                  {experiences.map((exp) => (
                    <option key={exp} value={exp}>
                      {exp[0].toUpperCase() + exp.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.experience && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Budget & Timeline */}
          <section className="space-y-6">
            <h3 className="text-xl font-medium text-white border-b border-gray-700 pb-2">
              Budget & Timeline
            </h3>

            <div className="flex flex-row flex-wrap gap-6">
              {/* Budget Range */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Budget Range ($)
                </label>
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    {...register("budgetMin")}
                    placeholder="Min e.g., 8000"
                    className="flex-1 rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <input
                    type="text"
                    {...register("budgetMax")}
                    placeholder="Max e.g., 12000"
                    className="flex-1 rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                {(errors.budgetMin || errors.budgetMax) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.budgetMin?.message || errors.budgetMax?.message}
                  </p>
                )}
              </div>

              {/* Duration Range */}
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-2">
                  Project Duration
                </label>
                <div className="flex flex-wrap gap-3">
                  {/* Min Duration */}
                  <div className="flex-1 flex flex-col">
                    <input
                      type="text"
                      {...register("durationMin")}
                      placeholder="Min e.g., 1"
                      className="rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {errors.durationMin && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.durationMin?.message}
                      </p>
                    )}
                  </div>

                  {/* Max Duration */}
                  <div className="flex-1 flex flex-col">
                    <input
                      type="text"
                      {...register("durationMax")}
                      placeholder="Max e.g., 3"
                      className="rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    {errors.durationMax && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.durationMax?.message}
                      </p>
                    )}
                  </div>

                  {/* Duration Unit */}
                  <div className="flex-1 flex flex-col">
                    <select
                      {...register("durationUnit")}
                      className="rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select Unit</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                    {errors.durationUnit && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.durationUnit?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Upload Documents */}
          <ProjectFileUpload
            label="Add more documents"
            onFilesChange={setFiles}
          />

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

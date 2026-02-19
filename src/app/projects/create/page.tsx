"use client";

import ProjectFileUpload from "@/components/features/FileUpload";
import SkillSelector from "@/components/ui/SkillSelector";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { projectService } from "@/services/user/project-service";
import { handleApiError } from "@/utils/handleApiError";
import {
  CreateProjectInput,
  createProjectSchema,
} from "@/validators/project-create";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const experiences = ["beginner", "intermediate", "expert"];

export default function CreateProjectPage() {
  const router = useRouter();

  const [files, setFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isLoading },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      requiredSkills: [],
    },
  });

  const selectedSkills = watch("requiredSkills");

  const onSubmit = async (values: CreateProjectInput) => {
    const data = {
      ...values,
      developersNeeded: values.developersNeeded,
      budgetMin: values.budgetMin,
      budgetMax: values.budgetMax,
      durationMin: values.durationMin,
      durationMax: values.durationMax,
    };

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "projectDocuments" || value === undefined || value === null)
        return;
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, String(v)));
      } else {
        formData.append(key, String(value));
      }
    });

    if (files.length) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const res = await projectService.createProject(formData);
      if (res.success) {
        toast.success(res.message);
        router.replace(PROJECT_ROUTES.BROWSE);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 space-y-8 sm:space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-1">
          Create New Project
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Fill in the details to publish your project for developers to join.
        </p>
      </div>

      {/* Form Container */}
      <div
        className="bg-white dark:bg-secondary/20
  p-5 sm:p-8 md:p-10
  rounded-xl sm:rounded-2xl
  border border-gray-200 dark:border-[#1f2937]
  shadow-md transition ease-in-out"
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-10 sm:space-y-12"
        >
          {/* Basic Information */}
          <section className="space-y-5 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-medium text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">
              Basic Information
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                Project Title
              </label>
              <input
                {...register("title")}
                placeholder="Enter your project title"
                className="w-full rounded-lg p-3 text-sm
            bg-gray-50 dark:bg-secondary/20
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
            bg-gray-50 dark:bg-secondary/20
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
                {errors.developersNeeded && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.developersNeeded.message}
                  </p>
                )}
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
              focus:ring-2 focus:ring-purple-500"
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
            <h3 className="text-lg sm:text-xl font-medium border-b pb-2 border-gray-200 dark:border-gray-700">
              Budget & Timeline
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Budget */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-600 dark:text-gray-400">
                  Budget Range ($)
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <input
                      {...register("budgetMin")}
                      type="number"
                      placeholder="Min"
                      className="w-full rounded-lg p-3 text-sm
            bg-gray-50 dark:bg-[#0f1624]
            border border-gray-300 dark:border-[#1f2937]
            focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.budgetMin && (
                      <p className="text-red-500 text-xs">
                        {errors.budgetMin.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <input
                      {...register("budgetMax")}
                      type="number"
                      placeholder="Max"
                      className="w-full rounded-lg p-3 text-sm
            bg-gray-50 dark:bg-[#0f1624]
            border border-gray-300 dark:border-[#1f2937]
            focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.budgetMax && (
                      <p className="text-red-500 text-xs">
                        {errors.budgetMax.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-sm text-gray-600 dark:text-gray-400">
                  Project Duration
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <input
                      {...register("durationMin")}
                      placeholder="Min"
                      className="w-full rounded-lg p-3 text-sm
            bg-gray-50 dark:bg-[#0f1624]
            border border-gray-300 dark:border-[#1f2937]
            focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.durationMin && (
                      <p className="text-red-500 text-xs">
                        {errors.durationMin.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <input
                      {...register("durationMax")}
                      placeholder="Max"
                      className="w-full rounded-lg p-3 text-sm
            bg-gray-50 dark:bg-[#0f1624]
            border border-gray-300 dark:border-[#1f2937]
            focus:ring-2 focus:ring-purple-500"
                    />
                    {errors.durationMax && (
                      <p className="text-red-500 text-xs">
                        {errors.durationMax.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <select
                      {...register("durationUnit")}
                      className="w-full rounded-lg p-3 text-sm
            bg-gray-50 dark:bg-[#0f1624]
            border border-gray-300 dark:border-[#1f2937]
            focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Unit</option>
                      <option value="weeks">Weeks</option>
                      <option value="months">Months</option>
                    </select>
                    {errors.durationUnit && (
                      <p className="text-red-500 text-xs">
                        {errors.durationUnit.message}
                      </p>
                    )}
                  </div>
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
              onClick={onCancel}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg
          bg-gray-200 dark:bg-gray-700
          text-gray-900 dark:text-white
          hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg
          bg-purple-600 text-white
          hover:bg-purple-700
          disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

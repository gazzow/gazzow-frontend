"use client";

import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { projectService } from "@/services/user/project-service";
import {
  CreateProjectInput,
  createProjectSchema,
} from "@/validators/project-create";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const techOptions = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "TailwindCSS",
];

const experiences = ["beginner", "intermediate", "expert"];

export default function CreateProjectPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      requiredSkills: [],
    },
  });

  const requiredSkills = watch("requiredSkills");

  const handleTechToggle = (tech: string) => {
    const current = getValues("requiredSkills");
    if (current.includes(tech)) {
      setValue(
        "requiredSkills",
        current.filter((t) => t !== tech),
        { shouldValidate: true }
      );
    } else {
      setValue("requiredSkills", [...current, tech], { shouldValidate: true });
    }
  };

  const onSubmit = async (values: CreateProjectInput) => {
    const data = {
      ...values,
      developersNeeded: Number(values.developersNeeded),
      budgetMin: Number(values.budgetMin),
      budgetMax: Number(values.budgetMax),
      durationMin: Number(values.durationMin),
      durationMax: Number(values.durationMax),
    };
    console.log("New Project Data:", data);
    try {
      const res = await projectService.createProject(data);
      if (res.success) {
        toast.success(res.message);
        router.replace(PROJECT_ROUTES.BROWSE);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "create project error");
      }
    }
  };

  const onCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-6xl mx-auto w-full px-6  space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold text-white mb-2">
          Create New Project
        </h1>
        <p className="text-gray-400 text-sm">
          Fill in the details to publish your project for developers to join.
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-gray-900/60 p-10 rounded-2xl shadow-lg border border-gray-800">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Basic Information */}
          <section className="space-y-6">
            <h2 className="text-xl font-medium text-white border-b border-gray-700 pb-2">
              Basic Information
            </h2>

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
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {techOptions.map((tech) => (
                  <button
                    type="button"
                    key={tech}
                    onClick={() => handleTechToggle(tech)}
                    className={`px-3 py-1.5 rounded-full text-sm transition ${
                      requiredSkills.includes(tech)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
              {errors.requiredSkills && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.requiredSkills.message}
                </p>
              )}
            </div>

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
                  type="number"
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
            <h2 className="text-xl font-medium text-white border-b border-gray-700 pb-2">
              Budget & Timeline
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Budget Range */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Budget Range ($)
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    {...register("budgetMin")}
                    placeholder="Min e.g., 8000"
                    className="w-1/2 rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <input
                    type="number"
                    {...register("budgetMax")}
                    placeholder="Max e.g., 12000"
                    className="w-1/2 rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                {(errors.budgetMin || errors.budgetMax) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.budgetMin?.message || errors.budgetMax?.message}
                  </p>
                )}
              </div>

              {/* Duration Range */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Project Duration
                </label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    {...register("durationMin")}
                    placeholder="Min e.g., 1"
                    className="w-1/3 rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <input
                    type="number"
                    {...register("durationMax")}
                    placeholder="Max e.g., 3"
                    className="w-1/3 rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <select
                    {...register("durationUnit")}
                    className="w-1/3 rounded-lg bg-gray-800 p-3 text-sm text-white border border-gray-700 focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Unit</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
                {(errors.durationMin ||
                  errors.durationMax ||
                  errors.durationUnit) && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.durationMin?.message ||
                      errors.durationMax?.message ||
                      errors.durationUnit?.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-800">
            <button
              type="reset"
              className="px-6 py-2.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition cursor-pointer"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer"
            >
              Post Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

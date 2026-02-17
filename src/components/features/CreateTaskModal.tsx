"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTaskInput, createTaskSchema } from "@/validators/task-create";
import { projectService } from "@/services/user/project-service";
import axios from "axios";
import { toast } from "react-toastify";
import { TaskPriority } from "@/types/task";
import { IContributor } from "@/types/contributor";
import ProjectFileUpload from "./FileUpload";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: FormData) => void;
  projectId: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  projectId,
}: CreateTaskModalProps) {
  const [contributors, setContributors] = useState<IContributor[]>([]);
  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);
  const [files, setFiles] = useState<File[]>([]);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      assigneeId: "",
      estimatedHours: 0,
      dueDate: "",
      priority: "",
    },
  });
  const assigneeId = useWatch({ control, name: "assigneeId" });
  const estimatedHours = useWatch({ control, name: "estimatedHours" });

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
    const handleMouseDownEvent = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as HTMLElement)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleMouseDownEvent);

    return () =>
      document.removeEventListener("mousedown", handleMouseDownEvent);
  }, [onClose]);

  useEffect(() => {
    fetchContributors();
  }, [fetchContributors]);

  useEffect(() => {
    if (!contributors.length) return;
    const contributor = contributors.find((c) => c.userId === assigneeId);

    const hours = Number(estimatedHours);

    if (contributor && !isNaN(hours) && hours > 0) {
      const total = contributor.expectedRate * hours;
      console.log("💰 total payable amount:", total);
      setCalculatedAmount(total);
    } else {
      setCalculatedAmount(0);
    }
  }, [assigneeId, estimatedHours, contributors, setCalculatedAmount]);

  const handleFormSubmit = (values: CreateTaskInput) => {
    const assignee = contributors.find((c) => c.userId === values.assigneeId);
    const expectedRate = assignee?.expectedRate ?? 0;

    const data = {
      ...values,
      expectedRate,
    };
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
    onSubmit(formData);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm 
  flex items-center justify-center
"
    >
      <div
        className="bg-white dark:bg-secondary text-gray-800 dark:text-white 
  w-full max-w-lg
  h-[90vh]
  rounded-xl shadow-2xl
  border border-gray-200 dark:border-border-primary
  flex flex-col
"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-border-primary px-5 py-4 shrink-0">
          <h2 className="text-lg font-semibold">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Scrollable Body */}
          <div className="p-5 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
            {/* Task Title */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Task Title
              </label>
              <input
                type="text"
                placeholder="Enter task title"
                {...register("title")}
                className={`w-full rounded-md border px-3 py-2 
            bg-white dark:bg-gray-800
            focus:outline-none focus:ring-2 transition
            ${
              errors.title
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-primary"
            }`}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 
            bg-white dark:bg-gray-800
            px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Assign To + Estimated Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Assign To
                </label>
                <select
                  {...register("assigneeId")}
                  className={`w-full rounded-md border px-3 py-2
              bg-white dark:bg-gray-800
              focus:outline-none focus:ring-2 transition
              ${
                errors.assigneeId
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-primary"
              }`}
                >
                  <option value="">Select contributor</option>
                  {contributors.map((c) => (
                    <option key={c.userId} value={c.userId}>
                      {c.name} — {c.expectedRate}/hr
                    </option>
                  ))}
                </select>

                {errors.assigneeId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.assigneeId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Estimated Hours
                </label>
                <input
                  type="number"
                  min="0"
                  {...register("estimatedHours", { valueAsNumber: true })}
                  className={`w-full rounded-md border px-3 py-2 
              bg-white dark:bg-gray-800
              focus:outline-none focus:ring-2 transition
              ${
                errors.estimatedHours
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-primary"
              }`}
                />
                {errors.estimatedHours && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.estimatedHours.message}
                  </p>
                )}
              </div>
            </div>

            {/* Payable */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Payable Amount:
              </span>
              <span className="text-base font-semibold text-green-500">
                $ {calculatedAmount.toLocaleString("en-IN")}
              </span>
            </div>

            {/* Due Date + Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  {...register("dueDate")}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800
              px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Priority
                </label>
                <select
                  {...register("priority")}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 
              bg-white dark:bg-gray-800
              px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary transition"
                >
                  <option value="">Select priority</option>
                  {Object.values(TaskPriority).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
                {errors.priority && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            <ProjectFileUpload label="Attachments" onFilesChange={setFiles} />
          </div>

          {/* Sticky Footer */}
          <div className="px-5 py-4 rounded-xl border-t border-gray-200 dark:border-border-primary bg-white dark:bg-secondary shrink-0 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-md text-white font-medium 
          bg-btn-primary hover:bg-btn-primary-hover transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

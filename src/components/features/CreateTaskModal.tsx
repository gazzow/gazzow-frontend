"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateTaskInput, createTaskSchema } from "@/validators/task-create";
import { ContributorStatus } from "@/types/project";
import { projectService } from "@/services/user/project-service";
import axios from "axios";
import { toast } from "react-toastify";
import { TaskPriority } from "@/types/task";

interface Contributor {
  id: string;
  userId: string;
  name: string;
  email: string;
  status: ContributorStatus;
  imageUrl: string;
  expectedRate: number;
  developerRole: string;
  invitedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: CreateTaskInput & { expectedRate: number }) => void;
  projectId: string;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  projectId,
}: CreateTaskModalProps) {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  const [calculatedAmount, setCalculatedAmount] = useState<number>(0);

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
    fetchContributors();
  }, [fetchContributors]);

  useEffect(() => {
    if (!contributors.length || !assigneeId) return;
    const contributor = contributors.find((c) => c.userId === assigneeId);

    const hours = Number(estimatedHours);

    if (contributor && !isNaN(hours) && hours > 0) {
      const total = contributor.expectedRate * hours;
      console.log("💰 total payable amount:", total);
      setCalculatedAmount(total);
    } else {
      setCalculatedAmount(0);
    }
  }, [assigneeId, estimatedHours, contributors]);

  const handleFormSubmit = (data: CreateTaskInput) => {
    const assignee = contributors.find((c) => c.userId === data.assigneeId);
    const expectedRate = assignee?.expectedRate ?? 0;

    onSubmit({ ...data, expectedRate });
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-secondary text-white w-full max-w-lg rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-border-primary px-6 py-4">
          <h2 className="text-lg font-semibold ">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-200 hover:text-gray-300 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="p-6 space-y-4"
        >
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium  mb-1">
              Task Title
            </label>
            <input
              type="text"
              placeholder="Enter task title"
              {...register("title")}
              className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:border-0 focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-500 focus:ring-[#9333EA]"
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
            <label className="block text-sm font-medium  mb-1">
              Description
            </label>
            <textarea
              placeholder="Describe the task in detail"
              {...register("description")}
              rows={3}
              className="w-full rounded-md border border-gray-500 px-3 py-2 focus:outline-none focus:border-0 focus:ring-2 focus:ring-[#9333EA]"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Assign To + Estimated Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium  mb-1">
                Assign To
              </label>
              <select
                {...register("assigneeId")}
                className={`w-full bg-secondary rounded-md border px-3 py-2 focus:outline-none focus:border-0 focus:ring-2 ${
                  errors.assigneeId
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-500 focus:ring-btn-primary"
                }`}
              >
                <option key={0} value="">
                  Select contributor
                </option>
                {contributors.length > 0 ? (
                  contributors.map((c, idx) => (
                    <option key={idx} value={c.userId}>
                      {c.name.split(" ").length > 2
                        ? c.name.split(" ").slice(0, 2).join(" ") +
                          " - " +
                          c.expectedRate +
                          "/hr"
                        : c.name + " - " + c.expectedRate + "/hr"}
                    </option>
                  ))
                ) : (
                  <option disabled>No contributors found</option>
                )}
              </select>
              {errors.assigneeId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.assigneeId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                min="0"
                {...register("estimatedHours", { valueAsNumber: true })}
                className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:border-0 focus:ring-2 ${
                  errors.estimatedHours
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-500 focus:ring-[#9333EA]"
                }`}
              />
              {errors.estimatedHours && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.estimatedHours.message}
                </p>
              )}
            </div>
          </div>

          {/* Show calculated payment */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-300">Payable Amount: </span>
            <span className="text-base font-semibold text-green-500">
              ₹ {calculatedAmount.toLocaleString("en-IN")}
            </span>
          </div>

          {/* Due Date + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium  mb-1">
                Due Date
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full rounded-md border border-gray-500 px-3 py-2 focus:outline-none  focus:border-0 focus:ring-2 focus:ring-[#9333EA]"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dueDate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium  mb-1">
                Priority
              </label>
              <select
                {...register("priority")}
                className="w-full bg-secondary rounded-md border border-gray-500 px-3 py-2 focus:outline-none focus:border-0 focus:ring-2 focus:ring-btn-primary"
              >
                <option value="">Select priority</option>
                {Object.values(TaskPriority).map((priority, idx) => {
                  return (
                    <option value={priority} key={idx}>
                      {priority.slice(0, 1).toUpperCase() + priority.slice(1)}
                    </option>
                  );
                })}
              </select>
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Upload Documents  ( ADD validation file limit)*/}
          {/* <ProjectFileUpload
            label="Upload Documents"
            onFilesChange={setFiles}
          /> */}

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-2 py-1 rounded-md border border-gray-500 cursor-pointer transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-2 py-1 rounded-md text-white font-medium bg-[#9333EA] cursor-pointer hover:bg-[#7E22CE] transition disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

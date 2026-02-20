"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { ITask, TaskPriority } from "@/types/task";
import { taskService } from "@/services/user/task-service";
import { projectService } from "@/services/user/project-service";
import { toast } from "react-toastify";
import axios from "axios";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { X } from "lucide-react";
import { FormValues, schema } from "@/validators/edit-task";
import { IContributor } from "@/types/contributor";
import { handleApiError } from "@/utils/handleApiError";

type EditTaskModalProps = {
  taskId: string;
  onClose: () => void;
  fetchTasks: () => void;
};

export default function EditTaskModal({
  taskId,
  onClose,
  fetchTasks,
}: EditTaskModalProps) {
  const [contributors, setContributors] = useState<IContributor[]>([]);
  const [task, setTask] = useState<ITask | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const { projectId } = useParams<{ projectId: string }>();

  const assigneeId = useWatch({ control, name: "assigneeId" });
  const estimatedHours = useWatch({ control, name: "estimatedHours" });

  // Load task details
  const fetchTask = useCallback(async () => {
    try {
      const res = await taskService.getTaskDetails(taskId, projectId);

      if (!res.success) throw new Error("Failed to fetch task.");
      const t = res.data;
      setTask(t);

      setValue("title", t.title);
      setValue("priority", t.priority);
      setValue("description", t.description);
      setValue("assigneeId", t.assigneeId || null);
      setValue("estimatedHours", t.estimatedHours);
      setValue("expectedRate", t.expectedRate ?? 0);
      setValue("dueDate", new Date(t.dueDate).toISOString().slice(0, 16));

      setCalculatedAmount((t.expectedRate ?? 0) * t.estimatedHours);
    } catch (err) {
      if (axios.isAxiosError(err)) toast.error(err.response?.data.message);
    }
  }, [taskId, setValue, projectId]);

  // Load contributors
  const fetchContributors = useCallback(async () => {
    try {
      const res = await projectService.listProjectContributors(projectId);
      if (res.success) setContributors(res.data.contributors);
    } catch (error) {
      handleApiError(error);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  useEffect(() => {
    if (task) fetchContributors();
  }, [task, fetchContributors]);

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

  // Auto-set expectedRate based on contributor
  useEffect(() => {
    if (!contributors.length) return;

    const contributor = contributors.find((c) => c.userId === assigneeId);
    if (contributor) {
      setValue("expectedRate", contributor.expectedRate);
      setCalculatedAmount(
        contributor.expectedRate * Number(estimatedHours || 0),
      );
    } else {
      // No assignee
      setValue("expectedRate", 0);
      setCalculatedAmount(0);
    }
  }, [assigneeId, estimatedHours, contributors, setValue]);

  // Submit Handler
  const onSubmitForm = async (data: FormValues) => {
    try {
      setSubmitting(true);

      const payload = {
        title: data.title,
        description: data.description,
        assigneeId: assigneeId,
        estimatedHours: data.estimatedHours,
        dueDate: new Date(data.dueDate),
        expectedRate: task?.expectedRate,
        priority: data.priority,
        totalAmount: task?.totalAmount,
      };

      const res = await taskService.updateTask(taskId, projectId, payload);

      if (!res.success) throw new Error();

      toast.success(res.message);
      fetchTasks();
      onClose();
      reset();
    } catch (error) {
      handleApiError(error);
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!task) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 backdrop-blur-sm 
  flex items-center justify-center px-3 sm:px-4 py-6 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-secondary text-gray-800 dark:text-white 
    w-full max-w-lg rounded-xl shadow-2xl animate-fadeIn 
    border border-gray-200 dark:border-border-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-5 py-4">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="p-5 space-y-4" onSubmit={handleSubmit(onSubmitForm)}>
          {/* Title */}
          <div>
            <label className="text-sm font-medium">Task Title</label>
            <input
              {...register("title")}
              className="w-full border border-gray-300 dark:border-gray-600 
          rounded-md px-3 py-2 text-sm mt-1
          bg-white dark:bg-gray-800
          focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full border border-gray-300 dark:border-gray-600 
          rounded-md px-3 py-2 text-sm mt-1
          bg-white dark:bg-gray-800
          focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Estimated Hours if Assigned */}
          {task.assignee && (
            <div>
              <label className="text-sm font-medium">Estimated Hours</label>
              <input
                {...register("estimatedHours", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
                type="number"
                min="0"
                className="w-full border border-gray-300 dark:border-gray-600 
  rounded-md px-3 py-2 text-sm mt-1
  bg-white dark:bg-gray-800
  focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {errors.estimatedHours && (
                <p className="text-red-500 text-sm">
                  {errors.estimatedHours.message}
                </p>
              )}
            </div>
          )}

          {/* Due Date + Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Due Date</label>
              <input
                {...register("dueDate")}
                type="datetime-local"
                className="w-full border border-gray-300 dark:border-gray-600 
            rounded-md px-3 py-2 text-sm mt-1
            bg-white dark:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <select
                {...register("priority")}
                className="w-full border border-gray-300 dark:border-gray-600 
            rounded-md px-3 py-2 text-sm mt-1
            bg-white dark:bg-gray-800
            focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {Object.values(TaskPriority).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p className="text-red-500 text-sm">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Assignee */}
          {task.assignee ? (
            <div className="flex items-center justify-between bg-gray-100 dark:bg-slate-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3">
                <div className="bg-blue-400 text-white text-xs font-semibold w-8 h-8 flex items-center justify-center rounded-full">
                  {task.assignee.name && task.assignee.name[0]}
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {task.assignee.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {task.assignee.developerRole}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Assign To</label>
                <select
                  {...register("assigneeId")}
                  className="w-full border border-gray-300 dark:border-gray-600 
              rounded-md px-3 py-2 text-sm mt-1
              bg-white dark:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Contributor</option>
                  {contributors.map((c) => (
                    <option key={c.userId} value={c.userId}>
                      {c.name} — ${c.expectedRate}/hr
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Estimated Hours</label>
                <input
                  {...register("estimatedHours", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full border border-gray-300 dark:border-gray-600 
              rounded-md px-3 py-2 text-sm mt-1
              bg-white dark:bg-gray-800
              focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Payable */}
          {assigneeId && estimatedHours && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Total Payable:
              </span>
              <span className="font-semibold text-green-500">
                $ {calculatedAmount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 
          rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              disabled={submitting}
              type="submit"
              className="px-3 py-1.5 bg-btn-primary hover:bg-btn-primary-hover
          text-white rounded-md transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Saving..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

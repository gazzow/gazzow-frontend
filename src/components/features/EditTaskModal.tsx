"use client";

import { useEffect, useState, useCallback } from "react";
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
    } catch {}
  }, [projectId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  useEffect(() => {
    if (task) fetchContributors();
  }, [task, fetchContributors]);

  // Auto-set expectedRate based on contributor
  useEffect(() => {
    if (!contributors.length) return;

    const contributor = contributors.find((c) => c.userId === assigneeId);
    if (contributor) {
      setValue("expectedRate", contributor.expectedRate);
      setCalculatedAmount(
        contributor.expectedRate * Number(estimatedHours || 0)
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
        totalAmount: task?.totalAmount,
      };

      const res = await taskService.updateTask(taskId, projectId, payload);

      if (!res.success) throw new Error();

      toast.success(res.message);
      fetchTasks();
      onClose();
      reset();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Failed to update task");
      }
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
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-secondary text-white w-full max-w-lg rounded-lg shadow-2xl animate-fadeIn p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
          <h2 className="text-lg font-semibold">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl cursor-pointer transition"
          >
            <X />
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmitForm)}>
          {/* Title */}
          <div>
            <label className="text-sm">Task Title</label>
            <input
              {...register("title")}
              className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm mt-1"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          {/* Description */}
          <div>
            <label className="text-sm">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full  border border-gray-700 rounded-md px-3 py-2 text-sm mt-1"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          {task.assignee && (
            <div>
              <label className="text-sm">Estimated Hours</label>
              <input
                {...register("estimatedHours", { valueAsNumber: true })}
                type="number"
                min="0"
                className="w-full  border border-gray-700 rounded-md px-3 py-2 text-sm mt-1"
              />
              {errors.estimatedHours && (
                <p className="text-red-500 text-sm">
                  {errors.estimatedHours.message}
                </p>
              )}
            </div>
          )}

          {/* Due Date + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Due Date</label>
              <input
                {...register("dueDate")}
                type="datetime-local"
                className="w-full  border border-gray-700 rounded-md px-3 py-2 text-sm mt-1"
              />
            </div>

            <div>
              <label className="text-sm">Priority</label>
              <select
                {...register("priority")}
                className="w-full border border-gray-700 rounded-md px-3 py-2 text-sm mt-1"
              >
                {Object.values(TaskPriority).map((p) => (
                  <option key={p} value={p} className="bg-gray-800">
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Assignee*/}
          {task.assignee ? (
            <div className="flex items-center justify-between bg-slate-700 p-3 rounded">
              <div className="flex items-center gap-2 ">
                <div className="bg-blue-600 text-white text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full">
                  {task.assignee.name && task.assignee.name[0]}
                </div>
                <div>
                  <p className="text-sm text-gray-300">{task.assignee.name}</p>
                  <p className="text-xs text-gray-400 ">
                    {task.assignee.developerRole}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Assign To</label>
                <select
                  {...register("assigneeId")}
                  className="w-full border border-border-primary rounded-md px-3 py-2 text-sm mt-1"
                >
                  <option value="" className="bg-gray-800">
                    Select Contributor
                  </option>
                  {contributors.map((c) => (
                    <option
                      defaultValue={task.assignee?.id}
                      key={c.userId}
                      value={c.userId}
                      className="bg-gray-800"
                    >
                      {c.name} — ${c.expectedRate}/hr
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm">Estimated Hours</label>
                <input
                  {...register("estimatedHours", { valueAsNumber: true })}
                  type="number"
                  min="0"
                  className="w-full  border border-gray-700 rounded-md px-3 py-2 text-sm mt-1"
                />
                {errors.estimatedHours && (
                  <p className="text-red-500 text-sm">
                    {errors.estimatedHours.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Payable Amount */}
          {assigneeId && estimatedHours && (
            <div className="flex justify-between text-sm">
              <span>Total Payable:</span>
              <span className="font-semibold text-green-400">
                $ {calculatedAmount.toLocaleString()}
              </span>
            </div>
          )}
          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 border border-gray-500 rounded-md"
            >
              Cancel
            </button>
            <button
              disabled={submitting}
              type="submit"
              className="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded-md disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

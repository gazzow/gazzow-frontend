"use client";

import { useCallback, useEffect, useState } from "react";
import { projectService } from "@/services/user/project-service";
import { taskService } from "@/services/user/task-service";
import { canReassignTask } from "@/utils/task-permissions";
import { toast } from "react-toastify";
import { ITask } from "@/types/task";
import { IContributor } from "@/types/contributor";
import axios from "axios";

type ReassignTaskModalProps = {
  task: ITask;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ReassignTaskModal({
  task,
  onClose,
  onSuccess,
}: ReassignTaskModalProps) {
  const [contributors, setContributors] = useState<IContributor[]>([]);
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchContributors = useCallback(async () => {
    if (!task.project.id) {
      toast.error("Project id is required for reassign");
      return;
    }
    try {
      const res = await projectService.listProjectContributors(task.project.id);

      if (res.success) {
        console.log("contributors data: ", res.data.contributors);
        setContributors(res.data.contributors);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  }, [task]);

  useEffect(() => {
    fetchContributors();
  }, [fetchContributors]);

  const handleReassign = async () => {
    if (!canReassignTask(task.status, task.assigneeStatus)) {
      toast.error("Task cannot be reassigned once work has started");
      return;
    }

    if (!assigneeId) {
      toast.error("Please select a contributor");
      return;
    }

    if (!task.project.id) {
      toast.error("Project id is required for reassign");
      return;
    }

    try {
      setLoading(true);

      const res = await taskService.reassignTask(
        task.id,
        task.project.id,
        assigneeId,
      );

      toast.success(res.message);
      onSuccess();
      onClose();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Failed to reassign task");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute right-5 top-5 bg-white dark:bg-secondary p-4 sm:p-5 rounded-xl border border-gray-200 dark:border-border-primary shadow-md w-full max-w-md">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Reassign
      </h2>

      {task.assignee && (
        <select
          value={assigneeId || task.assignee?.id}
          onChange={(e) => setAssigneeId(e.target.value)}
          className="w-full border border-gray-300 dark:border-border-primary rounded-md p-2 text-sm 
  bg-gray-50 dark:bg-primary 
  focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          {/* Current Assignee */}
          {task.assignee && (
            <option value={task.assignee.id} disabled>
              {task.assignee.name} — ${task.expectedRate}/hr (Current)
            </option>
          )}

          {/* Other Contributors */}
          {contributors
            ?.filter((c) => c.userId !== task.assignee?.id)
            .map((c) => (
              <option key={c.userId} value={c.userId}>
                {c.name} — ${c.expectedRate}/hr
              </option>
            ))}
        </select>
      )}

      <div className="flex flex-wrap justify-end gap-2 mt-5">
        <button
          onClick={onClose}
          className="px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          disabled={loading}
          onClick={handleReassign}
          className="px-3 py-1 text-sm rounded-md bg-btn-primary hover:bg-btn-primary-hover text-white transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Reassigning..." : "Reassign"}
        </button>
      </div>
    </div>
  );
}

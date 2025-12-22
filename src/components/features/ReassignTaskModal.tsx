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
        assigneeId
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
    <div className="bg-secondary p-4 rounded">
      <h2 className="text-lg font-semibold mb-4">Reassign</h2>

      <select
        onChange={(e) => setAssigneeId(e.target.value)}
        className="w-full border  border-border-primary rounded p-2"
      >
        <option value="" className="bg-gray-600">
          Select contributor
        </option>
        {contributors ? (
          contributors.map((c) => (
            <option key={c.userId} value={c.userId} className="bg-gray-700">
              {c.name} — ${c.expectedRate}/hr
            </option>
          ))
        ) : (
          <option>Contributors not found</option>
        )}
      </select>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={onClose}
          className="bg-gray-700 px-2 rounded cursor-pointer"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          onClick={handleReassign}
          className="bg-btn-primary px-3 py-1 rounded cursor-pointer"
        >
          {loading ? "Reassigning..." : "Reassign"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { taskService } from "@/services/user/task-service";
import { ITask } from "@/types/task";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type TaskRole = "creator" | "contributor";

type TaskDetailsModalProps = {
  taskId: string;
  projectId: string;
  role?: TaskRole;
  onClose: () => void;
  onAction: (id: string) => void;
};

export default function TaskDetailsModal({
  taskId,
  projectId,
  onClose,
  onAction,
  role = "creator",
}: TaskDetailsModalProps) {
  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  console.log(onClose);

  useEffect(() => {
    let isMounted = true;

    async function fetchTask() {
      try {
        setLoading(true);
        setError("");

        const res = await taskService.getTaskDetails(taskId, projectId);
        if (!res.success) throw new Error("Failed to fetch task");

        if (isMounted) setTask(res.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTask();

    return () => {
      isMounted = false;
    };
  }, [taskId, projectId]);

  const actions = {
    contributor: [
      { label: "Start Work", id: "start", show: task && !task.acceptedAt },
      { label: "Submit Work", id: "submit", show: task && task.acceptedAt },
    ],
    creator: [
      { label: "Change Status", id: "change-status", show: true },
      { label: "Edit Task", id: "edit", show: true },
      { label: "Cancel Task", id: "cancel", show: task && !task.cancelledAt },
    ],
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="w-xl max-w-2xl bg-secondary text-gray-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold uppercase">
            {loading ? "Loading Task..." : task?.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            &times;
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
            ⏳ Fetching task details...
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="px-5 py-6 text-center text-red-400">⚠ {error}</div>
        )}

        {/* Content */}
        {task && !loading && !error && (
          <>
            {/* Body */}
            <div className="px-5 py-4 max-h-[65vh] overflow-y-auto space-y-6">
              {/* Status + Priority */}
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 text-xs bg-blue-600/20 border border-blue-600 rounded-full">
                  {task.status}
                </span>
                <span className="px-3 py-1 text-xs bg-yellow-600/20 border border-yellow-600 rounded-full">
                  Priority: {task.priority}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-400 text-sm mb-1">Description</p>
                <p className="text-gray-200 text-sm leading-6">
                  {task.description}
                </p>
              </div>

              {/* Financial */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-primary/70 rounded-lg border border-gray-700">
                <div>
                  <p className="text-xs text-gray-400">Expected Rate</p>
                  <p className="text-base font-medium">
                    {task.expectedRate} $/hr
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Estimated Hours</p>
                  <p className="text-base font-medium">
                    {task.estimatedHours} hrs
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Proposed Amount</p>
                  <p className="text-lg font-semibold text-green-400">
                    ${task.proposedAmount}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Payment Status</p>
                  <p className="text-lg font-semibold text-green-400">
                    {task.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <div className="text-sm flex justify-between">
                  <span className="text-gray-400">Due Date:</span>
                  <span>{new Date(task.dueDate).toLocaleString()}</span>
                </div>

                {task.acceptedAt && (
                  <div className="text-sm flex justify-between">
                    <span className="text-gray-400">Accepted:</span>
                    <span>{new Date(task.acceptedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Documents */}
              {task.documents?.length > 0 && (
                <div>
                  <p className="text-gray-400 text-sm">Documents</p>
                  <ul className="mt-2 space-y-1">
                    {task.documents.map((doc, i) => (
                      <li
                        key={i}
                        className="text-blue-400 hover:underline cursor-pointer text-sm"
                      >
                        📄 {doc.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-4 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-600 hover:bg-gray-800 text-gray-300 text-sm"
              >
                Close
              </button>

              {actions[role]
                .filter((btn) => btn.show)
                .map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => onAction(btn.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-sm rounded-lg text-white"
                  >
                    {btn.label}
                  </button>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

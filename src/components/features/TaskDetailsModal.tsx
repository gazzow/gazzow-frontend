"use client";

import { taskService } from "@/services/user/task-service";
import { ITask, PaymentStatus } from "@/types/task";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type TaskRole = "creator" | "contributor";

type TaskDetailsModalProps = {
  taskId: string;
  role?: TaskRole;
  openEditModal: () => void;
  onClose: () => void;
  onAction: (id: string) => void;
};

export default function TaskDetailsModal({
  taskId,
  role = "creator",
  openEditModal,
  onClose,
  onAction,
}: TaskDetailsModalProps) {
  const { projectId } = useParams<{ projectId: string }>();

  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      { label: "Cancel Task", id: "cancel", show: task && task.cancelledAt },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className="w-full max-w-2xl bg-secondary text-gray-200 rounded-2xl shadow-2xl animate-fadeIn border border-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 bg-primary/30 rounded-t-2xl  border-b border-gray-700/50 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-gray-100 tracking-wide">
            {loading ? "Loading Task..." : task?.title}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl cursor-pointer transition"
          >
            &times;
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm animate-pulse">
            ⏳ Fetching task details...
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="px-5 py-6 text-center text-red-400">⚠ {error}</div>
        )}

        {/* Body */}
        {task && !loading && !error && (
          <>
            <div className="px-5 py-5 max-h-[65vh] overflow-y-auto space-y-6 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600 rounded-xl">
              {/* Status & Priority */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 text-xs bg-blue-500/20 border border-blue-500 rounded-full">
                  {task.status}
                </span>
                <span className="px-3 py-1 text-xs bg-yellow-500/20 border border-yellow-500 rounded-full">
                  Priority: {task.priority}
                </span>
              </div>

              {/* Description */}
              <section>
                <p className="text-xs font-medium text-gray-400 mb-1">
                  Description
                </p>
                <p className="text-sm leading-6 text-gray-200">
                  {task.description}
                </p>
              </section>

              {/* Assignee + Financial Summary */}
              <div className="p-4 rounded-xl bg-primary/40 border border-gray-700 space-y-4">
                {/* Assignee */}
                {task.assignee && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-gray-700/50">
                    <div className="bg-blue-600 text-white text-sm font-semibold w-10 h-10 flex items-center justify-center rounded-full">
                      {task.assignee.name?.[0] ?? "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {task.assignee.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {task.assignee.developerRole}
                      </p>
                    </div>
                  </div>
                )}

                {/* Financial Rows */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400">Hourly Rate</p>
                    <p className="font-semibold">${task.expectedRate}/hr</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Estimated Hours</p>
                    <p className="font-semibold">{task.estimatedHours} hrs</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Budget Estimate</p>
                    <p className="text-green-400 font-bold">
                      ${task.proposedAmount}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Payment Status</p>
                    <span
                      className={`font-semibold text-sm uppercase ${
                        task.paymentStatus === PaymentStatus.PAID
                          ? "text-green-400"
                          : task.paymentStatus === PaymentStatus.PENDING
                          ? "text-yellow-400"
                          : "text-red-400"
                      }`}
                    >
                      {task.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dates & Payment */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Due Date:</span>
                  <span>
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {task.acceptedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Accepted:</span>
                    <span>{new Date(task.acceptedAt).toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Documents */}
              {task.documents?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Documents</p>
                  <div className="flex flex-col gap-2">
                    {task.documents.map((doc, i) => (
                      <button
                        key={i}
                        className="flex items-center gap-2 text-blue-400 text-sm hover:underline"
                      >
                        📄 {doc.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-700 bg-primary/20 flex justify-end gap-3 rounded-b-2xl">
              <button
                onClick={onClose}
                className="px-2 py-1 rounded-md border border-gray-500 hover:bg-gray-700 transition text-sm"
              >
                Cancel
              </button>

              {actions[role]
                .filter((btn) => btn.show)
                .map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => onAction(btn.id)}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm"
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

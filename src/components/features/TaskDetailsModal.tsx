"use client";

import { paymentService } from "@/services/user/payment-service";
import { taskService } from "@/services/user/task-service";
import { ITask, PaymentStatus, TaskStatus } from "@/types/task";
import { formatTaskDate } from "@/utils/format-task-date";
import { formatTaskStatus } from "@/utils/format-task-status";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

type TaskRole = "creator" | "contributor";

type TaskDetailsModalProps = {
  taskId: string;
  role: TaskRole;
  onClose: () => void;
  fetchTasks: () => void;
};

export default function TaskDetailsModal({
  taskId,
  role,
  onClose,
  fetchTasks,
}: TaskDetailsModalProps) {
  const { projectId } = useParams<{ projectId: string }>();
  console.log("TaskDetailsModal projectId: ", projectId);

  const [task, setTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTask = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await taskService.getTaskDetails(taskId, projectId);
      if (res.success) {
        setTask(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [taskId, projectId]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const startWork = async (taskId: string, paymentStatus?: PaymentStatus) => {
    console.log("Starting work on task:", taskId);

    if (!paymentStatus || paymentStatus === PaymentStatus.PENDING) {
      toast.error("Payment is pending. Unable to start work on this task.");
      return;
    }
    try {
      const now = new Date().toISOString();
      const res = await taskService.startWork(taskId, projectId, now);
      if (res.success) {
        toast.success("Work started on task.");
        onClose();
        fetchTasks();
      }
      // Refresh task details
      const updatedTaskRes = await taskService.getTaskDetails(
        taskId,
        projectId
      );
      if (updatedTaskRes.success) {
        setTask(updatedTaskRes.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to start work on task");
        toast.error(error.response?.data.message);
      }
    }
  };

  const submitWork = async (taskId: string) => {
    console.log("Submitting work on task:", taskId);
    try {
      const now = new Date().toISOString();
      const res = await taskService.submitTask(taskId, projectId, now);
      if (res.success) {
        toast.success("Task submitted for review.");
        onClose();
        fetchTasks();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to submit work on task");
        toast.error(error.response?.data.message);
      }
    }
  };

  const completeTask = async (taskId: string) => {
    console.log("Completing task:", taskId);
    try {
      const now = new Date().toISOString();
      const res = await taskService.completeTask(taskId, projectId, now);
      if (res.success) {
        toast.success("Task marked as completed.");
        onClose();
        fetchTasks();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to complete task");
        toast.error(error.response?.data.message);
      }
    }
  };

  const handleUpdateStatus = async (taskId: string) => {};

  const handlePayment = async (taskId: string) => {
    try {
      const res = await paymentService.taskCheckoutSession(taskId);
      if (res.success) {
        toast.success("Redirecting to payment...");
        window.location.href = res.data.checkoutUrl;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to initiate payment for task");
        toast.error(error.response?.data.message);
      }
    }
  };

  const actions = {
    contributor: [
      {
        label: "Start Work",
        id: "start",
        show: task && task.acceptedAt === null,
        onSubmit: startWork,
      },
      {
        label: "Submit Task",
        id: "submit",
        show: task && task.acceptedAt && task.status === TaskStatus.IN_PROGRESS,
        onSubmit: submitWork,
      },
    ],
    creator: [
      {
        label: "Mark as Completed",
        id: "complete",
        show:
          task &&
          task.submittedAt &&
          task.status === TaskStatus.SUBMITTED &&
          task.paymentStatus === PaymentStatus.ESCROW_HELD,
        onSubmit: completeTask,
      },
      {
        label: "Cancel Task",
        id: "cancel",
        show: task && task.cancelledAt,
        onSubmit: handleUpdateStatus,
      },
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
          <h2 className="text-md font-bold text-gray-100 tracking-wide">
            {loading ? "Loading Task..." : task?.title.toUpperCase()}
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
                  {formatTaskStatus(task.status)}
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
                    <p className="font-bold">${task.proposedAmount}</p>
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
                  <span className="text-gray-300 font-medium">Due Date</span>
                  <span>{formatTaskDate(task.dueDate)}</span>
                </div>

                {task.acceptedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-medium">Accepted</span>
                    <span>{formatTaskDate(task.acceptedAt)}</span>
                  </div>
                )}
                {task.submittedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-medium">Submitted</span>
                    <span>{formatTaskDate(task.submittedAt)}</span>
                  </div>
                )}
                {task.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-medium">Paid</span>
                    <span>{formatTaskDate(task.paidAt)}</span>
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
                Close
              </button>
              {role === "creator" &&
                task.assignee &&
                task.paymentStatus === PaymentStatus.PENDING && (
                  <button
                    className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded-md text-white text-sm"
                    onClick={() => handlePayment(task.id)}
                  >
                    Pay Now
                  </button>
                )}

              {actions[role]
                .filter((btn) => btn.show)
                .map((btn, i) => (
                  <button
                    key={i}
                    onClick={() => btn.onSubmit(task.id, task.paymentStatus)}
                    className="px-2 py-1 bg-btn-primary hover:bg-btn-primary-hover rounded-md text-white text-sm"
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

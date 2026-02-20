"use client";

import { paymentService } from "@/services/user/payment-service";
import { taskService } from "@/services/user/task-service";
import {
  ITask,
  TaskPaymentStatus,
  RefundStatus,
  TaskStatus,
} from "@/types/task";
import { formatTaskStatus } from "@/utils/format-task-status";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReassignTaskModal from "./ReassignTaskModal";
import { Eye, Files, UserPen, UserRoundX } from "lucide-react";
import { projectService } from "@/services/user/project-service";
import { TaskDiscussionPanel } from "./TaskDiscussionPanel";

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
  const [showReassign, setShowReassign] = useState<boolean>(false);
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
        onClose();
      }
    } finally {
      setLoading(false);
    }
  }, [taskId, projectId, onClose]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const startWork = async (
    taskId: string,
    paymentStatus?: TaskPaymentStatus,
  ) => {

    if (!paymentStatus || paymentStatus === TaskPaymentStatus.PENDING) {
      toast.error("Payment is pending. Unable to start work on this task.");
      return;
    }
    try {
      const now = new Date().toISOString();
      const res = await taskService.startWork(taskId, projectId, now);
      if (res.success) {
        onClose();
        fetchTasks();
      }
      // Refresh task details
      const updatedTaskRes = await taskService.getTaskDetails(
        taskId,
        projectId,
      );
      if (updatedTaskRes.success) {
        setTask(updatedTaskRes.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const submitWork = async (taskId: string) => {
    try {
      const now = new Date().toISOString();
      const res = await taskService.submitTask(taskId, projectId, now);
      if (res.success) {
        onClose();
        fetchTasks();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const completeTask = async (taskId: string) => {
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
        toast.error(error.response?.data.message);
      }
    }
  };

  const handlePayment = async (taskId: string) => {
    try {
      const res = await paymentService.taskCheckoutSession(taskId);
      if (res.success) {
        toast.success("Redirecting to payment...");
        window.location.href = res.data.checkoutUrl;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  const openReassignModal = () => {
    setShowReassign(true);
  };

  const onReassignSuccess = () => {
    setShowReassign(false);
    fetchTask();
  };

  const handleViewFile = async (fileKey: string) => {
    try {
      const res = await projectService.generateSignedUrl(
        encodeURIComponent(fileKey),
      );
      window.open(res.data, "_black", "noopener,noreferrer");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("Failed to get signed URL");
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
          task.paymentStatus === TaskPaymentStatus.ESCROW_HELD,
        onSubmit: completeTask,
      },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6 cursor-default">
      <div
        className="w-full max-w-2xl bg-white dark:bg-secondary text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl border border-gray-200 dark:border-primary transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-5 py-3 sm:py-4 bg-gray-100 dark:bg-primary/30 rounded-t-2xl border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <h2 className="text-sm sm:text-md font-bold tracking-wide">
            {loading ? "Loading Task..." : task?.title.toUpperCase()}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-xl sm:text-2xl transition cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-8 sm:py-10 text-gray-500 dark:text-gray-400 text-sm animate-pulse">
            ⏳ Fetching task details...
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="px-5 py-6 text-center text-red-500 dark:text-red-400">
            ⚠ {error}
          </div>
        )}

        {/* Body */}
        {task && !loading && !error && (
          <>
            <div className="px-4 sm:px-5 py-4 sm:py-5 max-h-[65vh] overflow-y-auto space-y-5 sm:space-y-6 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 rounded-xl">
              {/* Status & Priority */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500 rounded-full">
                  {formatTaskStatus(task.status)}
                </span>
                <span className="px-3 py-1 text-xs bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-300 dark:border-yellow-500 rounded-full">
                  Priority: {task.priority}
                </span>
              </div>

              {/* Description */}
              <section>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Description
                </p>
                <p className="text-sm leading-6">{task.description}</p>
              </section>

              {/* Assignee + Financial Summary */}
              <div className="relative p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-primary/40 border border-gray-200 dark:border-gray-700 space-y-4">
                {/* Assignee */}
                {task.assignee && (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700/50 transition">
                    {/* Assignee Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="bg-blue-600 text-white text-sm font-semibold w-10 h-10 flex items-center justify-center rounded-full shrink-0">
                        {task.assignee.name?.[0] ?? "U"}
                      </div>

                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                          {task.assignee.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {task.assignee.developerRole}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    {!showReassign &&
                      task.status === TaskStatus.TODO &&
                      role === "creator" && (
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                          {/* <button
                            className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs sm:text-sm rounded-md 
            bg-red-100 text-red-600 
            dark:bg-white dark:text-red-500 
            hover:bg-red-200
            transition w-full sm:w-auto cursor-pointer"
                          >
                            <UserRoundX size={16} />
                            <span>Remove</span>
                          </button> */}

                          <button
                            onClick={openReassignModal}
                            className="flex items-center justify-center gap-2 px-3 py-1.5 text-xs sm:text-sm rounded-md 
            bg-blue-100 text-blue-600 
            dark:bg-blue-100 dark:text-blue-500
            hover:bg-blue-200 dark:hover:bg-blue-200
            transition w-full sm:w-auto cursor-pointer"
                          >
                            <UserPen size={16} />
                            <span>Reassign</span>
                          </button>
                        </div>
                      )}
                  </div>
                )}

                {showReassign && task.status === TaskStatus.TODO && (
                  <ReassignTaskModal
                    task={task}
                    onClose={() => setShowReassign(false)}
                    onSuccess={onReassignSuccess}
                  />
                )}

                {/* Financial Summary */}
                <div className="rounded-lg border border-gray-200 dark:border-white/10 p-3 sm:p-4 space-y-4 bg-white dark:bg-black/30">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Estimated Hours
                      </p>
                      <p className="font-medium">{task.estimatedHours} hrs</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Hourly Rate
                      </p>
                      <p className="font-medium">${task.expectedRate}/hr</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">
                        Total Cost
                      </p>
                      <p className="font-semibold">${task.totalAmount}</p>
                    </div>
                  </div>

                  <hr className="border-gray-200 dark:border-white/10" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Paid (Escrow)
                      </p>
                      <p className="text-lg sm:text-xl font-bold text-green-500 dark:text-green-400">
                        ${task.amountInEscrow}
                      </p>
                    </div>

                    {task.refundAmount > 0 ? (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          Refund Amount
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-yellow-500 dark:text-yellow-400">
                          ${task.refundAmount}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          Remaining to Pay
                        </p>
                        <p className="text-lg sm:text-xl font-bold text-red-500 dark:text-red-400">
                          ${task.balance}
                        </p>
                      </div>
                    )}
                  </div>

                  {role === "creator" && (
                    <div className="text-sm mt-2 space-y-1">
                      {task.paymentStatus === TaskPaymentStatus.PENDING &&
                        task.balance > 0 && (
                          <p className="text-yellow-600 dark:text-yellow-400">
                            ⚠️ Please pay ${task.balance} to continue this task.
                          </p>
                        )}

                      {task.refundStatus === RefundStatus.PENDING && (
                        <p className="text-yellow-600 dark:text-yellow-400">
                          💸 A Refund of ${task.refundAmount} will be processed
                          automatically after the task is completed.
                        </p>
                      )}

                      {task.paymentStatus === TaskPaymentStatus.ESCROW_HELD && (
                        <p className="text-green-600 dark:text-green-400">
                          ✅ Payment completed and securely held in escrow.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Documents */}
                {task.documents && task.documents?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1">
                      <Files size={18} />
                      <h2 className="text-md font-semibold">Attachments</h2>
                    </div>
                    <ul className="mt-3 space-y-2">
                      {task.documents.map((file, i) => (
                        <li
                          key={i}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 dark:bg-primary/30 px-3 py-2 rounded-lg text-sm"
                        >
                          <span>{file.name}</span>
                          <button
                            onClick={() => handleViewFile(file.key)}
                            className="flex gap-2 hover:text-blue-600 dark:hover:text-blue-300 text-xs mt-2 sm:mt-0 cursor-pointer"
                          >
                            <Eye size={18} />
                            <span>view</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <TaskDiscussionPanel task={task} />
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-primary/20 flex flex-wrap justify-end gap-2 rounded-b-2xl">
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-md border border-gray-400 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm cursor-pointer"
              >
                Close
              </button>

              {role === "creator" &&
                task.assignee &&
                task.paymentStatus === TaskPaymentStatus.PENDING && (
                  <button
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm cursor-pointer"
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
                    className="px-3 py-1 bg-btn-primary hover:bg-btn-primary-hover text-white rounded-md text-sm cursor-pointer"
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

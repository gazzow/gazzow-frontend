"use client";

import { paymentService } from "@/services/user/payment-service";
import { taskService } from "@/services/user/task-service";
import { ITask, PaymentStatus, RefundStatus, TaskStatus } from "@/types/task";
import { formatTaskStatus } from "@/utils/format-task-status";
import axios from "axios";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ReassignTaskModal from "./ReassignTaskModal";
import { Eye, Files, UserPen } from "lucide-react";
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
        encodeURIComponent(fileKey)
      );

      if (res.success) {
        toast.success(res.message);
      }
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
          task.paymentStatus === PaymentStatus.ESCROW_HELD,
        onSubmit: completeTask,
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
              <div className="p-4 rounded-xl bg-primary/40 border border-gray-700 space-y-4 transition ease-in-out duration-75">
                {/* Assignee */}
                {task.assignee && (
                  <div className="items-start flex justify-between gap-3 p-3 rounded-lg bg-white/5 border border-gray-700/50">
                    <div className="flex items-center gap-3">
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

                    {!showReassign &&
                      task.status === TaskStatus.TODO &&
                      role === "creator" && (
                        <button
                          onClick={openReassignModal}
                          className="flex gap-2 items-center text-left px-4 py-2 text-sm bg-gray-700 transition rounded cursor-pointer"
                        >
                          <UserPen size={16} color="cyan" />
                          <span>Reassign</span>
                        </button>
                      )}

                    {showReassign && task.status === TaskStatus.TODO && (
                      <ReassignTaskModal
                        task={task}
                        onClose={() => setShowReassign(false)}
                        onSuccess={onReassignSuccess}
                      />
                    )}
                  </div>
                )}

                {/* Financial Summary */}
                <div className="rounded-lg border border-white/10 p-4 space-y-4 bg-black/30">
                  {/* Cost Breakdown */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Estimated Hours</p>
                      <p className="font-medium">{task.estimatedHours} hrs</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Hourly Rate</p>
                      <p className="font-medium">${task.expectedRate}/hr</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Total Cost</p>
                      <p className="font-semibold">${task.totalAmount}</p>
                    </div>
                  </div>

                  <hr className="border-white/10" />

                  {/* Payment Snapshot */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-xs">Paid (Escrow)</p>
                      <p className="text-xl font-bold text-green-400">
                        ${task.amountInEscrow}
                      </p>
                    </div>

                    {task.refundAmount > 0 ? (
                      <div>
                        <p className="text-gray-400 text-xs">Refund Amount</p>
                        <p className="text-xl font-bold text-yellow-400">
                          ${task.refundAmount}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-400 text-xs">
                          Remaining to Pay
                        </p>
                        <p className="text-xl font-bold text-red-400">
                          ${task.balance}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status Message */}
                  {role === "creator" && (
                    <div className="text-sm mt-2">
                      {task.paymentStatus === PaymentStatus.PENDING &&
                        task.balance > 0 && (
                          <p className="text-yellow-400">
                            ⚠️ Please pay ${task.balance} to continue this task.
                          </p>
                        )}

                      {task.refundStatus === RefundStatus.PENDING && (
                        <p className="text-yellow-400">
                          💸 A Refund of ${task.refundAmount} will be processed
                          automatically after the task is completed.
                        </p>
                      )}

                      {task.paymentStatus === PaymentStatus.ESCROW_HELD && (
                        <p className="text-green-400">
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
                          className="flex items-center justify-between bg-primary/30 px-2 py-2 rounded-lg text-sm text-gray-300"
                        >
                          <span>{file.name}</span>
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleViewFile(file.key)}
                              className="flex gap-2 hover:text-red-300 text-xs cursor-pointer"
                            >
                              <Eye size={18} />
                              <span>view</span>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>

              {/* Activity  & Comment Section */}
              <TaskDiscussionPanel task={task}/>
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

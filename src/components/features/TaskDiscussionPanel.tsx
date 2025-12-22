"use client";

import { taskCommentService } from "@/services/user/task-comment.service";
import { ITask } from "@/types/task";
import { ITaskComment } from "@/types/task-comment";
import { formatTaskDate } from "@/utils/format-task-date";
import { createCommentSchema } from "@/validators/create-comment";
import axios from "axios";
import { Send } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

type TabType = "comments" | "activity";

interface TaskDiscussionPanelProp {
  task: ITask;
}

export function TaskDiscussionPanel({ task }: TaskDiscussionPanelProp) {
  const [comments, setComments] = useState<ITaskComment[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("comments");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const result = createCommentSchema.safeParse({ content });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        taskId: task.id,
        content,
      };

      const res = await taskCommentService.createTask(payload);
      if (res.success) {
        toast.success(res.message);
        fetchComments();
      }
      setContent(""); // reset after success
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message || "Failed to post comment. Try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = useCallback(async () => {
    try {
      const res = await taskCommentService.getComments(task.id);
      if (res.success) {
        setComments(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message ||
            "Failed to Fetch task comments. Try again"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [task]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return (
    <section className="w-full">
      {/* Tabs Header */}
      <div className="flex items-center border-b gap-2 border-border-primary">
        <button
          onClick={() => setActiveTab("comments")}
          className={`flex-1 px-6 py-2 rounded-t-md text-sm font-medium transition bg-primary/30 cursor-pointer
            ${
              activeTab === "comments"
                ? "text-white bg-primary/70"
                : "text-gray-400 hover:text-white hover:bg-primary/50"
            }`}
        >
          Comments
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`flex-1 px-6 py-2 rounded-t-md text-sm font-medium transition bg-primary/30 cursor-pointer
            ${
              activeTab === "activity"
                ? "text-white bg-primary/70"
                : "text-gray-400 hover:text-white hover:bg-primary/50"
            }`}
        >
          Activity
        </button>
      </div>

      {/* Tabs Content */}
      <div>
        {activeTab === "comments" && (
          <div className="space-y-4">
            {/* Comments */}
            {comments.length > 0 ? (
              <div className="max-h-[320px] bg-primary/40 p-2 rounded-b-lg overflow-y-auto space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-3 rounded-lg px-2 py-1"
                  >
                    {/* Avatar */}
                    <Image
                      width={55}
                      height={55}
                      src={comment.author.imageUrl || "/avatar-placeholder.png"}
                      alt={comment.author.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white">
                            {comment.author.name}
                            {comment.isCreator && (
                              <span className="text-xm text-white px-1">
                                [creator]
                              </span>
                            )}
                          </span>

                          <span className="text-xs text-gray-400">
                            {formatTaskDate(comment.createdAt)}
                          </span>

                          {comment.isEdited && (
                            <span className="text-xs text-gray-500 italic">
                              (edited)
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="mt-1 text-sm text-gray-300 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No comments yet.</p>
            )}

            {/* Comment Input */}
            <div className="space-y-2">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                className="w-full rounded-md border border-border-primary bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-primary"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-1 text-md rounded-md bg-primary text-white disabled:opacity-50 cursor-pointer"
                >
                  <Send size={12} />
                  <span>Post</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            {/* Dates & Payment */}
            <div className="text-sm max-h-[320px] bg-primary/40 p-2 rounded-b-lg overflow-y-auto space-y-3 ">
              <div className="flex justify-between">
                <span className="text-gray-300 font-medium">Created</span>
                <span>{formatTaskDate(task.createdAt)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300 font-medium">Updated</span>
                <span>{formatTaskDate(task.updatedAt)}</span>
              </div>

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
              {task.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-300 font-medium">Completed</span>
                  <span>{formatTaskDate(task.completedAt)}</span>
                </div>
              )}
              {task.paidAt && (
                <div className="flex justify-between">
                  <span className="text-gray-300 font-medium">Paid</span>
                  <span>{formatTaskDate(task.paidAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

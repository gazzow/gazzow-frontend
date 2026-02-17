"use client";

import { taskCommentService } from "@/services/user/task-comment.service";
import { ITask } from "@/types/task";
import { ITaskComment } from "@/types/task-comment";
import { formatTaskDate } from "@/utils/format-task-date";
import { createCommentSchema } from "@/validators/create-comment";
import axios from "axios";
import { SendHorizontal } from "lucide-react";
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

      const res = await taskCommentService.createComment(payload);
      if (res.success) {
        toast.success(res.message);
        fetchComments();
      }
      setContent(""); // reset after success
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data.message || "Failed to post comment. Try again.",
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
            "Failed to Fetch task comments. Try again",
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
    <section className="w-full space-y-3">
      {/* Tabs Header */}
      <div className="flex border-b border-gray-200 dark:border-border-primary">
        <button
          onClick={() => setActiveTab("comments")}
          className={`flex-1 py-2 text-sm font-medium transition cursor-pointer
        ${
          activeTab === "comments"
            ? "border-b-2 border-primary text-primary"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        }
      `}
        >
          Comments
        </button>

        <button
          onClick={() => setActiveTab("activity")}
          className={`flex-1 py-2 text-sm font-medium transition cursor-pointer
        ${
          activeTab === "activity"
            ? "border-b-2 border-primary text-primary"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
        }
      `}
        >
          Activity
        </button>
      </div>

      {/* COMMENTS TAB */}
      {activeTab === "comments" && (
        <div className="space-y-4">
          {/* Comments List */}
          {comments.length > 0 ? (
            <div className="max-h-[320px] overflow-y-auto space-y-3 pr-1">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 p-3 rounded-xl 
              bg-white dark:bg-primary/30
              border border-gray-200 dark:border-gray-700"
                >
                  {/* Avatar */}
                  <Image
                    width={36}
                    height={36}
                    src={comment.author.imageUrl || "/avatar-placeholder.png"}
                    alt={comment.author.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {comment.author.name}
                      </span>

                      {comment.isCreator && (
                        <span className="text-[10px] px-1.5 py-[2px] rounded bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                          creator
                        </span>
                      )}

                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTaskDate(comment.createdAt)}
                      </span>

                      {comment.isEdited && (
                        <span className="text-xs text-gray-400 italic">
                          edited
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              No comments yet.
            </p>
          )}

          {/* COMMENT INPUT */}
          <div className="border border-gray-200 dark:border-border-primary rounded-full bg-white dark:bg-primary/30 p-1 flex items-center gap-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write a comment..."
              rows={1}
              className="flex-1 resize-none bg-transparent px-2 py-2 text-sm 
          text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none"
            />

            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="px-3 py-1.5 text-sm rounded-full 
          bg-btn-primary text-white hover:bg-btn-primary
          disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
            >
              <SendHorizontal></SendHorizontal>
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
          )}
        </div>
      )}

      {/* ACTIVITY TAB */}
      {activeTab === "activity" && (
        <div className="max-h-[320px] overflow-y-auto space-y-3">
          {[
            { label: "Created", value: task.createdAt },
            { label: "Updated", value: task.updatedAt },
            { label: "Due Date", value: task.dueDate },
            task.acceptedAt && { label: "Accepted", value: task.acceptedAt },
            task.submittedAt && { label: "Submitted", value: task.submittedAt },
            task.completedAt && { label: "Completed", value: task.completedAt },
            task.paidAt && { label: "Paid", value: task.paidAt },
          ]
            .filter(Boolean)
            .map((item, i) => (
              <div
                key={i}
                className="flex justify-between text-sm 
            bg-white dark:bg-primary/30
            border border-gray-200 dark:border-gray-700
            px-3 py-2 rounded-lg"
              >
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {item?.label}
                </span>
                <span>{formatTaskDate(item?.value || new Date())}</span>
              </div>
            ))}
        </div>
      )}
    </section>
  );
}

"use client";
import React, { ReactElement, useState } from "react";
import TaskCard from "./TaskCard";
import { ITask, TaskStatus } from "@/types/task";
import { CheckCircle, Clock, ListTodo, LoaderCircle } from "lucide-react";

interface TaskBoardProps {
  tasks: ITask[];
  fetchTasks: () => void;
}

const statusColumns: Record<
  string,
  {
    label: string;
    statuses: TaskStatus[];
    backgroundColor: string;
    icon: ReactElement;
  }
> = {
  todo: {
    label: "To Do",
    statuses: [TaskStatus.TODO],
    backgroundColor: "bg-slate-400/60 dark:bg-slate-500/30",
    icon: <ListTodo size={20} className="text-white" />,
  },

  in_progress: {
    label: "In Progress",
    statuses: [TaskStatus.IN_PROGRESS],
    backgroundColor: "bg-blue-500/60 dark:bg-blue-500/30",
    icon: <LoaderCircle size={20} className="text-white" />,
  },

  submitted: {
    label: "Submitted",
    statuses: [TaskStatus.SUBMITTED, TaskStatus.REVISIONS_REQUESTED],
    backgroundColor: "bg-purple-500/60 dark:bg-purple-500/30",
    icon: <Clock size={20} className="text-white" />,
  },

  completed: {
    label: "Completed",
    statuses: [TaskStatus.COMPLETED, TaskStatus.CLOSED],
    backgroundColor: "bg-emerald-500/60 dark:bg-emerald-500/30",
    icon: <CheckCircle size={20} className="text-white" />,
  },
};

export default function TaskBoard({ tasks, fetchTasks }: TaskBoardProps) {
  const [openMenuTaskId, setOpenMenuTaskId] = useState<string | null>(null);

  const handleOnToggleMenu = (taskId: string) => {
    setOpenMenuTaskId((prev) => (prev === taskId ? null : taskId));
  };

  const groupedTasks = Object.entries(statusColumns).map(([key, config]) => ({
    key,
    ...config,
    tasks: tasks.filter((t) => config.statuses.includes(t.status)),
  }));

  return (
    <section
      className="
  flex md:grid
  md:grid-cols-2 lg:grid-cols-4
  gap-4 mt-4
  overflow-x-auto md:overflow-visible
  pb-2
"
    >
      {groupedTasks.map((column) => (
        <div
          key={column.key}
          className="
      min-w-[280px] md:min-w-0
      flex-shrink-0
      md:flex-shrink
      border border-gray-200 dark:border-border-primary
      bg-white dark:bg-secondary/20
      rounded-xl p-4
      shadow-sm dark:shadow-none
      flex flex-col
    "
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between mb-4 p-2 rounded ${column.backgroundColor}`}
          >
            {column.icon}
            <h2 className="text-sm sm:text-lg font-semibold text-gray-800 dark:text-white">
              {column.label.toUpperCase()}
            </h2>

            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-secondary">
              <span className="text-sm font-semibold text-gray-700 dark:text-white">
                {column.tasks.length}
              </span>
            </div>
          </div>

          {/* Task List */}
          <div className="flex flex-col gap-3">
            {column.tasks.length === 0 ? (
              <p className="text-xs sm:text-sm text-gray-500 italic">
                No tasks
              </p>
            ) : (
              column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isMenuOpen={openMenuTaskId === task.id}
                  onToggleMenu={handleOnToggleMenu}
                  fetchTasks={fetchTasks}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </section>
  );
}

"use client";
import React, { useState } from "react";
import TaskCard from "./TaskCard";
import { ITask, TaskStatus } from "@/types/task";

interface TaskBoardProps {
  tasks: ITask[];
  fetchTasks: () => void;
}

const statusColumns: Record<
  string,
  { label: string; statuses: TaskStatus[] }
> = {
  todo: {
    label: "To Do",
    statuses: [TaskStatus.TODO],
  },
  in_progress: {
    label: "In Progress",
    statuses: [TaskStatus.IN_PROGRESS],
  },
  submitted: {
    label: "Submitted",
    statuses: [TaskStatus.SUBMITTED, TaskStatus.REVISIONS_REQUESTED],
  },
  completed: {
    label: "Completed",
    statuses: [TaskStatus.COMPLETED, TaskStatus.CLOSED],
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
    <section className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {groupedTasks.map((column) => (
        <div
          key={column.key}
          className={`min-h-screen border border-border-primary rounded-xl p-4`}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {column.label.toUpperCase()}
            </h2>

            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary">
              <span className="text-sm font-semibold text-white">
                {column.tasks.length}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {column.tasks.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No tasks</p>
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

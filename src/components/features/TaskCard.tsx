import { ITask, TaskPriority } from "@/types/task";
import { Calendar } from "lucide-react";
import React, { ReactEventHandler, useState } from "react";
import TaskDetailsModal from "./TaskDetailsModal";

type TaskCardProps = {
  task: ITask;
  className?: string;
  onClick?: (task: ITask) => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      className="bg-secondary/30  border border-gray-700 space-y-2 rounded-md p-4 shadow-md text-gray-100 hover:shadow-lg transition duration-200"
      onClick={handleCloseModal}
    >
      <div className="flex justify-between items-start ">
        <h3 className="text-md font-semibold text-sm text-white">
          {task.title}
        </h3>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            task.priority === TaskPriority.HIGH
              ? "bg-red-500/20 text-red-400"
              : task.priority === TaskPriority.MEDIUM
              ? "bg-blue-500/20 text-blue-400"
              : "bg-gray-500/20 text-gray-400"
          }`}
        >
          {task.priority}
        </span>
      </div>

      <p className="text-sm text-gray-400">{task.description}</p>

      {/* Task & Payment Status */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full">
          {task.status
            .replace("_", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
      </div>

      {/* Profile data */}
      {task.assignee && (
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full">
            {/* Replace First letter with Image url */}
            {task.assignee.name && task.assignee.name[0]}
          </div>
          <div>
            <p className="text-sm text-gray-300">{task.assignee.name}</p>
            <p className="text-xs text-gray-400 ">
              {task.assignee.developerRole}
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-1 items-center text-xs text-gray-400">
        <Calendar size={14} />
        <span>
          Due{" "}
          {new Date(task.dueDate).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
            year: "2-digit",
          })}
        </span>
      </div>

      {isOpen && (
        <TaskDetailsModal
          taskId={task.id}
          projectId={task.project.id as string}
          onAction={(id: string) => {}}
          onClose={handleCloseModal}
          key={task.id}
        />
      )}
    </div>
  );
};

export default TaskCard;

import { ITask, TaskPriority, TaskStatus } from "@/types/task";
import {
  Calendar,
  Edit,
  MoreVertical,
  SquareCheckBig,
  Trash,
  X,
} from "lucide-react";
import React, { useState } from "react";
import TaskDetailsModal from "./TaskDetailsModal";
import EditTaskModal from "./EditTaskModal";
import { useAppSelector } from "@/store/store";

type TaskCardProps = {
  task: ITask;
  className?: string;
  isMenuOpen: boolean;
  onToggleMenu: (taskId: string) => void;
  fetchTasks: () => void;
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isMenuOpen,
  onToggleMenu,
  fetchTasks,
}) => {
  const [isTaskDetailModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] =
    useState<boolean>(false);

  const user = useAppSelector((state) => state.user);

  const openTaskDetailsModal = () => {
    setIsTaskModalOpen(true);
  };

  const openEditModal = () => {
    setIsEditTaskModalOpen(true);
    setIsTaskModalOpen(false);
  };
  const handleCloseModal = () => {
    setIsTaskModalOpen(false);
  };

  const closeEditModal = () => {
    setIsEditTaskModalOpen(false);
  };

  return (
    <div
      className="
  bg-white dark:bg-secondary/30
  border border-gray-200 dark:border-gray-700
  rounded-xl p-4 shadow-sm dark:shadow-md
  text-gray-800 dark:text-gray-100
  hover:shadow-lg
  hover:border-gray-300 dark:hover:border-gray-500
  transition-all duration-200
  cursor-pointer
  flex flex-col gap-2
"
      onClick={openTaskDetailsModal}
    >
      {/* Top Section */}
      <div
        className="flex justify-between items-start gap-2"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 className="text-sm sm:text-md font-semibold text-gray-900 dark:text-white line-clamp-1">
          {task.title}
        </h3>

        {/* Menu */}
        {task.creator.id == user.id && task.status !== TaskStatus.COMPLETED && (
          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                onToggleMenu(task.id);
                e.stopPropagation();
              }}
              className="
          p-2 rounded-lg
          hover:bg-gray-100 dark:hover:bg-gray-700/40
          text-gray-500 dark:text-gray-400
          transition cursor-pointer
        "
            >
              {isMenuOpen ? <X size={16} /> : <MoreVertical size={16} />}
            </button>

            {isMenuOpen && (
              <div
                className="
            absolute right-0 mt-1 w-40
            bg-white dark:bg-secondary
            border border-gray-200 dark:border-gray-700
            rounded-lg shadow-lg
            overflow-hidden z-20
          "
              >
                <button
                  onClick={() => {
                    onToggleMenu(task.id);
                    openEditModal();
                  }}
                  className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  <Edit size={16} />
                  Edit
                </button>

                <button
                  onClick={() => {
                    onToggleMenu(task.id);
                  }}
                  className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                >
                  <SquareCheckBig size={16} />
                  Complete
                </button>

                <button
                  onClick={() => {
                    onToggleMenu(task.id);
                  }}
                  className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm hover:bg-red-100 dark:hover:bg-red-500/50 transition cursor-pointer"
                >
                  <Trash size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {task.description}
      </p>

      {/* Status + Priority */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full">
          {task.status
            .replace("_", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>

        <span
          className={`px-2 py-1 rounded-full ${
            task.priority === TaskPriority.HIGH
              ? "bg-red-500/10 border border-red-500 text-red-500"
              : task.priority === TaskPriority.MEDIUM
                ? "bg-yellow-500/10 border border-orange-500 text-orange-500"
                : "bg-blue-500/10 border border-blue-500 text-blue-500"
          }`}
        >
          {task.priority}
        </span>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        {/* Assignee */}
        {task.assignee && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-blue-500 text-white text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-full shrink-0">
              {task.assignee.name && task.assignee.name[0]}
            </div>
            <div className="truncate">
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 truncate">
                {task.assignee.name}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                {task.assignee.developerRole}
              </p>
            </div>
          </div>
        )}

        {/* Due Date */}
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
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
      </div>

      {/* Modals */}
      {isTaskDetailModalOpen && !isMenuOpen && (
        <TaskDetailsModal
          taskId={task.id}
          role={task.creator.id === user.id ? "creator" : "contributor"}
          onClose={handleCloseModal}
          key={task.id}
          fetchTasks={fetchTasks}
        />
      )}

      {isEditTaskModalOpen && (
        <EditTaskModal
          onClose={closeEditModal}
          taskId={task.id}
          fetchTasks={fetchTasks}
        />
      )}
    </div>
  );
};

export default TaskCard;

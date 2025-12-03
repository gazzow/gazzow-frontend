import { ITask, TaskPriority } from "@/types/task";
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
      className="bg-secondary/30 border border-gray-700  space-y-2 rounded-md p-4 shadow-md text-gray-100 hover:shadow-lg hover:border-gray-500 transition duration-200"
      onClick={openTaskDetailsModal}
    >
      <div
        className="flex justify-between items-start relative"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Title + priority */}
        <div className="flex  max-w-[80%]">
          <h3 className="text-md font-semibold text-white line-clamp-1">
            {task.title}
          </h3>
        </div>

        {/* 3 dots menu */}
        {task.creator.id == user.id && (
          <div className="relative">
            <button
              onClick={(e) => {
                onToggleMenu(task.id);
                e.stopPropagation();
              }}
              className="p-2 rounded-lg hover:bg-gray-700/40 transition text-gray-400"
            >
              {isMenuOpen ? (
                <X size={16} className="animate-flip-up" />
              ) : (
                <MoreVertical size={16} className="animate-flip-up" />
              )}
            </button>

            {/* Menu Dropdown */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-45 bg-secondary border border-gray-700 rounded-lg shadow-lg overflow-hidden animate-fadeIn z-20">
                <button
                  onClick={() => {
                    onToggleMenu(task.id);
                    openEditModal();
                  }}
                  className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm hover:bg-gray-700 transition"
                >
                  <Edit size={16} color="orange" />
                  <span> Edit</span>
                </button>

                <button
                  onClick={() => {
                    onToggleMenu(task.id);
                  }}
                  className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm hover:bg-gray-700 transition"
                >
                  <SquareCheckBig size={16} color="violet" />
                  <span> Mark as Completed</span>
                </button>

                <button
                  onClick={() => {
                    onToggleMenu(task.id);
                  }}
                  className="w-full flex gap-2 items-center text-left px-4 py-2 text-sm  hover:bg-red-500/50 transition"
                >
                  <Trash size={16} color="#b23838" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-400">{task.description}</p>
      {/* Task Status & Priority */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full">
          {task.status
            .replace("_", " ")
            .replace(/\b\w/g, (c) => c.toUpperCase())}
        </span>
        <span
          className={`px-3 py-1 rounded-full ${
            task.priority === TaskPriority.HIGH
              ? "bg-red-500/10 border border-red-500 text-red-400"
              : task.priority === TaskPriority.MEDIUM
              ? "bg-yellow-500/10 text-orange-400 border border-orange-500"
              : "bg-blue-500/10 text-blue-400 border border-blue-500"
          }`}
        >
          {task.priority}
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

      {/* Task details Modal */}
      {isTaskDetailModalOpen && !isMenuOpen && (
        <TaskDetailsModal
          taskId={task.id}
          role={task.creator.id === user.id ? "creator" : "contributor"}
          onClose={handleCloseModal}
          key={task.id}
          fetchTasks={fetchTasks}
        />
      )}

      {/* Task Edit Modal */}
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

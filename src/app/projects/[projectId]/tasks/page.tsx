"use client";

import CreateTaskModal from "@/components/features/CreateTaskModal";
import { SectionTabs } from "@/components/features/SectionTabs";
import TaskBoard from "@/components/features/TaskBoard";
import { LoadingSpinner } from "@/components/layout/LoadingSpinner";
import { projectTabPermissions } from "@/constants/common/tab-permission";
import { PROJECT_ROUTES } from "@/constants/routes/project-routes";
import { useRole } from "@/hook/useRole";
import { projectService } from "@/services/user/project-service";
import { taskService } from "@/services/user/task-service";
import { IProject, Role } from "@/types/project";
import { ITask } from "@/types/task";

import axios from "axios";
import { ArrowLeft, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const tabRoutes = [
  { name: "Overview", path: "" },
  { name: "Applications", path: "/applications" },
  { name: "Contributors", path: "/contributors" },
  { name: "Tasks", path: "/tasks" },
  { name: "Team Chat", path: "/chat" },
  // { name: "Payments", path: "/payments" },
];

export default function Tasks() {
  const { projectId } = useParams<{ projectId: string }>();
  const router = useRouter();

  const [project, setProject] = useState<IProject | null>(null);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [open, setOpen] = useState(false);

  const currentRole = useRole(project);

  const visibleTabs = useMemo(() => {
    if (!projectId) return [];
    return tabRoutes
      .filter((tab) => projectTabPermissions[currentRole].includes(tab.name))
      .map((tab) => ({
        name: tab.name,
        href: `/projects/${projectId}${tab.path}`,
      }));
  }, [projectId, currentRole]);

  const onBackClick = () => {
    router.replace(PROJECT_ROUTES.MY_PROJECTS);
  };

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        console.log("projectId: ", projectId);

        const res = await projectService.getProject(projectId);
        if (res.success) {
          console.log("res data: ", res.data);
          setProject(res.data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        }
      }
    };
    fetchProject();
  }, [projectId]);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      if (currentRole === Role.VIEWER) {
        console.log("Invalid role to fetch tasks");
        return;
      }
      const res = await taskService.listTasks(projectId, currentRole);

      if (res.success) {
        setTasks(res.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  }, [projectId, currentRole]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (taskData: FormData) => {
    if (!projectId) return;

    try {
      const res = await taskService.createTask(projectId, taskData);
      if (res.success) {
        toast.success(res.message);
        fetchTasks();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      }
    }
  };

  if (!projectId) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl w-full space-y-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start justify-between w-full">
          {/* Left */}
          <div className="flex gap-2 min-w-0">
            <button onClick={onBackClick} className="cursor-pointer shrink-0">
              <ArrowLeft />
            </button>

            <div className="flex flex-col min-w-0">
              <h1 className="text-md md:text-3xl font-semibold truncate">
                {project?.title}
              </h1>

              {project?.createdAt && (
                <p className="text-xs md:text-sm text-gray-400">
                  Posted {new Date(project?.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {/* Right */}
          {currentRole === Role.CREATOR && (
            <button
              className="flex items-center md:gap-1 bg-btn-primary text-text-primary p-1 md:px-2 md:py-1 rounded-full md:rounded cursor-pointer shrink-0"
              onClick={() => setOpen(!open)}
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Create</span>
            </button>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={open}
        onClose={() => setOpen(!open)}
        onSubmit={handleCreateTask}
        projectId={projectId}
      />

      {/* Tabs */}
      <SectionTabs tabs={visibleTabs} />

      {/* Tasks List */}
      <main className="flex-1">
        <TaskBoard tasks={tasks} fetchTasks={fetchTasks} />
      </main>
    </div>
  );
}

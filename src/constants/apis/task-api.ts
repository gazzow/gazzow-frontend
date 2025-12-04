import { Role } from "@/types/project";

export const TASK_API = {
  CREATE: (projectId: string) => `/projects/${projectId}/tasks`,
  LIST_TASK: (projectId: string, role: Role) =>
    `/projects/${projectId}/tasks/${role}`,
  GET_TASK: (taskId: string, projectId: string) =>
    `/projects/${projectId}/tasks/${taskId}`,
  UPDATE_TASK: (taskId: string, projectId: string) =>
    `/projects/${projectId}/tasks/${taskId}`,
  START_WORK: (taskId: string, projectId: string) =>
    `/projects/${projectId}/tasks/${taskId}/start`,
  SUBMIT_TASK: (taskId: string, projectId: string) =>
    `/projects/${projectId}/tasks/${taskId}/submit`,
  COMPLETE_TASK: (taskId: string, projectId: string) =>
    `/projects/${projectId}/tasks/${taskId}/complete`,
};

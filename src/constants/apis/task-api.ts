import { Role } from "@/types/project";

export const TASK_API = {
  CREATE: (projectId: string) =>
    `/projects/${projectId}/tasks`,
  LIST_TASK: (projectId: string, role: Role) =>
    `/projects/${projectId}/tasks/${role}`,
};

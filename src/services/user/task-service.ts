import { TASK_API } from "@/constants/apis/task-api";
import api from "@/lib/axios/api";
import { Role } from "@/types/project";
import { CreateTaskInput } from "@/validators/task-create";

export const taskService = {
  async createTask(projectId: string, taskData: CreateTaskInput) {
    const res = await api.post(TASK_API.CREATE(projectId), taskData);
    console.log("create task response: ", res);
    return res.data;
  },
  async listTasks(projectId: string, role: Role) {
    const res = await api.get(TASK_API.LIST_TASK(projectId, role));
    console.log("List task response: ", res);
    return res.data;
  },
};

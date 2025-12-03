import { TASK_API } from "@/constants/apis/task-api";
import api from "@/lib/axios/api";
import { Role } from "@/types/project";
import { ITask } from "@/types/task";
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
  async getTaskDetails(taskId: string, projectId: string) {
    const res = await api.get(TASK_API.GET_TASK(taskId, projectId));
    console.log("Get task details response: ", res);
    return res.data;
  },
  async updateTask(taskId: string, projectId: string, data: Partial<ITask>) {
    const res = await api.patch(TASK_API.UPDATE_TASK(taskId, projectId), data);
    console.log("Get task details response: ", res);
    return res.data;
  },
  async startWork(taskId: string, projectId: string, time: string) {
    const res = await api.put(TASK_API.START_WORK(taskId, projectId), {
      time,
    });
    console.log("Start task work response: ", res);
    return res.data;
  },
};

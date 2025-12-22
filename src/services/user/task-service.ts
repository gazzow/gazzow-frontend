import { TASK_API } from "@/constants/apis/task-api";
import api from "@/lib/axios/api";
import { Role } from "@/types/project";
import { ITask } from "@/types/task";

export const taskService = {
  async createTask(projectId: string, data: FormData) {
    const res = await api.post(TASK_API.CREATE(projectId), data);
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
  async submitTask(taskId: string, projectId: string, time: string) {
    const res = await api.put(TASK_API.SUBMIT_TASK(taskId, projectId), {
      time,
    });
    console.log("Submit task response: ", res);
    return res.data;
  },
  async completeTask(taskId: string, projectId: string, time: string) {
    const res = await api.put(TASK_API.COMPLETE_TASK(taskId, projectId), {
      time,
    });
    console.log("Complete task response: ", res);
    return res.data;
  },
  async reassignTask(taskId: string, projectId: string, assigneeId: string) {
    const res = await api.patch(TASK_API.REASSIGN_TASK(taskId, projectId), {
      assigneeId,
    });

    console.log("Reassign task response: ", res);
    return res.data;
  },
};

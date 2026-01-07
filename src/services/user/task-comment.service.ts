import { TASK_COMMENT_API } from "@/constants/apis/task-comment";
import api from "@/lib/axios/api";
import { ITaskComment } from "@/types/task-comment";

export const taskCommentService = {
  async createComment(data: Partial<ITaskComment>) {
    const res = await api.post(TASK_COMMENT_API.CREATE, data);
    console.log("create task Comment response: ", res);
    return res.data;
  },
  async getComments(taskId: string) {
    const res = await api.get(TASK_COMMENT_API.GET_COMMENTS(taskId));
    console.log("Get task Comments response: ", res);
    return res.data;
  },
};

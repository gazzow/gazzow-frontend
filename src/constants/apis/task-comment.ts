export const TASK_COMMENT_API = {
  CREATE: "/comments",
  GET_COMMENTS: (taskId: string) => `/comments/${taskId}`,
};

export const PROJECT_API = {
  CREATE_PROJECT: "/projects",
  GET_PROJECT:(projectId: string) =>`/projects/${projectId}`,
  LIST_PROJECTS: "/projects",
  APPLY_PROJECT: (projectId: string) => `/projects/${projectId}/applications`,
  MY_PROJECT: "/projects/me",
};

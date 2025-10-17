export const PROJECT_API = {
  CREATE_PROJECT: "/projects",
  LIST_PROJECTS: "/projects",
  APPLY_PROJECT: (projectId: string) => `/projects/${projectId}/apply`,
};

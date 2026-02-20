export const ADMIN_API = {
  LOGIN: "/admin/auth/login",
  LOGOUT: "/admin/auth/logout",
  USERS: "/admin/users",
  SINGLE_USER: (id: string) => `/admin/users/${id}/`,
  UPDATE_STATUS: (id: string) => `/admin/users/${id}/status`,
  LIST_PROJECTS: `/admin/projects`,
  GET_PROJECT_DETAILS: (projectId: string) => `/admin/projects/${projectId}`,
  DELETE_PROJECT: (projectId: string) => `/admin/projects/${projectId}`,
  LIST_SUBSCRIPTIONS: "/admin/subscriptions",
};

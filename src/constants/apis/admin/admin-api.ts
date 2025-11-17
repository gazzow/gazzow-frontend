export const ADMIN_API = {
  LOGIN: "/admin/auth/login",
  USERS: "/admin/users",
  SINGLE_USER: (id: string) => `/admin/users/${id}/`,
  UPDATE_STATUS: (id: string) => `/admin/users/${id}/status`,
  LIST_PROJECTS: `/admin/projects`,
};

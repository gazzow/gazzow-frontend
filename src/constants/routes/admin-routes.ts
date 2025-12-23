export const ADMIN_ROUTES = {
  LOGIN: "/admin/login",
  DASHBOARD: "/admin/dashboard",
  USER_MANAGEMENT: "/admin/user-management",
  PROJECTS: "/admin/projects",
  PROJECT_DETAILS: (id: string): string => `/admin/projects/${id}`,
  PROFILE: "",
  PLANS: "/admin/plans",
  SUBSCRIPTIONS: "/admin/subscriptions",
};

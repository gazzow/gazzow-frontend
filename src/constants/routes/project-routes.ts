export const PROJECT_ROUTES = {
    BROWSE : "/projects",
    DETAILS: (id: string) => `/projects/${id}`,
    TASKS: (id: string) => `/projects/${id}/tasks`,
    CREATE: '/projects/create',
    MY_PROJECTS: '/projects/my-projects',
}
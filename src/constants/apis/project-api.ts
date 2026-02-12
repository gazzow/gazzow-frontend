export const PROJECT_API = {
  CREATE_PROJECT: "/projects",
  GET_PROJECT: (projectId: string) => `/projects/${projectId}`,
  UPDATE_PROJECT: (projectId: string) => `/projects/${projectId}`,
  LIST_PROJECTS: "/projects",
  DELETE_PROJECT: (projectId: string) => `/projects/${projectId}`,
  APPLY_PROJECT: (projectId: string) => `/projects/${projectId}/applications`,
  MY_PROJECT: "/projects/me",
  GENERATE_SIGNED_URL: (fileKey: string) =>
    `/projects/generate-signed-url?fileKey=${fileKey}`,
  LIST_APPLICANTS: (projectId: string) => `/projects/${projectId}/applications`,
  UPDATE_APPLICATION_STATUS: (projectId: string, applicationId: string) =>
    `/projects/${projectId}/applications/${applicationId}`,
  LIST_CONTRIBUTORS: (projectId: string) =>
    `/projects/${projectId}/contributors`,
  UPDATE_CONTRIBUTOR_STATUS: (projectId: string) =>
    `/projects/${projectId}/contributors`,
};

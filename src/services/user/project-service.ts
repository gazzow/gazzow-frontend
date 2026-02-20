import { PROJECT_API } from "@/constants/apis/project-api";
import api from "@/lib/axios/api";
import { ApplicationStatus } from "@/types/application";
import { ContributorStatus } from "@/types/contributor";
import { IProject } from "@/types/project";

type ApplyProjectPayload = {
  proposal?: string;
  expectedRate: number | "";
};

type UpdateApplicationStatusPayload = {
  projectId: string;
  applicationId: string;
  status: ApplicationStatus;
};

type ListProjectsParams = {
  search: string;
  experience?: string;
  budgetOrder?: "asc" | "desc";
  skip?: number;
  limit?: number;
};

type ListMyProjectsParams = {
  search?: string;
  status?: string;
  budgetOrder?: "asc" | "desc" | "";
  skip: number;
  limit: number;
};
export const projectService = {
  async createProject(data: FormData) {
    const res = await api.post(PROJECT_API.CREATE_PROJECT, data);
    console.log("create project response: ", res);
    return res.data;
  },
  async getProject(projectId: string) {
    const res = await api.get(PROJECT_API.GET_PROJECT(projectId));
    console.log("Get project response: ", res);
    return res.data;
  },
  async updateProject(projectId: string, data: Partial<IProject>) {
    const res = await api.put(PROJECT_API.UPDATE_PROJECT(projectId), data);
    console.log("Update project response: ", res);
    return res.data;
  },
  async listProjects(params: ListProjectsParams) {
    const res = await api.get(PROJECT_API.LIST_PROJECTS, { params });
    console.log("list project response: ", res);
    return res.data;
  },

  async deleteProject(projectId: string) {
    console.log("deleting project");
    const res = await api.delete(PROJECT_API.DELETE_PROJECT(projectId));
    console.log("delete project response: ", res);
    return res.data;
  },

  async myProjects(params: ListMyProjectsParams) {
    const res = await api.get(PROJECT_API.MY_PROJECT, { params });
    console.log("my project response: ", res);
    return res.data;
  },
  async generateSignedUrl(fileKey: string) {
    const res = await api.get(PROJECT_API.GENERATE_SIGNED_URL(fileKey));
    console.log("signed url response: ", res);
    return res.data;
  },
  async createApplication(data: ApplyProjectPayload, projectId: string) {
    const res = await api.post(PROJECT_API.APPLY_PROJECT(projectId), data);
    console.log("Apply project response: ", res);
    return res.data;
  },
  async listProjectApplicants(projectId: string) {
    const res = await api.get(PROJECT_API.LIST_APPLICANTS(projectId));
    console.log("project applicants response: ", res);
    return res.data;
  },
  async updateApplicationStatus(data: UpdateApplicationStatusPayload) {
    const res = await api.patch(
      PROJECT_API.UPDATE_APPLICATION_STATUS(data.projectId, data.applicationId),
      { status: data.status },
    );
    console.log("Update application Status response: ", res);
    return res.data;
  },
  async listProjectContributors(projectId: string) {
    const res = await api.get(PROJECT_API.LIST_CONTRIBUTORS(projectId));
    console.log("project contributors response: ", res);
    return res.data;
  },
  async updateContributorStatus(
    projectId: string,
    contributorId: string,
    status: ContributorStatus,
  ) {
    const res = await api.patch(
      PROJECT_API.UPDATE_CONTRIBUTOR_STATUS(projectId),
      { contributorId, status },
    );
    console.log("update contributor status response: ", res);
    return res.data;
  },
};

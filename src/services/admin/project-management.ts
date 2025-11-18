import { ADMIN_API } from "@/constants/apis/admin/admin-api";
import api from "@/lib/axios/api";

export const projectManagementService = {
  listProjects: async (params: {
    skip?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    sortField?: string;
    sortOrder?: string;
  }) => {
    const res = await api.get(ADMIN_API.LIST_PROJECTS, { params });
    console.log("list project response: ", res.data);
    return res.data;
  },
  getProjectDetails: async (projectId: string) => {
    const res = await api.get(ADMIN_API.GET_PROJECT_DETAILS(projectId));
    console.log("get project details response: ", res);
    return res.data;
  },
};

import { ADMIN_API } from "@/constants/apis/admin/admin-api";
import api from "@/lib/axios/api";

export const projectManagementService = {
  listProjects: async () => {
    const res = await api.get(ADMIN_API.LIST_PROJECTS);
    console.log("list project response: ", res.data);
    return res.data;
  },
};

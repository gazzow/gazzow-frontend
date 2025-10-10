import { PROJECT_API } from "@/constants/apis/project-api";
import api from "@/lib/axios/api";

type CreateProjectPayload = {
  title: string;
  description: string;
  techStacks: string[];
  visibility: "public" | "invite";
  developersNeeded: number;
  experience: string;
  budgetMin: number;
  budgetMax: number;
  durationMin: number;
  durationMax: number;
  durationUnit: "weeks" | "months";
};

export const projectService = {
  async createProject(data: CreateProjectPayload) {
    const res = await api.post(PROJECT_API.CREATE_PROJECT, data);
    console.log("create project response: ", res);
    return res.data;
  },
  async listProjects() {
    const res = await api.get(PROJECT_API.LIST_PROJECTS);
    console.log('list project response: ', res);
    return res.data;
  }
};

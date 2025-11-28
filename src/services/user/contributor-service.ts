import { CONTRIBUTOR_API } from "@/constants/apis/contributor-api";
import api from "@/lib/axios/api";
import { ApplicationStatus } from "@/types/application";

export const contributorService = {
  async listContributorProjects(params: {
    search: string;
    budgetOrder?: "asc" | "desc";
    skip: number;
    limit: number;
  }) {
    const res = await api.get(CONTRIBUTOR_API.LIST_ACTIVE_PROJECTS, { params });
    console.log("List Active Projects response: ", res);
    return res.data;
  },

  async listContributorProposals(params: {
    search?: string;
    status: ApplicationStatus;
    skip: number;
    limit: number;
  }) {
    const res = await api.get(CONTRIBUTOR_API.LIST_CONTRIBUTOR_PROPOSAL, {
      params,
    });
    console.log("List Active Projects response: ", res);
    return res.data;
  },
};

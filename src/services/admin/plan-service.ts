import { PLAN_API } from "@/constants/apis/admin/plan-api";
import api from "@/lib/axios/api";
import { IPlan } from "@/types/plan";

export const planService = {
  async createPlan(data: Partial<IPlan>) {
    const res = await api.post(PLAN_API.CREATE, data);
    console.log("create plan response: ", res);
    return res.data;
  },
  async listPlans() {
    const res = await api.get(PLAN_API.LIST_PlANS);
    console.log("list plan response: ", res);
    return res.data;
  },
  async getPlan(planId: string) {
    const res = await api.get(PLAN_API.GET_PLAN(planId));
    console.log("Get plan response: ", res);
    return res.data;
  },
  async updatePlan(planId: string, data: Partial<IPlan>) {
    const res = await api.put(PLAN_API.UPDATE_PLAN(planId), data);
    console.log("Update plan response: ", res);
    return res.data;
  },
  async updateStatus(planId: string, isActive: boolean) {
    const res = await api.patch(PLAN_API.UPDATE_STATUS(planId), { isActive });
    console.log("Update plan status response: ", res);
    return res.data;
  },
};

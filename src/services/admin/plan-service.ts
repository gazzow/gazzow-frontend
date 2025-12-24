import { PLAN_API } from "@/constants/apis/admin/plan-api";
import api from "@/lib/axios/api";
import { IPlan } from "@/types/plan";

export const planService = {
  async createPlan(data: Partial<IPlan>) {
    console.log('create plan payload: ', data)
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
};

import { ADMIN_API } from "@/constants/apis/admin/admin-api";
import api from "@/lib/axios/api";

export const subscriptionManagementService = {
  async listSubscriptions() {
    const res = await api.get(ADMIN_API.LIST_SUBSCRIPTIONS);
    console.log("list plans response: ", res);
    return res.data;
  },
};

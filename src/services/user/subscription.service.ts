import { SUBSCRIPTION_API } from "@/constants/apis/subscription-api";
import api from "@/lib/axios/api";
import { PlanDuration } from "@/types/plan";

export const subscriptionService = {
  async listPlans(duration: PlanDuration) {
    const res = await api.get(SUBSCRIPTION_API.LIST_PlANS(duration));
    console.log("list plans response: ", res);
    return res.data;
  },
  async createSubscriptionCheckout(planId: string) {
    const res = await api.post(SUBSCRIPTION_API.PAYMENT_CHECKOUT, {
      planId,
    });
    console.log("Subscription checkout response: ", res);
    return res.data;
  },

  async getCurrentSubscription() {
    const res = await api.get(SUBSCRIPTION_API.GET_SUBSCRIPTION);
    console.log("Current Subscription response: ", res);
    return res.data;
  },
};
  
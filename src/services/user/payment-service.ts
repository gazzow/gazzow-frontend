import { PAYMENT_API } from "@/constants/apis/payment-api";
import api from "@/lib/axios/api";

export const paymentService = {
  async createConnectAccount() {
    const res = await api.post(PAYMENT_API.CONNECT_ACCOUNT);
    console.log("Create connect account response: ", res);
    return res.data;
  },
  async generateOnboardingUrl() {
    const res = await api.get(PAYMENT_API.ONBOARDING_LINK);
    console.log("generate onboarding url response: ", res);
    return res.data;
  },
  async checkOnboardingStatus() {
    const res = await api.get(PAYMENT_API.CHECK_ONBOARDING_STATUS);
    console.log("check onboarding status response ", res);
    return res.data;
  },
  async taskCheckoutSession(taskId: string) {
    const res = await api.post(PAYMENT_API.TASK_CHECKOUT_SESSION, {
      taskId,
    });
    console.log("Pay for task response: ", res);
    return res.data;
  },
  async listPayments() {
    const res = await api.get("/admin/dashboard/payments");
    console.log("List admin payments response ", res);
    return res.data;
  },
};

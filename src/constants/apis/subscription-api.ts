import { PlanDuration } from "@/types/plan";

export const SUBSCRIPTION_API = {
  LIST_PlANS: (duration: PlanDuration) =>
    `/subscriptions/plans?duration=${duration}`,
  PAYMENT_CHECKOUT: "/payments/subscription-checkout",
  GET_SUBSCRIPTION: "/subscriptions",
};

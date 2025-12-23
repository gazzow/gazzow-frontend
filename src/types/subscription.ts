import { PlanDuration, PlanFeature, PlanType } from "./plan";

export interface IActivePlan {
  name: string;
  type: PlanType;
  price: number;
  features: PlanFeature;
  duration: PlanDuration;
}

export enum SubscriptionStatus {
  TRIAL = "trial",
  ACTIVE = "active",
  EXPIRED = "expired",
  CANCELED = "canceled",
}

export interface ISubscription {
  id: string;
  userId: string;
  planId: string;
  activePlan: IActivePlan;
  status: SubscriptionStatus;
  paymentId?: string;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  canceledAt?: Date;
  expiredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

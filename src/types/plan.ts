
export interface PlanFeature {
  commissionRate: number;
}

export interface IPlan {
  id: string;
  name: string;
  type: PlanType;
  price: number;
  features: PlanFeature;
  duration: PlanDuration;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum PlanType {
  BASE = "base",
  PREMIUM = "premium",
  DIAMOND = "diamond",
}

export enum PlanDuration {
  MONTHLY = "monthly",
  YEARLY = "yearly",
}


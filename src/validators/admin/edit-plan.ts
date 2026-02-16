import { z } from "zod";
import { PlanDuration, PlanType } from "@/types/plan";

export const editPlanSchema = z.object({
  name: z.string().min(2).optional(),

  type: z.enum(PlanType).optional(),

  duration: z.enum(PlanDuration).optional(),

  price: z.number().min(0).optional(),

  commissionRate: z.number().min(0).max(100).optional(),

  isActive: z.boolean().optional(),
});

export type EditPlanFormValues = z.infer<typeof editPlanSchema>;

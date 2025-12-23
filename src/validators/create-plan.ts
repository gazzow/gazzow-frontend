// create-plan.schema.ts
import { PlanDuration, PlanType } from "@/types/plan";
import { z } from "zod";

export const createPlanSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(PlanType),
  duration: z.enum(PlanDuration),
  price: z
    .number({ error: "Price is required" })
    .min(0, "Price must be greater than 0"),

  commissionRate: z
    .number({ error: "Commission rate is required" })
    .min(0, "Must be at least 0%")
    .max(100, "Cannot exceed 100%"),
});

export type CreatePlanFormValues = z.infer<typeof createPlanSchema>;

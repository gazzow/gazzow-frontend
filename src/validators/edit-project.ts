import { ProjectVisibility } from "@/types/project";
import { z } from "zod";

export const editProjectSchema = z
  .object({
    title: z
      .string()
      .min(10, "Title must be at least 10 characters")
      .max(80, "Title must not exceed 80 characters"),

    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(699, "Description must not exceed 699 characters"),

    requiredSkills: z
      .array(z.string())
      .min(1, "Select at least one tech stack"),

    visibility: z.enum(ProjectVisibility, "Please select project visibility"),

    developersNeeded: z
      .string()
      .min(1, "Developers needed is required")
      .refine((num) => !isNaN(Number(num)) && Number(num) > 0, {
        message: "Must be a valid number greater than 0",
      }),

    experience: z.string().min(1, "Please select preferred experience"),

    // Budget validations
    budgetMin: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
        message: "Minimum budget must be a positive number",
      }),

    budgetMax: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Maximum budget must be a valid number",
      }),

    // Duration validations
    durationMin: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Minimum duration must be valid",
      }),

    durationMax: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Maximum duration must be valid",
      }),

    durationUnit: z.enum(["weeks", "months"], "Please select duration unit"),
  })
  .refine((data) => Number(data.budgetMax) >= Number(data.budgetMin), {
    message: "Maximum budget must be greater than or equal to minimum budget",
    path: ["budgetMax"],
  })
  .refine((data) => Number(data.durationMax) >= Number(data.durationMin), {
    message:
      "Maximum duration must be greater than or equal to minimum duration",
    path: ["durationMax"],
  });

export type EditProjectInput = z.infer<typeof editProjectSchema>;

import { z } from "zod";

export const applyProjectSchema = z.object({
  proposal: z
    .string()
    .trim()
    .min(10, { message: "Proposal must be at least 10 characters" })
    .max(300, { message: "Proposal cannot exceed 300 characters" })
    .optional(),

  expectedRate: z.coerce
    .number()
    .min(1, { message: "Expected rate must be greater than 0" }),
});

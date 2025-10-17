import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email"),
});

export type forgotInput = z.infer<typeof forgotPasswordSchema>;

import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ error: "Invalid format. Name must be string" })
    .min(3, { error: "Name must be at least 3 characters" })
    .max(25, { error: "Name is too long" }),
  email: z.email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
});

export type SignupInput = z.infer<typeof signupSchema>;

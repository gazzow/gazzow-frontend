import { z } from "zod";

export const onboardingSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters").max(200),
  developerRole: z.string().nonempty("Please select a role"),
  experience: z.string().nonempty("Please select your experience"),
  techStacks: z.array(z.string()).min(1, "Select at least one tech stack"),
  learningGoals: z.array(z.string()).min(1, "Select at least one learning goal"),
  imageUrl: z.string().url("Profile image is required"),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

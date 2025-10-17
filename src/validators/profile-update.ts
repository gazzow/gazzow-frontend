import { z } from "zod";

export const profileUpdateSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(25, "Name must be within limit of 25 characters").nonempty("Please enter your name"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(200),
  developerRole: z.string().nonempty("Please select a role"),
  experience: z.string().nonempty("Please select your experience"),
  techStacks: z.array(z.string()).min(1, "Select at least one tech stack"),
  learningGoals: z.array(z.string()).min(1, "Select at least one learning goal"),
  imageUrl: z.url("Profile image is required"),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;

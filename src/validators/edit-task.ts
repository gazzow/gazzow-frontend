import { TaskPriority } from "@/types/task";
import z from "zod";

export const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  assigneeId: z.string().optional().nullable(),
  estimatedHours: z.number().min(1, "Estimated hours must be at least 1"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(Object.values(TaskPriority)),
  expectedRate: z.number().min(0).optional(),
});

export type FormValues = z.infer<typeof schema>;
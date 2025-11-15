import z from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(699, "Description must not exceed 699 characters"),
  assigneeId: z.string().min(1, "Please select a contributor"),
  estimatedHours: z.number().refine((val) => val > 0, {
    message: "Estimated hours must be greater than 0",
  }),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Please select a valid due date",
    })
    .refine((val) => new Date() <= new Date(val), {
      message: "Due date must me be in the future",
    }),
  priority: z.string().min(1, "Please select task priority"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

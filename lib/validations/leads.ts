import { z } from "zod";

export const quickCallbackSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  phone: z
    .string()
    .min(6, "Please enter a valid phone number")
    .max(25, "Phone number is too long"),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  project: z.string().max(120).optional(),
  message: z.string().max(1000, "Message cannot exceed 1000 characters").optional(),
});

export type QuickCallbackInput = z.infer<typeof quickCallbackSchema>;

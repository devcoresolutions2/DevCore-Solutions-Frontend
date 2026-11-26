import { z } from "zod";

export const phoneRegex = /^\+?[1-9]\d{6,14}$/;

export const estimatorStep1Schema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(80, "Full name cannot exceed 80 characters"),
  workEmail: z
    .string()
    .email("Please provide a valid corporate or work email address"),
  countryCode: z.string().default("+880"),
  phone: z
    .string()
    .min(6, "Please enter a valid phone number")
    .max(25, "Phone number is too long"),
  company: z.string().max(100, "Company name is too long").optional().or(z.literal("")),
  role: z.string().max(100, "Job title is too long").optional().or(z.literal("")),
});

export const estimatorStep2Schema = z.object({
  services: z
    .array(z.string())
    .min(1, "Please select at least one engineering service"),
  budgetTier: z
    .string()
    .min(1, "Please select an estimated capital allocation tier"),
  timeline: z
    .string()
    .min(1, "Please select your target delivery timeline"),
});

export const estimatorStep3Schema = z.object({
  brief: z
    .string()
    .min(20, "Please provide at least 20 characters describing your technical requirements")
    .max(3000, "Brief cannot exceed 3000 characters"),
  attachmentNote: z.string().max(500).optional().or(z.literal("")),
  consent: z.literal(true, {
    message: "You must agree to our data handling and mutual confidentiality",
  }),
  honeypot: z.string().max(0, "Bot detected").optional().or(z.literal("")),
});

export const fullEstimatorSchema = estimatorStep1Schema
  .merge(estimatorStep2Schema)
  .merge(estimatorStep3Schema);

export type EstimatorStep1Input = z.infer<typeof estimatorStep1Schema>;
export type EstimatorStep2Input = z.infer<typeof estimatorStep2Schema>;
export type EstimatorStep3Input = z.infer<typeof estimatorStep3Schema>;
export type FullEstimatorInput = z.infer<typeof fullEstimatorSchema>;

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

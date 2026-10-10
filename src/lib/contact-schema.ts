import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters for your name.")
    .max(100, "Keep your name to 100 characters or fewer."),
  email: z.string().trim().max(254, "Keep your email to 254 characters or fewer.").email("Enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Describe your project in at least 10 characters.")
    .max(2000, "Keep your message to 2,000 characters or fewer."),
});

export type ContactPayload = z.infer<typeof contactSchema>;

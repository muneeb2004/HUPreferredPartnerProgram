import { z } from "zod";

export const newsletterSchema = z.object({
  newsletterId: z.string().min(1, "Series is required"),
  slug: z.string().min(1, "Slug is required"),
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  pdfId: z.string().optional(),
  publishedAt: z.string().optional(),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;

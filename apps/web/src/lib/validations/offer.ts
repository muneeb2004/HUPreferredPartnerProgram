import { z } from "zod";

export const offerSchema = z.object({
  partnerId: z.string().min(1, "Partner is required."),
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  code: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED", "BOGO", "OTHER"]).default("PERCENTAGE"),
  discountValue: z.coerce.number().min(0, "Must be a positive value"),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  terms: z.string().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export type OfferFormValues = z.infer<typeof offerSchema>;

import { z } from "zod";

export const offerSchema = z.object({
  partnerId: z.string().min(1, "Partner is required."),
  title: z.string().min(2, "Title must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  code: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED", "BOGO", "OTHER"]),
  discountValue: z.union([z.string(), z.number()]).transform((v) => Number(v)).pipe(z.number().min(0, "Must be a positive value")),
  startDate: z.string().optional().or(z.literal("")),
  endDate: z.string().optional().or(z.literal("")),
  terms: z.string().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]),
});

export type OfferFormValues = z.infer<typeof offerSchema>;
export type OfferFormInput = z.input<typeof offerSchema>;

export const portalOfferSchema = offerSchema.omit({ partnerId: true }).extend({
  status: z.enum(["DRAFT", "REVIEW", "ARCHIVED"]).default("DRAFT"),
});

export type PortalOfferFormValues = z.infer<typeof portalOfferSchema>;
export type PortalOfferFormInput = z.input<typeof portalOfferSchema>;

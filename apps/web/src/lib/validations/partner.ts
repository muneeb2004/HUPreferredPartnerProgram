import { z } from "zod";

export const partnerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  slug: z.string().min(2, "Slug must be at least 2 characters.").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  tier: z.string().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]),
  featured: z.boolean(),
});

export type PartnerFormValues = z.infer<typeof partnerSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  logoId: z.string().optional(),
  heroId: z.string().optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

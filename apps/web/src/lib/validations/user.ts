import { z } from "zod";

export const userRoleSchema = z.object({
  role: z.enum(["ADMIN", "EDITOR", "BRAND_MANAGER", "VIEWER"]),
});

export type UserRoleFormValues = z.infer<typeof userRoleSchema>;

import * as z from "zod"

export const profileSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
})

export type ProfileSettingsInput = z.input<typeof profileSettingsSchema>
export type ProfileSettingsValues = z.output<typeof profileSettingsSchema>

export const passwordSettingsSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters")
    .max(100, "New password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type PasswordSettingsInput = z.input<typeof passwordSettingsSchema>
export type PasswordSettingsValues = z.output<typeof passwordSettingsSchema>

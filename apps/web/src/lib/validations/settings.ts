import { PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE } from "@hu-partner/utils"
import * as z from "zod"

export const profileSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
})

export type ProfileSettingsInput = z.input<typeof profileSettingsSchema>
export type ProfileSettingsValues = z.output<typeof profileSettingsSchema>

export const passwordSettingsSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH, `New password must be at least ${PASSWORD_MIN_LENGTH} characters`)
    .max(PASSWORD_MAX_LENGTH, `New password must be less than ${PASSWORD_MAX_LENGTH} characters`)
    .regex(PASSWORD_REGEX, PASSWORD_REGEX_MESSAGE),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type PasswordSettingsInput = z.input<typeof passwordSettingsSchema>
export type PasswordSettingsValues = z.output<typeof passwordSettingsSchema>

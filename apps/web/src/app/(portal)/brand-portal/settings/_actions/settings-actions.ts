"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { type ProfileSettingsValues, type PasswordSettingsValues } from "@/lib/validations/settings"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function updateProfileSettings(data: ProfileSettingsValues): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return { success: false, error: "Unauthorized" }
    }

    const res = await fetch(`${API_URL}/api/v1/portal/settings/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = (await res.json()) as { message?: string | string[] }
      const message = Array.isArray(errorData.message) ? errorData.message[0] : errorData.message
      return { success: false, error: message || "Failed to update profile" }
    }

    revalidatePath("/brand-portal/settings")
    return { success: true }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updatePasswordSettings(data: PasswordSettingsValues): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return { success: false, error: "Unauthorized" }
    }

    const res = await fetch(`${API_URL}/api/v1/portal/settings/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    })

    if (!res.ok) {
      const errorData = (await res.json()) as { message?: string | string[] }
      const message = Array.isArray(errorData.message) ? errorData.message[0] : errorData.message
      return { success: false, error: message || "Failed to update password" }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" }
  }
}

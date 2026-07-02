"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { updateProfileSchema, type UpdateProfileFormValues } from "@/lib/validations/partner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function updatePortalProfile(
  data: UpdateProfileFormValues
): Promise<{ success: boolean; error?: string }> {
  // Validate input
  const parsed = updateProfileSchema.safeParse(data)
  
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) {
      return { success: false, error: "Unauthorized" }
    }

    const response = await fetch(`${API_URL}/api/v1/portal/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(parsed.data),
    })

    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string }
      return { 
        success: false, 
        error: errorData.message || "Failed to update profile" 
      }
    }

    // Revalidate the profile path to reflect changes
    revalidatePath("/brand-portal/profile")
    
    return { success: true }
  } catch (error) {
    console.error("Failed to update portal profile:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}

"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { portalOfferSchema, type PortalOfferFormValues } from "@/lib/validations/offer"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function createPortalOffer(data: PortalOfferFormValues): Promise<{ success: boolean; error?: string }> {
  const parsed = portalOfferSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) return { success: false, error: "Unauthorized" }

    const res = await fetch(`${API_URL}/api/v1/portal/offers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(parsed.data),
    })

    if (!res.ok) {
      const errorData = (await res.json()) as { message?: string }
      return { success: false, error: errorData.message || "Failed to create offer" }
    }

    revalidatePath("/brand-portal/offers")
    revalidatePath("/brand-portal")
    return { success: true }
  } catch (error) {
    console.error("Failed to create portal offer:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}

export async function updatePortalOffer(id: string, data: PortalOfferFormValues): Promise<{ success: boolean; error?: string }> {
  const parsed = portalOfferSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) return { success: false, error: "Unauthorized" }

    const res = await fetch(`${API_URL}/api/v1/portal/offers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(parsed.data),
    })

    if (!res.ok) {
      const errorData = (await res.json()) as { message?: string }
      return { success: false, error: errorData.message || "Failed to update offer" }
    }

    revalidatePath("/brand-portal/offers")
    revalidatePath("/brand-portal")
    return { success: true }
  } catch (error) {
    console.error("Failed to update portal offer:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}

export async function deletePortalOffer(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("accessToken")?.value

    if (!token) return { success: false, error: "Unauthorized" }

    const res = await fetch(`${API_URL}/api/v1/portal/offers/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const errorData = (await res.json()) as { message?: string }
      return { success: false, error: errorData.message || "Failed to delete offer" }
    }

    revalidatePath("/brand-portal/offers")
    revalidatePath("/brand-portal")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete portal offer:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}

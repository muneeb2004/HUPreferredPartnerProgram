"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { OfferFormValues } from "@/lib/validations/offer"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getAuthHeaders() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function createOffer(data: OfferFormValues) {
  try {
    const headers = await getAuthHeaders()
    
    // Convert empty strings to null or properly format dates if needed
    const payload = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    }
    
    const response = await fetch(`${API_URL}/api/v1/offers`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to create offer")
    }

    revalidatePath("/admin/offers")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" }
  }
}

export async function updateOffer(id: string, data: Partial<OfferFormValues>) {
  try {
    const headers = await getAuthHeaders()
    
    const payload = {
      ...data,
      startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
    }
    
    const response = await fetch(`${API_URL}/api/v1/offers/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to update offer")
    }

    revalidatePath("/admin/offers")
    revalidatePath(`/admin/offers/${id}`)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" }
  }
}

export async function deleteOffer(id: string) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/offers/${id}`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to delete offer")
    }

    revalidatePath("/admin/offers")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" }
  }
}

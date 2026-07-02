"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { PartnerFormValues } from "@/lib/validations/partner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getAuthHeaders() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function createPartner(data: PartnerFormValues) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/partners`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to create partner")
    }

    revalidatePath("/admin/partners")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" }
  }
}

export async function updatePartner(slug: string, data: Partial<PartnerFormValues>) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/partners/${slug}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to update partner")
    }

    revalidatePath("/admin/partners")
    revalidatePath(`/admin/partners/${slug}`)
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" }
  }
}

export async function deletePartner(slug: string) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/partners/${slug}`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to delete partner")
    }

    revalidatePath("/admin/partners")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" }
  }
}

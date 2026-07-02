"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { NewsletterFormValues } from "@/lib/validations/newsletter"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getAuthHeaders() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function createNewsletter(data: NewsletterFormValues) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/admin/newsletters`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to create newsletter issue")
    }

    revalidatePath("/admin/newsletters")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" }
  }
}

export async function updateNewsletter(id: string, data: NewsletterFormValues) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/admin/newsletters/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to update newsletter issue")
    }

    revalidatePath("/admin/newsletters")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" }
  }
}

export async function deleteNewsletter(id: string) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/admin/newsletters/${id}`, {
      method: "DELETE",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to delete newsletter issue")
    }

    revalidatePath("/admin/newsletters")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" }
  }
}

export async function sendNewsletter(id: string) {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/admin/newsletters/${id}/send`, {
      method: "POST",
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || "Failed to send newsletter")
    }

    revalidatePath("/admin/newsletters")
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || "Something went wrong" }
  }
}

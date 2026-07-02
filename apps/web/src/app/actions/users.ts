"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

import { type UserRoleFormValues } from "@/lib/validations/user"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getAuthHeaders(): Promise<{ Authorization?: string; "Content-Type": string; }> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

export async function updateUserRole(id: string, data: UserRoleFormValues): Promise<{ success: boolean; error?: never; } | { success: boolean; error: string; }> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/users/${id}/role`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = (await response.json().catch((): Record<string, unknown> => ({}))) as { message?: string }
      throw new Error(errorData.message || "Failed to update role")
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error: unknown) {
    return { success: false, error: (error instanceof Error ? error.message : "An error occurred") || "Something went wrong" }
  }
}

export async function deactivateUser(id: string): Promise<{ success: boolean; error?: never; } | { success: boolean; error: string; }> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/users/${id}/deactivate`, {
      method: "PATCH",
      headers,
    })

    if (!response.ok) {
      const errorData = (await response.json().catch((): Record<string, unknown> => ({}))) as { message?: string }
      throw new Error(errorData.message || "Failed to deactivate user")
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error: unknown) {
    return { success: false, error: (error instanceof Error ? error.message : "An error occurred") || "Something went wrong" }
  }
}

export async function activateUser(id: string): Promise<{ success: boolean; error?: never; } | { success: boolean; error: string; }> {
  try {
    const headers = await getAuthHeaders()
    const response = await fetch(`${API_URL}/api/v1/users/${id}/activate`, {
      method: "PATCH",
      headers,
    })

    if (!response.ok) {
      const errorData = (await response.json().catch((): Record<string, unknown> => ({}))) as { message?: string }
      throw new Error(errorData.message || "Failed to activate user")
    }

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error: unknown) {
    return { success: false, error: (error instanceof Error ? error.message : "An error occurred") || "Something went wrong" }
  }
}

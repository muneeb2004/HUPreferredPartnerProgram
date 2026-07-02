import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { type UpdateProfileFormValues } from "@/lib/validations/partner"

import { ProfileForm } from "./_components/profile-form"

import type { Partner } from "@prisma/client"
import type * as React from "react"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getProfile(): Promise<Partner | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  
  const res = await fetch(`${API_URL}/api/v1/portal/profile`, { 
    headers,
    cache: 'no-store' 
  })
  
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error("Failed to fetch profile")
  }

  const json = (await res.json()) as { data: Partner };
  return json.data;
}

export default async function BrandProfilePage(): Promise<React.JSX.Element> {
  const profile = await getProfile()

  if (!profile) {
    // If the partner profile doesn't exist, this means the DB is in a bad state
    // since the user has a brand manager role but no partner profile.
    notFound()
  }

  const initialData: UpdateProfileFormValues = {
    name: profile.name,
    description: profile.description,
    website: profile.website || "",
    logoId: profile.logoId || "",
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Company Profile</h2>
          <p className="text-muted-foreground mt-1">
            Manage your brand&apos;s public profile and contact information.
          </p>
        </div>
      </div>
      
      <div className="mt-8 border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
        <Suspense fallback={<div>Loading profile...</div>}>
          <ProfileForm initialData={initialData} />
        </Suspense>
      </div>
    </div>
  )
}

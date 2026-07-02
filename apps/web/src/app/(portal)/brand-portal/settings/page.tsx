import { Skeleton } from "@hu-partner/ui"
import { cookies } from "next/headers"
import { Suspense } from "react"

import { PasswordSettingsCard } from "./_components/password-settings-card"
import { ProfileSettingsCard } from "./_components/profile-settings-card"

import type * as React from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getSettings(): Promise<{
  id: string
  name: string
  email: string
  role: string
  partnerName?: string
}> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value

  const res = await fetch(`${API_URL}/api/v1/portal/settings`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch settings")
  }

  return (await res.json()) as {
    id: string
    name: string
    email: string
    role: string
    partnerName?: string
  }
}

function SettingsSkeleton(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  )
}

async function SettingsDashboard(): Promise<React.JSX.Element> {
  const user = await getSettings()

  return (
    <div className="space-y-6 max-w-4xl">
      <ProfileSettingsCard user={user} />
      <PasswordSettingsCard />
    </div>
  )
}

export default function PortalSettingsPage(): React.JSX.Element {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsDashboard />
      </Suspense>
    </div>
  )
}

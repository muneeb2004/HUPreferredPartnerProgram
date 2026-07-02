import { cookies } from "next/headers"

import { NewsletterForm } from "@/components/admin/newsletters/newsletter-form"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getSeries() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/admin/newsletters/series`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!res.ok) return []
  return await res.json()
}

export default async function NewNewsletterPage() {
  const series = await getSeries()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Newsletter Issue</h2>
      </div>
      <div className="mt-8">
        <NewsletterForm series={series} />
      </div>
    </div>
  )
}

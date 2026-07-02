import { notFound } from "next/navigation"
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

async function getNewsletter(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/admin/newsletters/${id}`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!res.ok) {
    return null
  }

  return await res.json()
}

interface EditNewsletterPageProps {
  params: Promise<{ id: string }>
}

export default async function EditNewsletterPage({ params }: EditNewsletterPageProps) {
  const resolvedParams = await params
  const [newsletter, series] = await Promise.all([
    getNewsletter(resolvedParams.id),
    getSeries()
  ])
  
  if (!newsletter) {
    notFound()
  }

  const initialData = {
    ...newsletter,
    publishedAt: newsletter.publishedAt ? new Date(newsletter.publishedAt).toISOString().split('T')[0] : undefined
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Newsletter: {newsletter.title}</h2>
      </div>
      <div className="mt-8">
        <NewsletterForm initialData={initialData} series={series} />
      </div>
    </div>
  )
}

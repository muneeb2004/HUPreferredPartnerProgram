import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { NewsletterForm } from "@/components/admin/newsletters/newsletter-form"
import { type NewsletterFormValues } from "@/lib/validations/newsletter"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getSeries(): Promise<{ id: string; name: string }[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/admin/newsletters/series`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  const json = (await res.json()) as { data: { id: string; name: string }[] };
  return json.data || [];
}

async function getNewsletter(id: string): Promise<(NewsletterFormValues & { id: string, title: string, publishedAt?: string | null }) | null> {
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

  const json = (await res.json()) as { data: NewsletterFormValues & { id: string, title: string, publishedAt?: string | null } };
  return json.data;
}

interface EditNewsletterPageProps {
  params: Promise<{ id: string }>
}

export default async function EditNewsletterPage({ params }: EditNewsletterPageProps): JSX.Element {
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

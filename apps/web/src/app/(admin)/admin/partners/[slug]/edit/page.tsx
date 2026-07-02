import { cookies } from "next/headers"
import { notFound } from "next/navigation"

import { PartnerForm } from "@/components/admin/partners/partner-form"
import { type PartnerFormValues } from "@/lib/validations/partner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getPartner(slug: string): Promise<(PartnerFormValues & { slug: string }) | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  
  const res = await fetch(`${API_URL}/api/v1/partners/${slug}`, { 
    headers,
    cache: 'no-store' 
  })
  
  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error("Failed to fetch partner")
  }

  const json = (await res.json()) as { data: PartnerFormValues & { slug: string } };
  return json.data;
}

interface EditPartnerPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditPartnerPage({ params }: EditPartnerPageProps): JSX.Element {
  const resolvedParams = await params
  const partner = await getPartner(resolvedParams.slug)

  if (!partner) {
    notFound()
  }

  const initialData: PartnerFormValues & { slug: string } = {
    name: partner.name,
    slug: partner.slug,
    description: partner.description,
    website: partner.website || "",
    tier: partner.tier || "Standard",
    status: partner.status,
    featured: partner.featured,
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Partner</h2>
      </div>
      
      <div className="mt-8">
        <PartnerForm initialData={initialData} />
      </div>
    </div>
  )
}

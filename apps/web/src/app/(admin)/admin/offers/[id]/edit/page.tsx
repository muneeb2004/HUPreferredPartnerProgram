import { notFound } from "next/navigation"
import { cookies } from "next/headers"

import { OfferForm } from "@/components/admin/offers/offer-form"
import { OfferFormValues } from "@/lib/validations/offer"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getOffer(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/offers/${id}`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!res.ok) {
    return null
  }

  const { data } = await res.json()
  return data
}

async function getPartners() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/partners`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!res.ok) {
    return []
  }

  const { data } = await res.json()
  return data.map((p: any) => ({ id: p.id, name: p.name }))
}

interface EditOfferPageProps {
  params: Promise<{ id: string }>
}

export default async function EditOfferPage({ params }: EditOfferPageProps) {
  const resolvedParams = await params
  const offer = await getOffer(resolvedParams.id)
  if (!offer) {
    notFound()
  }

  const partners = await getPartners()

  // Format dates for the input[type=date] if they exist
  const formattedOffer = {
    ...offer,
    startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : "",
    endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : "",
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Offer</h2>
      </div>
      <OfferForm initialData={formattedOffer} partners={partners} />
    </div>
  )
}

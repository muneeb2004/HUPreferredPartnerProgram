import { ChevronLeft } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"

import { OfferForm } from "@/app/(portal)/brand-portal/offers/_components/offer-form"
import { type PortalOfferFormValues } from "@/lib/validations/offer"

import type * as React from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getPortalOffer(id: string): Promise<(PortalOfferFormValues & { id: string }) | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/portal/offers/${id}`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!res.ok) {
    if (res.status === 404) return null
    throw new Error("Failed to fetch offer")
  }

  const data = (await res.json()) as PortalOfferFormValues & { id: string; startDate: string | null; endDate: string | null }
  
  return {
    ...data,
    startDate: data.startDate ? new Date(data.startDate).toISOString().split('T')[0] : "",
    endDate: data.endDate ? new Date(data.endDate).toISOString().split('T')[0] : "",
    code: data.code || "",
    terms: data.terms || "",
  }
}

interface EditPortalOfferPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPortalOfferPage({ params }: EditPortalOfferPageProps): Promise<React.JSX.Element> {
  const { id } = await params
  const offer = await getPortalOffer(id)

  if (!offer) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/brand-portal/offers" 
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Back to Offers</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Offer</h2>
          <p className="text-muted-foreground mt-1">
            Update your offer details. It may require review before publishing.
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        <OfferForm initialData={offer} />
      </div>
    </div>
  )
}

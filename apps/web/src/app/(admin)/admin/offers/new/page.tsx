import { cookies } from "next/headers"

import { OfferForm } from "@/components/admin/offers/offer-form"

import type * as React from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getPartners(): Promise<{ id: string; name: string }[]> {
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

  const json = (await res.json()) as { data: { id: string; name: string }[] };
  return json.data;
}

export default async function NewOfferPage(): React.JSX.Element {
  const partners = await getPartners()

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Offer</h2>
      </div>
      <OfferForm partners={partners} />
    </div>
  )
}

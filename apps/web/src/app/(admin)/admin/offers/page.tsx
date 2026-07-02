import { Button } from "@hu-partner/ui"
import { cookies } from "next/headers"
import Link from "next/link"
import { Suspense } from "react"

import { DataTable } from "@/components/layout/admin/data-table"
import { DataTableError } from "@/components/layout/admin/data-table-error"
import { DataTableSkeleton } from "@/components/layout/admin/data-table-skeleton"

import { columns, type OfferColumn } from "./columns"

import type * as React from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getOffers(): Promise<OfferColumn[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/offers`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!res.ok) {
    throw new Error("Failed to fetch offers")
  }

  const json = (await res.json()) as { data: OfferColumn[] }
  return json.data
}

export default function OffersPage(): React.JSX.Element {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Offers</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/admin/offers/new">
              Create Offer
            </Link>
          </Button>
        </div>
      </div>
      <Suspense fallback={<DataTableSkeleton />}>
        <OffersTable />
      </Suspense>
    </div>
  )
}

async function OffersTable(): React.JSX.Element {
  try {
    const data = await getOffers()
    return (
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="title"
        searchPlaceholder="Search offers..."
      />
    )
  } catch (error: unknown) {
    return <DataTableError />
  }
}

import { Button } from "@hu-partner/ui"
import { Plus } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { Suspense } from "react"

import { columns, type PortalOfferColumn } from "@/app/(portal)/brand-portal/offers/columns"
import { DataTable } from "@/components/layout/admin/data-table"
import { DataTableError } from "@/components/layout/admin/data-table-error"
import { DataTableSkeleton } from "@/components/layout/admin/data-table-skeleton"

import type * as React from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getPortalOffers(): Promise<PortalOfferColumn[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/portal/offers`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!res.ok) {
    throw new Error("Failed to fetch offers")
  }

  const json = (await res.json()) as { data: PortalOfferColumn[] }
  return json.data
}

async function OffersTable(): Promise<React.JSX.Element> {
  try {
    const data = await getPortalOffers()
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

export default function BrandPortalOffersPage(): React.JSX.Element {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Offers</h2>
          <p className="text-muted-foreground mt-1">
            Manage the exclusive offers and discounts for students.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/brand-portal/offers/new">
              <Plus className="mr-2 h-4 w-4" /> Create Offer
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="mt-8 border rounded-lg p-6 bg-card text-card-foreground shadow-sm">
        <Suspense fallback={<DataTableSkeleton columns={5} rows={5} />}>
          <OffersTable />
        </Suspense>
      </div>
    </div>
  )
}

import { Button } from "@hu-partner/ui"
import { Plus } from "lucide-react"
import { cookies } from "next/headers"
import Link from "next/link"
import { Suspense } from "react"

import { DataTable } from "@/components/layout/admin/data-table"
import { DataTableError } from "@/components/layout/admin/data-table-error"
import { DataTableSkeleton } from "@/components/layout/admin/data-table-skeleton"

import { columns, type PartnerColumn } from "./columns"

import type * as React from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getPartners(): Promise<PartnerColumn[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  
  const res = await fetch(`${API_URL}/api/v1/partners`, { 
    headers,
    cache: 'no-store' 
  })
  
  if (!res.ok) {
    throw new Error("Failed to fetch partners")
  }

  const json = (await res.json()) as { data: PartnerColumn[] };
      const data = json.data;
  return data
}

async function PartnerList(): React.JSX.Element {
  try {
    const data = await getPartners()
    return <DataTable searchKey="name" columns={columns} data={data} />
  } catch (error: unknown) {
    return <DataTableError />
  }
}

export default function PartnersPage(): React.JSX.Element {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Partners</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/admin/partners/new">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          </Button>
        </div>
      </div>
      
      <Suspense fallback={<DataTableSkeleton columns={5} rows={10} />}>
        <PartnerList />
      </Suspense>
    </div>
  )
}

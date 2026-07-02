import { Suspense } from "react"
import { cookies } from "next/headers"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@hu-partner/ui"
import { DataTable } from "@/components/layout/admin/data-table"
import { DataTableSkeleton } from "@/components/layout/admin/data-table-skeleton"
import { DataTableError } from "@/components/layout/admin/data-table-error"
import { columns, NewsletterColumn } from "./columns"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getNewsletters(): Promise<NewsletterColumn[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/admin/newsletters`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!res.ok) {
    throw new Error("Failed to fetch newsletters")
  }

  const data = await res.json()
  return data
}

export default function NewslettersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Newsletters</h2>
        <div className="flex items-center space-x-2">
          <Link href="/admin/newsletters/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </Link>
        </div>
      </div>
      <Suspense fallback={<DataTableSkeleton />}>
        <NewslettersTable />
      </Suspense>
    </div>
  )
}

async function NewslettersTable() {
  try {
    const data = await getNewsletters()
    return (
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="title"
        searchPlaceholder="Search by title..."
      />
    )
  } catch (error) {
    return <DataTableError />
  }
}

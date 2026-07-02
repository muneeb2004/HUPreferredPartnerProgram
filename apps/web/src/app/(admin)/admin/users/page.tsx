import { Suspense } from "react"
import { cookies } from "next/headers"

import { DataTable } from "@/components/layout/admin/data-table"
import { DataTableSkeleton } from "@/components/layout/admin/data-table-skeleton"
import { DataTableError } from "@/components/layout/admin/data-table-error"
import { columns, UserColumn } from "./columns"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getUsers(): Promise<UserColumn[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/users`, {
    cache: "no-store",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  if (!res.ok) {
    throw new Error("Failed to fetch users")
  }

  const { data } = await res.json()
  return data
}

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>
      <Suspense fallback={<DataTableSkeleton />}>
        <UsersTable />
      </Suspense>
    </div>
  )
}

async function UsersTable() {
  try {
    const data = await getUsers()
    return (
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="email"
        searchPlaceholder="Search by email..."
      />
    )
  } catch (error) {
    return <DataTableError />
  }
}

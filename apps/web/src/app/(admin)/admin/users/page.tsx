import { cookies } from "next/headers"
import { Suspense } from "react"

import { DataTable } from "@/components/layout/admin/data-table"
import { DataTableError } from "@/components/layout/admin/data-table-error"
import { DataTableSkeleton } from "@/components/layout/admin/data-table-skeleton"

import { columns, type UserColumn } from "./columns"

import type * as React from "react";

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

  const json = (await res.json()) as { data: UserColumn[] };
      const data = json.data;
  return data
}

export default function UsersPage(): React.JSX.Element {
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

async function UsersTable(): React.JSX.Element {
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
  } catch (error: unknown) {
    return <DataTableError />
  }
}

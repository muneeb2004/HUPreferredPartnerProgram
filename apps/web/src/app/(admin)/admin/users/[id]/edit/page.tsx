import { notFound } from "next/navigation"
import { cookies } from "next/headers"

import { UserRoleForm } from "@/components/admin/users/user-role-form"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getUser(id: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  
  const res = await fetch(`${API_URL}/api/v1/users/${id}`, {
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

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const resolvedParams = await params
  const user = await getUser(resolvedParams.id)
  
  if (!user) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Role for {user.name}</h2>
      </div>
      <div className="mt-8">
        <UserRoleForm initialData={user} />
      </div>
    </div>
  )
}

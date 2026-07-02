"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@hu-partner/ui"
import { UserCellAction } from "./cell-action"

export type UserColumn = {
  id: string
  name: string
  email: string
  role: "ADMIN" | "EDITOR" | "BRAND_MANAGER" | "VIEWER"
  createdAt: string
  deletedAt: string | null
}

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return <Badge variant="outline">{role.replace("_", " ")}</Badge>
    }
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const isInactive = !!row.original.deletedAt
      return <Badge variant={isInactive ? "destructive" : "default"}>{isInactive ? "Inactive" : "Active"}</Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <UserCellAction data={row.original} />
  },
]

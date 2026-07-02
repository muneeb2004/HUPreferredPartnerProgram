"use client"

import { Badge } from "@hu-partner/ui"
import { type ColumnDef } from "@tanstack/react-table"

import { UserCellAction } from "./cell-action"

import type * as React from "react";

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
    cell: ({ row }): React.JSX.Element => {
      const role = row.getValue("role")
      return <Badge variant="outline">{String(role).replace("_", " ")}</Badge>
    }
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }): React.JSX.Element => {
      const isInactive = !!row.original.deletedAt
      return <Badge variant={isInactive ? "destructive" : "default"}>{isInactive ? "Inactive" : "Active"}</Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }): string => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    }
  },
  {
    id: "actions",
    cell: ({ row }): React.JSX.Element => <UserCellAction data={row.original} />
  },
]

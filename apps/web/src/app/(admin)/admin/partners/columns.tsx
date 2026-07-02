"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@hu-partner/ui"
import { PartnerCellAction } from "./cell-action"

export type PartnerColumn = {
  id: string
  name: string
  slug: string
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"
  tier: string | null
  createdAt: string
}

export const columns: ColumnDef<PartnerColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "tier",
    header: "Tier",
    cell: ({ row }) => {
      const tier = row.getValue("tier") as string | null
      return tier ? tier : "-"
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      const variant = status === "PUBLISHED" ? "default" : status === "DRAFT" ? "secondary" : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Added",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <PartnerCellAction data={row.original} />
  },
]

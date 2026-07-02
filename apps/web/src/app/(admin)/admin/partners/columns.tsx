"use client"

import { Badge } from "@hu-partner/ui"
import { type ColumnDef } from "@tanstack/react-table"

import { PartnerCellAction } from "./cell-action"

import type * as React from "react";

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
    cell: ({ row }): string => {
      const tier = row.getValue("tier")
      return tier ? tier : "-"
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }): React.JSX.Element => {
      const status = row.getValue("status")
      const variant = status === "PUBLISHED" ? "default" : status === "DRAFT" ? "secondary" : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date Added",
    cell: ({ row }): string => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    }
  },
  {
    id: "actions",
    cell: ({ row }): React.JSX.Element => <PartnerCellAction data={row.original} />
  },
]

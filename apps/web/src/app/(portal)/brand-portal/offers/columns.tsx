"use client"

import { Badge } from "@hu-partner/ui"
import { type ColumnDef } from "@tanstack/react-table"

import { OfferCellAction } from "./cell-action"

import type * as React from "react"

export type PortalOfferColumn = {
  id: string
  title: string
  code: string | null
  discountType: string
  discountValue: number
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"
}

export const columns: ColumnDef<PortalOfferColumn>[] = [
  {
    accessorKey: "title",
    header: "Offer Title",
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }): React.ReactNode => String(row.getValue("code")) || "-"
  },
  {
    accessorKey: "discountValue",
    header: "Value",
    cell: ({ row }): string | number => {
      const type = String(row.original.discountType)
      const val = Number(row.original.discountValue)
      if (type === "PERCENTAGE") return `${String(val)}%`
      if (type === "FIXED") return `$${String(val)}`
      return Number(val)
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }): React.JSX.Element => {
      const status = String(row.getValue("status"))
      let variant: "default" | "secondary" | "destructive" | "outline" = "outline"
      if (status === "PUBLISHED") variant = "default"
      else if (status === "REVIEW") variant = "secondary"
      else if (status === "ARCHIVED") variant = "destructive"
      
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }): React.JSX.Element => <OfferCellAction data={row.original} />
  },
]

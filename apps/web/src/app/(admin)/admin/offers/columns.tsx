"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@hu-partner/ui"
import { OfferCellAction } from "./cell-action"

export type OfferColumn = {
  id: string
  title: string
  code: string | null
  discountType: string
  discountValue: number
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"
  partner: {
    name: string
  }
}

export const columns: ColumnDef<OfferColumn>[] = [
  {
    accessorKey: "title",
    header: "Offer",
  },
  {
    accessorKey: "partner.name",
    header: "Partner",
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => row.getValue("code") || "-"
  },
  {
    accessorKey: "discountValue",
    header: "Value",
    cell: ({ row }) => {
      const type = row.getValue("discountType") as string
      const val = row.getValue("discountValue") as number
      if (type === "PERCENTAGE") return `${val}%`
      if (type === "FIXED") return `$${val}`
      return val
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
    id: "actions",
    cell: ({ row }) => <OfferCellAction data={row.original} />
  },
]

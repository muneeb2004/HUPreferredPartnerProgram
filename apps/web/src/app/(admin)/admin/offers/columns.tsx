"use client"

import { Badge } from "@hu-partner/ui"
import { type ColumnDef } from "@tanstack/react-table"

import { OfferCellAction } from "./cell-action"

import type * as React from "react";

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
    cell: ({ row }): React.ReactNode => String(row.getValue("code")) || "-"
  },
  {
    accessorKey: "discountValue",
    header: "Value",
    cell: ({ row }): string | number => {
      const type = String(row.getValue("discountType"))
      const val = Number(row.getValue("discountValue"))
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
      const variant = status === "PUBLISHED" ? "default" : status === "DRAFT" ? "secondary" : "destructive"
      return <Badge variant={variant}>{status}</Badge>
    },
  },
  {
    id: "actions",
    cell: ({ row }): React.JSX.Element => <OfferCellAction data={row.original} />
  },
]

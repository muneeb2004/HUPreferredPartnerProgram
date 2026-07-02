"use client"

import { Badge } from "@hu-partner/ui"
import { type ColumnDef } from "@tanstack/react-table"

import { NewsletterCellAction } from "./cell-action"

import type * as React from "react";

export type NewsletterColumn = {
  id: string
  title: string
  slug: string
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED"
  createdAt: string
  newsletter?: {
    title: string
  }
}

export const columns: ColumnDef<NewsletterColumn>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "newsletter.title",
    header: "Series",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }): React.JSX.Element => {
      const status = row.getValue("status")
      return (
        <Badge variant={status === "PUBLISHED" ? "default" : status === "DRAFT" ? "secondary" : "outline"}>
          {status}
        </Badge>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }): string => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    }
  },
  {
    id: "actions",
    cell: ({ row }): React.JSX.Element => <NewsletterCellAction data={row.original} />
  },
]

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@hu-partner/ui"
import { NewsletterCellAction } from "./cell-action"

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
    cell: ({ row }) => {
      const status = row.getValue("status") as string
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
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <NewsletterCellAction data={row.original} />
  },
]

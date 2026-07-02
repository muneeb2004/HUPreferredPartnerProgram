"use client"

import { 
  Button, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@hu-partner/ui"
import { MoreHorizontal, Edit, Send, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { deleteNewsletter, sendNewsletter } from "@/app/actions/newsletters"

import { type NewsletterColumn } from "./columns"

interface CellActionProps {
  data: NewsletterColumn
}

export function NewsletterCellAction({ data }: CellActionProps): JSX.Element {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onDelete = (): void => {
    if (confirm("Are you sure you want to delete this newsletter?")) {
      startTransition(async (): Promise<void> => {
        const result = await deleteNewsletter(data.id)
        if (result.success) {
          router.refresh()
        } else {
          alert(result.error)
        }
      })
    }
  }

  const onSend = (): void => {
    if (confirm("Are you sure you want to send this newsletter issue to subscribers?")) {
      startTransition(async (): Promise<void> => {
        const result = await sendNewsletter(data.id)
        if (result.success) {
          alert("Newsletter send triggered successfully!")
          router.refresh()
        } else {
          alert(result.error)
        }
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={(): void => router.push(`/admin/newsletters/${data.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>
        
        {(data.status === "REVIEW" || data.status === "PUBLISHED") && (
          <DropdownMenuItem onClick={onSend}>
            <Send className="mr-2 h-4 w-4" /> Send Issue
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={onDelete} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

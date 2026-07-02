"use client"

import { 
  Button, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@hu-partner/ui"
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { deletePartner } from "../../../actions/partners"

import { type PartnerColumn } from "./columns"

interface CellActionProps {
  data: PartnerColumn
}

export function PartnerCellAction({ data }: CellActionProps): React.JSX.Element {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onConfirm = (): void => {
    if (confirm("Are you sure you want to delete this partner?")) {
      startTransition(async (): Promise<void> => {
        const result = await deletePartner(data.slug)
        if (result.success) {
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
        <DropdownMenuItem onClick={(): void => router.push(`/admin/partners/${data.slug}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onConfirm} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

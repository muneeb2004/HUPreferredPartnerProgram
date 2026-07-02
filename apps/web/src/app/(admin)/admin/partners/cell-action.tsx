"use client"

import * as React from "react"
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

import { 
  Button, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@hu-partner/ui"
import { PartnerColumn } from "./columns"
import { deletePartner } from "../../../actions/partners"

interface CellActionProps {
  data: PartnerColumn
}

export function PartnerCellAction({ data }: CellActionProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  const onConfirm = () => {
    if (confirm("Are you sure you want to delete this partner?")) {
      startTransition(async () => {
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
        <DropdownMenuItem onClick={() => router.push(`/admin/partners/${data.slug}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onConfirm} className="text-destructive focus:bg-destructive focus:text-destructive-foreground">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

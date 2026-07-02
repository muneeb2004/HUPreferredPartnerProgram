"use client"

import { 
  Button, 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@hu-partner/ui"
import { MoreHorizontal, Edit, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import { activateUser, deactivateUser } from "@/app/actions/users"

import { type UserColumn } from "./columns"

interface CellActionProps {
  data: UserColumn
}

export function UserCellAction({ data }: CellActionProps): React.JSX.Element {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  
  const isInactive = !!data.deletedAt

  const onToggleStatus = (): void => {
    const actionName = isInactive ? "activate" : "deactivate"
    if (confirm(`Are you sure you want to ${actionName} this user?`)) {
      startTransition(async (): Promise<void> => {
        const result = isInactive ? await activateUser(data.id) : await deactivateUser(data.id)
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
        <DropdownMenuItem onClick={(): void => router.push(`/admin/users/${data.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" /> Edit Role
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onToggleStatus} className={isInactive ? "text-green-600 focus:text-green-700" : "text-destructive focus:bg-destructive focus:text-destructive-foreground"}>
          {isInactive ? <CheckCircle className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
          {isInactive ? "Activate" : "Deactivate"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

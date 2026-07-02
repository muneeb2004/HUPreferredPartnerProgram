"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hu-partner/ui"
import { userRoleSchema, UserRoleFormValues } from "@/lib/validations/user"
import { updateUserRole } from "@/app/actions/users"

interface UserRoleFormProps {
  initialData: UserRoleFormValues & { id: string }
}

export function UserRoleForm({ initialData }: UserRoleFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<UserRoleFormValues>({
    resolver: zodResolver(userRoleSchema) as any,
    defaultValues: {
      role: initialData.role,
    },
  })

  function onSubmit(data: UserRoleFormValues) {
    setError(null)
    startTransition(async () => {
      const result = await updateUserRole(initialData.id, data)

      if (result.success) {
        router.push("/admin/users")
      } else {
        setError(result.error || "An unexpected error occurred.")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8 max-w-xl">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <FormField<UserRoleFormValues, "role">
            control={form.control as any}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="BRAND_MANAGER">Brand Manager</SelectItem>
                    <SelectItem value="EDITOR">Editor</SelectItem>
                    <SelectItem value="VIEWER">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Role"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.push("/admin/users")} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

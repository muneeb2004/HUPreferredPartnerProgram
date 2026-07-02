"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@hu-partner/ui"
import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"

import { profileSettingsSchema, type ProfileSettingsInput, type ProfileSettingsValues } from "@/lib/validations/settings"

import { updateProfileSettings } from "../_actions/settings-actions"

import type * as React from "react"

interface ProfileSettingsCardProps {
  user: {
    name: string
    email: string
    role: string
    partnerName?: string
  }
}

export function ProfileSettingsCard({ user }: ProfileSettingsCardProps): React.JSX.Element {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const form = useForm<ProfileSettingsInput, undefined, ProfileSettingsValues>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      name: user.name,
    },
  })

  function onSubmit(data: ProfileSettingsValues): void {
    setFeedback(null)
    startTransition(async () => {
      const result = await updateProfileSettings(data)
      if (result.success) {
        setFeedback({ type: "success", message: "Profile updated successfully" })
      } else {
        setFeedback({ type: "error", message: result.error || "Failed to update profile" })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Information</CardTitle>
        <CardDescription>
          Update your personal details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Email</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Role</p>
              <p className="text-sm text-muted-foreground">{user.role.replace("_", " ")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Associated Partner</p>
              <p className="text-sm text-muted-foreground">{user.partnerName || "None"}</p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e) }} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }): React.ReactElement => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {feedback && (
              <div className={`p-3 rounded-md text-sm ${feedback.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {feedback.message}
              </div>
            )}

            <Button type="submit" disabled={isPending || !form.formState.isDirty}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

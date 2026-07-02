"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@hu-partner/ui"
import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"

import { passwordSettingsSchema, type PasswordSettingsInput, type PasswordSettingsValues } from "@/lib/validations/settings"

import { updatePasswordSettings } from "../_actions/settings-actions"

import type * as React from "react"

export function PasswordSettingsCard(): React.JSX.Element {
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const form = useForm<PasswordSettingsInput, undefined, PasswordSettingsValues>({
    resolver: zodResolver(passwordSettingsSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onSubmit(data: PasswordSettingsValues): void {
    setFeedback(null)
    startTransition(async () => {
      const result = await updatePasswordSettings(data)
      if (result.success) {
        setFeedback({ type: "success", message: "Password updated successfully. You will be logged out." })
        form.reset()
        // Wait a brief moment before refreshing to allow the user to see the success message
        setTimeout(() => {
          window.location.href = "/login"
        }, 1500)
      } else {
        setFeedback({ type: "error", message: result.error || "Failed to update password" })
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Ensure your account is using a long, random password to stay secure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e) }} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }): React.ReactElement => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }): React.ReactElement => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }): React.ReactElement => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isPending} />
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
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

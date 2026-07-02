"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Textarea,
} from "@hu-partner/ui"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"

import { updateProfileSchema, type UpdateProfileFormValues } from "@/lib/validations/partner"

import { updatePortalProfile } from "../_actions/profile-actions"

interface ProfileFormProps {
  initialData: UpdateProfileFormValues
}

export function ProfileForm({ initialData }: ProfileFormProps): React.JSX.Element {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<boolean>(false)

  const form = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: initialData,
  })

  function onSubmit(data: UpdateProfileFormValues): void {
    setError(null)
    setSuccess(false)
    startTransition(async (): Promise<void> => {
      const result = await updatePortalProfile(data)

      if (result.success) {
        setSuccess(true)
        router.refresh()
      } else {
        setError(result.error || "An unexpected error occurred.")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e); }} className="space-y-8 max-w-2xl">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-4 bg-green-500/10 text-green-600 rounded-md text-sm">
            Profile updated successfully.
          </div>
        )}

        <FormField<UpdateProfileFormValues, "name">
          control={form.control}
          name="name"
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Corp" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<UpdateProfileFormValues, "description">
          control={form.control}
          name="description"
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your company..."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This description will be visible to students on your brand page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<UpdateProfileFormValues, "website">
            control={form.control}
            name="website"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<UpdateProfileFormValues, "logoId">
            control={form.control}
            name="logoId"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Logo Media ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter media asset ID..." {...field} />
                </FormControl>
                <FormDescription>
                  In the future, this will be replaced with an image upload component.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

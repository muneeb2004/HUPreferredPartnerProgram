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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
} from "@hu-partner/ui"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"

import { createPartner, updatePartner } from "@/app/actions/partners"
import { partnerSchema, type PartnerFormValues } from "@/lib/validations/partner"

interface PartnerFormProps {
  initialData?: PartnerFormValues & { slug: string }
}

export function PartnerForm({ initialData }: PartnerFormProps): React.JSX.Element {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      website: "",
      tier: "Standard",
      status: "DRAFT",
      featured: false,
    },
  })

  function onSubmit(data: PartnerFormValues): void {
    setError(null)
    startTransition(async (): Promise<void> => {
      let result: { success: boolean; error?: string; data?: unknown };
      if (initialData) {
        result = await updatePartner(initialData.slug, data)
      } else {
        result = await createPartner(data)
      }

      if (result.success) {
        router.push("/admin/partners")
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<PartnerFormValues, "name">
            control={form.control}
            name="name"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Corp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<PartnerFormValues, "slug">
            control={form.control}
            name="slug"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="acme-corp" {...field} disabled={!!initialData} />
                </FormControl>
                <FormDescription>
                  Unique URL identifier (cannot be changed later)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField<PartnerFormValues, "description">
          control={form.control}
          name="description"
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about the partner..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<PartnerFormValues, "website">
            control={form.control}
            name="website"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<PartnerFormValues, "tier">
            control={form.control}
            name="tier"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Tier</FormLabel>
                <FormControl>
                  <Input placeholder="Standard" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<PartnerFormValues, "status">
            control={form.control}
            name="status"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="REVIEW">Review</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField<PartnerFormValues, "featured">
            control={form.control}
            name="featured"
            render={({ field }): React.JSX.Element => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Featured
                  </FormLabel>
                  <FormDescription>
                    Display this partner on the homepage
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Partner"}
          </Button>
          <Button type="button" variant="outline" onClick={(): void => router.push("/admin/partners")} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

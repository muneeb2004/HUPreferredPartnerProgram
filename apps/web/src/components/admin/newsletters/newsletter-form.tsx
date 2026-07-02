"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@hu-partner/ui"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"

import { createNewsletter, updateNewsletter } from "@/app/actions/newsletters"
import { newsletterSchema, type NewsletterFormValues } from "@/lib/validations/newsletter"

interface NewsletterFormProps {
  initialData?: NewsletterFormValues & { id: string }
  series: { id: string; title: string }[]
}

export function NewsletterForm({ initialData, series }: NewsletterFormProps): React.JSX.Element {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: initialData || {
      newsletterId: "",
      slug: "",
      title: "",
      excerpt: "",
      status: "DRAFT",
    },
  })

  function onSubmit(data: NewsletterFormValues): void {
    setError(null)
    startTransition(async (): Promise<void> => {
      let result: { success: boolean; error?: string; data?: unknown };
      if (initialData) {
        result = await updateNewsletter(initialData.id, data)
      } else {
        result = await createNewsletter(data)
      }

      if (result.success) {
        router.push("/admin/newsletters")
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<NewsletterFormValues, "newsletterId">
            control={form.control}
            name="newsletterId"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Newsletter Series</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a series" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {series.map(s => (
                      <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<NewsletterFormValues, "status">
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

          <FormField<NewsletterFormValues, "title">
            control={form.control}
            name="title"
            render={({ field }): React.JSX.Element => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Issue 42: Summer Updates" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<NewsletterFormValues, "slug">
            control={form.control}
            name="slug"
            render={({ field }): React.JSX.Element => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="issue-42-summer-updates" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField<NewsletterFormValues, "excerpt">
            control={form.control}
            name="excerpt"
            render={({ field }): React.JSX.Element => (
              <FormItem className="col-span-1 md:col-span-2">
                <FormLabel>Excerpt (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="A brief summary of this issue..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : initialData ? "Save Changes" : "Create Issue"}
          </Button>
          <Button type="button" variant="outline" onClick={(): void => router.push("/admin/newsletters")} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

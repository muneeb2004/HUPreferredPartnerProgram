"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
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
} from "@hu-partner/ui"
import { useRouter } from "next/navigation"
import * as React from "react"
import { useForm } from "react-hook-form"

import { createOffer, updateOffer } from "@/app/actions/offers"
import { offerSchema, type OfferFormValues, type OfferFormInput } from "@/lib/validations/offer"

interface OfferFormProps {
  initialData?: OfferFormValues & { id: string }
  partners: { id: string; name: string }[]
}

export function OfferForm({ initialData, partners }: OfferFormProps): React.JSX.Element {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<OfferFormInput, undefined, OfferFormValues>({
        resolver: zodResolver(offerSchema),
    defaultValues: initialData || {
      partnerId: "",
      title: "",
      description: "",
      code: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      startDate: "",
      endDate: "",
      terms: "",
      status: "DRAFT",
    },
  })

  function onSubmit(data: OfferFormValues): void {
    setError(null)
    startTransition(async (): Promise<void> => {
      let result: { success: boolean; error?: string; data?: unknown };
      if (initialData) {
        result = await updateOffer(initialData.id, data)
      } else {
        result = await createOffer(data)
      }

      if (result.success) {
        router.push("/admin/offers")
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

        <FormField<OfferFormInput, "partnerId">
          control={form.control}
          name="partnerId"
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <FormLabel>Partner</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a partner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {partners.map(partner => (
                    <SelectItem key={partner.id} value={partner.id}>{partner.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<OfferFormInput, "title">
            control={form.control}
            name="title"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="10% Off Shoes" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<OfferFormInput, "code">
            control={form.control}
            name="code"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Coupon Code</FormLabel>
                <FormControl>
                  <Input placeholder="SUMMER10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField<OfferFormInput, "description">
          control={form.control}
          name="description"
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about the offer..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<OfferFormInput, "discountType">
            control={form.control}
            name="discountType"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount ($)</SelectItem>
                    <SelectItem value="BOGO">Buy One Get One</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<OfferFormInput, "discountValue">
            control={form.control}
            name="discountValue"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Discount Value</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<OfferFormInput, "startDate">
            control={form.control}
            name="startDate"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<OfferFormInput, "endDate">
            control={form.control}
            name="endDate"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <FormField<OfferFormInput, "status">
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
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Offer"}
          </Button>
          <Button type="button" variant="outline" onClick={(): void => router.push("/admin/offers")} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

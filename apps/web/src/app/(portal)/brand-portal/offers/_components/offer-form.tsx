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

import { createPortalOffer, updatePortalOffer } from "@/app/(portal)/brand-portal/offers/_actions/offer-actions"
import { portalOfferSchema, type PortalOfferFormValues, type PortalOfferFormInput } from "@/lib/validations/offer"

interface OfferFormProps {
  initialData?: PortalOfferFormValues & { id: string }
}

export function OfferForm({ initialData }: OfferFormProps): React.JSX.Element {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState<string | null>(null)

  const form = useForm<PortalOfferFormInput, undefined, PortalOfferFormValues>({
    resolver: zodResolver(portalOfferSchema),
    defaultValues: initialData || {
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

  function onSubmit(data: PortalOfferFormValues): void {
    setError(null)
    startTransition(async (): Promise<void> => {
      let result: { success: boolean; error?: string };
      if (initialData) {
        result = await updatePortalOffer(initialData.id, data)
      } else {
        result = await createPortalOffer(data)
      }

      if (result.success) {
        router.push("/brand-portal/offers")
      } else {
        setError(result.error || "An unexpected error occurred.")
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => { void form.handleSubmit(onSubmit)(e); }} className="space-y-8 max-w-2xl bg-card text-card-foreground p-6 rounded-lg border">
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<PortalOfferFormInput, "title">
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
          <FormField<PortalOfferFormInput, "code">
            control={form.control}
            name="code"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Coupon Code (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="SUMMER10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField<PortalOfferFormInput, "description">
          control={form.control}
          name="description"
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about the offer..."
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField<PortalOfferFormInput, "discountType">
            control={form.control}
            name="discountType"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Discount Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || "PERCENTAGE"}>
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
          <FormField<PortalOfferFormInput, "discountValue">
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
          <FormField<PortalOfferFormInput, "startDate">
            control={form.control}
            name="startDate"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>Start Date (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField<PortalOfferFormInput, "endDate">
            control={form.control}
            name="endDate"
            render={({ field }): React.JSX.Element => (
              <FormItem>
                <FormLabel>End Date (Optional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField<PortalOfferFormInput, "status">
          control={form.control}
          name="status"
          render={({ field }): React.JSX.Element => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value || "DRAFT"}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DRAFT">Save as Draft</SelectItem>
                  <SelectItem value="REVIEW">Submit for Review</SelectItem>
                  {initialData?.status === "ARCHIVED" && (
                     <SelectItem value="ARCHIVED">Archived</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Selecting &quot;Submit for Review&quot; will notify administrators to review and publish your offer.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Offer"}
          </Button>
          <Button type="button" variant="outline" onClick={(): void => router.push("/brand-portal/offers")} disabled={isPending}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}

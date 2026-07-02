import { ChevronLeft } from "lucide-react"
import Link from "next/link"

import { OfferForm } from "@/app/(portal)/brand-portal/offers/_components/offer-form"

import type * as React from "react"

export default function NewPortalOfferPage(): React.JSX.Element {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Link 
          href="/brand-portal/offers" 
          className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Back to Offers</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Offer</h2>
          <p className="text-muted-foreground mt-1">
            Submit a new discount or offer for review.
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        <OfferForm />
      </div>
    </div>
  )
}

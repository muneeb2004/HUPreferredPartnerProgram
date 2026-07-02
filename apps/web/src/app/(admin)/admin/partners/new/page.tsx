import { PartnerForm } from "@/components/admin/partners/partner-form"

import type * as React from "react";

export default function NewPartnerPage(): React.JSX.Element {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Create Partner</h2>
      </div>
      
      <div className="mt-8">
        <PartnerForm />
      </div>
    </div>
  )
}

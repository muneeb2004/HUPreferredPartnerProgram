import { PartnerForm } from "@/components/admin/partners/partner-form"

export default function NewPartnerPage(): JSX.Element {
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

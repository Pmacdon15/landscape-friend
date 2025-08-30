import { VariantBillingStatusSelector } from "@/types/search-fallback-types";

export function BillingStatusSelectorFallback({ variant = "invoices" }: { variant?: VariantBillingStatusSelector }) {
    const statuses = variant === "invoices"
    ? ["all", "draft", "open", "paid", "void"]
    : ["all", "open", "accepted", "canceled"];

  return (
    <select
      name="status"
      className="w-fit border rounded-sm text-center"      
    >
      {statuses.map(status => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  )
}
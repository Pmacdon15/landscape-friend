'use client'

import { useBillingStatusSearch } from "../../../lib/hooks/hooks";

type Variant = "invoices" | "quotes";


export function BillingStatusSelector({ variant = "invoices" }: { variant?: Variant }) {
  const { currentStatus, setBillingStatus } = useBillingStatusSearch();
  const statuses = variant === "invoices"
    ? ["all", "draft", "open", "paid", "void"]
    : ["all", "draft", "open", "accepted", "canceled"];

  return (
    <select
      name="status"
      className="w-fit border rounded-sm text-center"
      value={currentStatus}
      onChange={(e) => setBillingStatus(e.target.value)}
    >
      {statuses.map(status => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  )
}
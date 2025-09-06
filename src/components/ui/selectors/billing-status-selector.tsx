'use client'
import { VariantBillingStatusSelector } from "@/types/search-fallback-types";
import { useBillingStatusSearch } from "../../../lib/hooks/hooks";

export function BillingStatusSelector({ variant = "invoices" }: { variant?: VariantBillingStatusSelector }) {
  const { currentStatus, setBillingStatus } = useBillingStatusSearch();
  const statuses = variant === "invoices"
    ? ["all", "draft", "open", "paid", "void"]
    : variant === "quotes"
    ? ["all", "draft", "open", "accepted", "canceled"]
    : ["all", "active", "canceled", "incomplete", "trialing"];

  return (
    <select
      name="status"
      className="w-fit border rounded-sm text-center p-2"
      value={currentStatus}
      onChange={(e) => setBillingStatus(e.target.value)}
    >
      {statuses.map(status => (
        <option key={status} value={status}>{status}</option>
      ))}
    </select>
  )
}
'use client'

import { useInvoiceStatusSearch } from "../../../hooks/hooks";

const statuses = ["all", "draft", "open", "paid"];

export function InvoiceStatusSelector() {
  const { currentStatus, setInvoiceStatus } = useInvoiceStatusSearch();

  return (
    <select
        name="status"
        className="w-fit border rounded-sm text-center"
        value={currentStatus}
        onChange={(e) => setInvoiceStatus(e.target.value)}
    >
        {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
        ))}
    </select>
  )
}
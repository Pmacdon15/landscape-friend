'use client'
import { useResendInvoice, useMarkInvoicePaid } from "@/mutations/mutations";
import { Button } from "../button";

export default function ManageInvoiceButton({
  invoiceId,
  variant,
}: {
  invoiceId: string;
  variant: "resend" | "paid";
}) {
  const { mutate: resendMutate, isPending: isResendPending } = useResendInvoice();
  const { mutate: paidMutate, isPending: isPaidPending } = useMarkInvoicePaid();

  const handleClick = () => {
    if (variant === "resend") {
      resendMutate(invoiceId);
    } else if (variant === "paid") {
      paidMutate(invoiceId);
    }
  };

  const isPending = variant === "resend" ? isResendPending : isPaidPending;

  const buttonText = variant === "resend" ? "Resend" : "Mark as Paid";

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={handleClick}
    >
      {buttonText}
    </Button>
  );
}
'use client'
import { useResendInvoice, useMarkInvoicePaid } from "@/mutations/mutations";
import { Button } from "../button";

export default function ManageInvoiceButton({
  invoiceId,
  variant,
}: {
  invoiceId: string;
  variant: "send" | "resend" | "paid";
}) {
  const { mutate: resendMutate, isPending: isResendPending } = useResendInvoice();
  const { mutate: paidMutate, isPending: isPaidPending } = useMarkInvoicePaid();

  const handleClick = () => {
    if (variant === "resend" || variant === "send") {
      resendMutate(invoiceId);
    } else if (variant === "paid") {
      paidMutate(invoiceId);
    }
  };

  const isPending = variant === "paid" ? isPaidPending : isResendPending;

  const buttonText = variant === "paid" ? "Mark as Paid" : variant === "send" ? " Send " : "Resend";

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
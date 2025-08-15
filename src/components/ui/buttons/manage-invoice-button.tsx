'use client'
import { useResendInvoice, useMarkInvoicePaid, useMarkInvoiceVoid } from "@/mutations/mutations";
import { Button } from "../button";

export default function ManageInvoiceButton({
  invoiceId,
  variant,
}: {
  invoiceId: string;
  variant: "send" | "resend" | "paid" | "void";
}) {
  const { mutate: resendMutate, isPending: isResendPending } = useResendInvoice();
  const { mutate: paidMutate, isPending: isPaidPending } = useMarkInvoicePaid();
  const { mutate: voidMutate, isPending: isVoidPending } = useMarkInvoiceVoid();

  const handleClick = () => {
    if (variant === "resend" || variant === "send") {
      resendMutate(invoiceId);
    } else if (variant === "paid") {
      paidMutate(invoiceId);
    } else if (variant === "void") {
      voidMutate(invoiceId);
    }
  };

  const isPending = 
    variant === "paid" ? isPaidPending 
    : variant === "void" ? isVoidPending 
    : isResendPending;

  const buttonText = 
    variant === "paid" ? "Mark as Paid" 
    : variant === "void" ? "Void" 
    : variant === "send" ? "Send" 
    : "Resend";

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
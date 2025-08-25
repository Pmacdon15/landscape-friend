'use client'
import { useMarkQuote } from "@/lib/mutations/mutations";
import { Button } from "../button";
import { MarkQuoteProps } from "@/types/types-stripe";

export default function ManageQuoteButton({
  quoteId,
  action,
}: MarkQuoteProps) {
  const { mutate, isPending } = useMarkQuote();

  const buttonText = action === "accept" ? "Mark as Accepted" : action === "send" ? "Send" : 'Cancel'

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => mutate({ action, quoteId })}
    >
      {buttonText}
    </Button>
  );
}
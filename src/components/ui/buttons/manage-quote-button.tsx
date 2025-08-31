'use client'
import { useMarkQuote } from "@/lib/mutations/mutations";
import { Button } from "../button";
import { MarkQuoteProps } from "@/types/types-stripe";
import EditQuoteLink from "../links/edit-quote-link";
// import Spinner from "../loaders/spinner";
import EllipsisSpinner from "../loaders/EllipsisSpinner";

export default function ManageQuoteButton({
  quoteId,
  action,
}: MarkQuoteProps) {
  const { mutate, isPending } = useMarkQuote();

  const buttonText = action === "accept" ? "Mark as Accepted" : action === "send" ? "Send" : action === "edit" ? "Edit" : 'Cancel'

  if (action === "edit") return <EditQuoteLink quoteId={quoteId} />
  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() => mutate({ action, quoteId })}
    >
      {buttonText}{isPending && <EllipsisSpinner />}
    </Button>
  );
}
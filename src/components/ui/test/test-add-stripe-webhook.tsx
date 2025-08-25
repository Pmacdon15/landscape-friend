// import { createStripeWebhook } from "@/lib/server-funtions/stripe-utils";
import { Button } from "../button";

export default function TestAddStripeWebHook() {
  return (
    <Button 
    // onClick={()=>createStripeWebhook("test", "sk_test_51RuLtuErkqdpyeiWRNjUKyG5DTFtrKNOzDi4MfC3rbfaeORGKAPSqe43Owbv8D90JmAhXvXEml4URVbFwBP7YqEc00XcXHqv02")}
    variant="outline">
        Add Strip Web Hook
    </Button>
  );
}
import { inngest } from "@/lib/inngest/inngest"
import { functions } from "@/lib/inngest/functions";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
    client: inngest,
    functions: functions,
});

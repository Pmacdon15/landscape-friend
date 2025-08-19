import { neon } from "@neondatabase/serverless";
import { inngest } from "./inngest"

const addMonthlyPayment = inngest.createFunction(
    { id: "add-monthly-payment", retries: 2 },
    { cron: "0 0 1 * *" }, // runs on the 1st of every month at 00:00
    async () => {
        const sql = neon(`${process.env.DATABASE_URL}`);
        await sql`
      UPDATE accounts
      SET current_balance = current_balance + 103;
    `;
        return { success: true };
    }
);

export const functions = [addMonthlyPayment];
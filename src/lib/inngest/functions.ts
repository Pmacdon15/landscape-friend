import { inngest } from "./inngest";
// import { getAllOrganizations } from "../DB/org-db";

const cutReminders = inngest.createFunction(
    { id: "cut-reminders", retries: 2 },
    { cron: "0 0 1 * *" }, // TODO Change this
    async () => { }
)
export const functions = [cutReminders];



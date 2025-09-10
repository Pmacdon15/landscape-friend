import { inngest } from "./inngest";
import { getTodaysCuts } from "../DB/grass-cutting-db";
import { triggerNovuEvent } from "../utils/novu";

const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

function getWeekOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = (date.getTime() - start.getTime() + start.getTimezoneOffset() * 60000) / 86400000;
    return Math.floor(diff / 7) + 1;
}

const cutReminders = inngest.createFunction(
    { id: "cut-reminders", retries: 2 },
    { cron: "0 8 * * *" },
    async ({ step }) => {
        console.log('Running cut reminders function');
        const now = new Date();
        const cuttingWeek = (getWeekOfYear(now) % 4) + 1;
        const cuttingDay = daysOfWeek[now.getDay()];
        console.log(`Today is ${cuttingDay}, week ${cuttingWeek}`);

        const cuts = await step.run("fetch-todays-cuts", async () => {
            return await getTodaysCuts(cuttingWeek, cuttingDay);
        });

        console.log(`Found ${cuts.length} cuts for today`);

        const cutsByUser = cuts.reduce((acc, cut) => {
            if (!acc[cut.user_id]) {
                acc[cut.user_id] = {
                    novu_subscriber_id: cut.novu_subscriber_id,
                    cuts: 0
                };
            }
            acc[cut.user_id].cuts++;
            return acc;
        }, {} as Record<string, { novu_subscriber_id: string; cuts: number }>);

        for (const userId in cutsByUser) {
            const userData = cutsByUser[userId];
            await step.run(`trigger-novu-event-for-${userId}`, async () => {
                console.log(`Triggering Novu event for user ${userId} for ${userData.cuts} cuts`);
                await triggerNovuEvent('cut-reminder', userData.novu_subscriber_id, { cuts: { amount: userData.cuts }, date: now.toISOString() });
            });
        }

        console.log('Finished cut reminders function');
    }
)
export const functions = [cutReminders];
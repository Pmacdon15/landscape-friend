import { inngest } from "./inngest";
import { getTodaysCuts } from "../DB/grass-cutting-db";
import { triggerNovuEvent } from "../utils/novu";
import { getSnowClients } from "../DB/snow-clearing-db";
import { fetchGeocode } from "../utils/geocode";
import { isSnowing } from "../utils/weather";

type GeocodeResult = {
    coordinates?: {
        lat: number;
        lng: number;
    };
    zoom?: number;
    error: string | boolean;
};

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
    { cron: "0 12 * * *" },
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
                await triggerNovuEvent('cut-reminder', userData.novu_subscriber_id, { services: { amount: userData.cuts }, date: now.toISOString() });
            });
        }

        console.log('Finished cut reminders function');
    }
)
const snowfallCheck = inngest.createFunction(
    { id: "snowfall-check", retries: 2 },
    { cron: "0 */4 * * *" },
    async ({ step }) => {
        console.log('Running snowfall check function');
        const now = new Date();

        const clients = await step.run("fetch-snow-clients", async () => {
            return await getSnowClients();
        });

        console.log(`Found ${clients.length} clients for snow clearing`);

        const snowClientsByUser: Record<string, { novu_subscriber_id: string; services: number; address: string }> = clients.reduce((acc, client) => {
            if (!acc[client.user_id]) {
                acc[client.user_id] = {
                    novu_subscriber_id: client.novu_subscriber_id,
                    services: 1,
                    address: client.address
                };
            } else {
                acc[client.user_id].services++;
            }
            return acc;
        }, {});

        const geocodeResults: Record<string, GeocodeResult> = {};
        for (const userId in snowClientsByUser) {
            if (snowClientsByUser.hasOwnProperty(userId)) {
                const address = snowClientsByUser[userId].address;
                if (!geocodeResults[address]) {
                    geocodeResults[address] = await fetchGeocode(address);
                }
            }
        }

        for (const userId in snowClientsByUser) {
            if (snowClientsByUser.hasOwnProperty(userId)) {
                const userData = snowClientsByUser[userId];
                const geocodeResult = geocodeResults[userData.address];
                await step.run(`trigger-novu-event-for-${userId}`, async () => {
                    if (geocodeResult && !geocodeResult.error && geocodeResult.coordinates) {
                        const { lat, lng } = geocodeResult.coordinates;
                        const snowing = await isSnowing(lat, lng);

                        if (snowing) {
                            console.log(`Snowfall predicted for user ${userId}. Triggering notification.`);
                            await triggerNovuEvent('snow-reminder', userData.novu_subscriber_id, { services: { amount: userData.services, }, date: now.toISOString() });
                        }
                    } else {
                        console.error(`Could not get geocode for user ${userId}: ${geocodeResult ? geocodeResult.error : 'Unknown error'}`);
                    }
                });
            }
        }

        console.log('Finished snowfall check function');
    }
);

export const functions = [cutReminders, snowfallCheck];
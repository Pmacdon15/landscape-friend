import { Client, ClientResult } from "@/types/types";

export function processClientsResult(clientsResult: ClientResult[]): { clients: Client[], totalPages: number } {

    const totalCount = clientsResult.length > 0 ? clientsResult[0].total_count : 0;
    const totalPages = Math.ceil(totalCount / Number(process.env.PAGE_SIZE) || 10);

    const clients = clientsResult.reduce((acc: Client[], current) => {
        const existingClient = acc.find((client: Client) => client.id === current.id);
        if (existingClient) {
            existingClient.cutting_schedules.push({
                cutting_week: current.cutting_week !== null ? current.cutting_week : 0,
                cutting_day: current.cutting_day !== null ? current.cutting_day : "No cut",
            });
        } else {
            acc.push({
                id: current.id,
                full_name: current.full_name,
                phone_number: current.phone_number,
                email_address: current.email_address,
                address: current.address,
                amount_owing: current.amount_owing,
                price_per_cut: current.price_per_cut,
                cutting_schedules: [{
                    cutting_week: current.cutting_week !== null ? current.cutting_week : 0,
                    cutting_day: current.cutting_day !== null ? current.cutting_day : "No cut",
                }],
            });
        }
        return acc;
    }, []);

    return { clients, totalPages };
}
import { Client, ClientResult } from "@/types/types";

export function processClientsResult(clientsResult: ClientResult[], totalCount: number, pageSize: number): { clients: Client[], totalPages: number } {
  const totalPages = Math.ceil(totalCount / pageSize);

  const clients = clientsResult.reduce((acc: Client[], current) => {
    const existingClient = acc.find((client: Client) => client.id === current.id);
    if (existingClient) {
      existingClient.service_schedules.push({
        service_week: current.service_week !== null ? current.service_week : 0,
        service_day: current.service_day !== null ? current.service_day : "No service",
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
        service_schedules: [{
          service_week: current.service_week !== null ? current.service_week : 0,
          service_day: current.service_day !== null ? current.service_day : "No service",
        }],
      });
    }
    return acc;
  }, []);

  return { clients, totalPages };
}

import SendEmailComponent from "@/components/ui/emails/send-email-component";

export default async function Page({
    params,
}: {
    params: Promise<{ client_email: string, client_name: string }>
}) {
    const { client_email, client_name } = await params
    const clientName = decodeURIComponent(client_name)
     const clientEmail = decodeURIComponent(client_email)

    return (
        <SendEmailComponent clientEmail={clientEmail} clientName={clientName} />
    );
}
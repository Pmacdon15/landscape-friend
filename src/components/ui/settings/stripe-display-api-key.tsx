export default function DisplayStripeApiKey({ apiKey }: { apiKey: string }) {
    return (
        <><label>Stripe API Key</label><p>{apiKey}</p></>
    );
}
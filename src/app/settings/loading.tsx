import ContentContainer from "@/components/ui/containers/content-container";
import { SettingsLabel } from "@/components/ui/settings/settings-label";
import DisplayStripeApiKey from "@/components/ui/settings/stripe-display-api-key";

export default async function Loading() {

    return (
        <ContentContainer>
            <SettingsLabel text={"Settings"} />
            <DisplayStripeApiKey apiKey={""} />           
        </ContentContainer>
    );
}
import ContentContainer from "@/components/ui/containers/content-container";
import { SettingsLabel } from "@/components/ui/settings/settings-label";
import DisplayStripeApiKey from "@/components/ui/settings/stripe-display-api-key";
import { fetchStripeAPIKey } from "@/lib/dal/stripe-dal";

export default async function Settings() {
    const apiKeyResult = await fetchStripeAPIKey();

    const apiKey = apiKeyResult instanceof Error ? '' : apiKeyResult.apk_key;

    return (
        <ContentContainer>
            <SettingsLabel text={"Settings"} />
            <DisplayStripeApiKey apiKey={apiKey} />
            {/* <DisplayWinterMonths startingMonth={Month.January} endingMonth={Month.January}/> */}
        </ContentContainer>
    );
}
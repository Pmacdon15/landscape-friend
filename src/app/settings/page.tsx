import ContentContainer from "@/components/ui/containers/content-container";
import { SettingsLabel } from "@/components/ui/settings/settings-label";
import DisplayStripeApiKey from "@/components/ui/settings/stripe-display-api-key";
import DisplayWinterMonths from "@/components/ui/settings/winter-monters-display";
import { fetchStripeAPIKey } from "@/lib/dal/stripe-dal";
import { Month } from "@/lib/enums/months";


export default async function Settings() {
    const apiKeyResult = await fetchStripeAPIKey();

    const apiKey = apiKeyResult instanceof Error ? '' : apiKeyResult.apk_key;

    return (
        <ContentContainer>
            <SettingsLabel text={"Settings"} />
            <DisplayStripeApiKey apiKey={apiKey} />
            <DisplayWinterMonths startingMonth={Month.January} endingMonth={Month.January}/>
        </ContentContainer>
    );
}
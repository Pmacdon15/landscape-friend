import UpdateStripeApiKeyButton from "@/components/ui/buttons/update-stripe-api-key-button";
import ContentContainer from "@/components/ui/containers/content-container";
import { InputDiv } from "@/components/ui/containers/input-dev";
import { InputField } from "@/components/ui/inputs/input";
import { SettingsLabel } from "@/components/ui/settings/settings-label";
import { fetchStripAPIKey } from "@/lib/DAL/dal/stripe-dal";

export default async function Settings() {
    const apiKeyResult = await fetchStripAPIKey();    

    const apiKey = apiKeyResult instanceof Error ? '' : apiKeyResult.apk_key;
    return (
        <ContentContainer>
            <h1>Settings</h1>
            <InputDiv >
                <SettingsLabel text={"Stripe API Key"} />
                <form className="flex gap-4 flex-col md:flex-row">
                    <InputField name={"api_key"} type={"text"} placeholder={"Your Stripe API Key"} defaultValue={apiKey} />
                    <UpdateStripeApiKeyButton />
                </form>
            </InputDiv>            
        </ContentContainer>
    );
}
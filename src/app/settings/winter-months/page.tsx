import UpdateStripeApiKeyButton from "@/components/ui/buttons/update-stripe-api-key-button";
import ContentContainer from "@/components/ui/containers/content-container";
import { InputDiv } from "@/components/ui/containers/input-dev";
import SettingsForm from "@/components/ui/forms/settings-form";
import { InputField } from "@/components/ui/inputs/input";
import { SettingsLabel } from "@/components/ui/settings/settings-label";
import { fetchStripeAPIKey } from "@/lib/dal/stripe-dal";


export default async function Settings() {
    
    return (
        <ContentContainer>
            <h1>Settings</h1>
            <InputDiv >
                <SettingsLabel text={"Stripe API Key"} />
                <SettingsForm>
                    <h1>test</h1>
                </SettingsForm>
            </InputDiv>
        </ContentContainer>
    );
}
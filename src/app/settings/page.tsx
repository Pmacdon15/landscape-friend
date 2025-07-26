import ContentContainer from "@/components/ui/containers/content-container";
import { InputDiv } from "@/components/ui/containers/input-dev";
import { InputField } from "@/components/ui/inputs/input";
import { SettingsLabel } from "@/components/ui/settings/settings-label";


export default function Settings() {    
    return (
        <ContentContainer>
            <h1>Settings</h1>            
            <InputDiv >
                <SettingsLabel text={"Stripe API Key"} />
                <InputField id={"stripe_api_key"} name={"stripe_api_key"} type={"text"} placeholder={"Your Stripe API Key"} />
            </InputDiv>
        </ContentContainer>
    );
}


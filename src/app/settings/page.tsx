import ContentContainer from "@/components/ui/containers/content-container";
import { InputDiv } from "@/components/ui/containers/input-dev";
import { InputField } from "@/components/ui/inputs/input";
import PricePerCutInput from "@/components/ui/settings/price-per-cut-input";
import { SettingsLabel } from "@/components/ui/settings/settings-label";
import { FetchPricePerCut } from "@/DAL/dal";

export default function Settings() {
    const pricePerCutePromise = FetchPricePerCut();
    return (
        <ContentContainer>
            <h1>Settings</h1>
            <PricePerCutInput pricePerCutPromise={pricePerCutePromise} />
            <InputDiv >
                <SettingsLabel text={"Stripe API Key"} />
                <InputField id={"stripe_api_key"} name={"stripe_api_key"} type={"text"} placeholder={"Your Stripe API Key"} />
            </InputDiv>
        </ContentContainer>
    );
}


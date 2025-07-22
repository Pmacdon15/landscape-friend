import ContentContainer from "@/components/ui/containers/content-container";
import { InputField } from "@/components/ui/inputs/input";

export default function Settings() {
    return (
        <ContentContainer>
            <h1>Settings</h1>
            <InputDiv >
                <label>Price Per Cut</label>
                <InputField id={"price_pre_cut"} name={"price_pre_cut"} type={"number"} step="0.01" />
            </InputDiv>
            <InputDiv >
                <label>stripe Api key</label>
                <InputField id={"stripe_api_key"} name={"stripe_api_key"} type={"text"} placeholder={"Your Stripe API Key"} />
            </InputDiv>
        </ContentContainer>
    );
}

function InputDiv({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="p-2 flex gap-2 items-center">
            {children}
        </div>
    )
}
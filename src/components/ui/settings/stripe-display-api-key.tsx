"use client";
import { useState } from "react";
import { Button } from "../button";
import { EditSettingSheet } from "../sheets/edit-settings-sheet";
import SettingsForm from "../forms/settings-form";
import UpdateStripeApiKeyButton from "../buttons/update-stripe-api-key-button";
import { InputField } from "../inputs/input";
import SettingsDisplayItem from "./settings-display-item";
import { Edit, Eye, EyeOff } from "lucide-react";

export default function DisplayStripeApiKey({ apiKey }: { apiKey: string }) {
    const [showKey, setShowKey] = useState(false);

    const toggleShowKey = () => {
        setShowKey(!showKey);
    };

    return (
        <SettingsDisplayItem
            label="Stripe API Key"
            actions={
                <div className="flex gap-2">
                    {apiKey && <Button onClick={toggleShowKey}>
                        {showKey ? <><EyeOff className="w-4 h-4" /> Show</> : <><Eye className="w-4 h-4" />Hide</>}
                    </Button>
                    }
                    <EditSettingSheet
                        title={<><Edit />Edit Setting</>}
                        prompt={"Edit Stripe API Key"}
                    >
                        <SettingsForm>
                            <InputField
                                name={"api_key"}
                                type={"textarea"}
                                placeholder={"Your Stripe API Key"}
                                defaultValue={apiKey}
                            />
                            <UpdateStripeApiKeyButton />
                        </SettingsForm>
                    </EditSettingSheet>
                </div>
            }>
            <p className="break-all">
                {showKey ? apiKey : apiKey ? "********************************" : ""}
            </p>
        </SettingsDisplayItem>
    );
}
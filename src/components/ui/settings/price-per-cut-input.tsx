import { Price } from "@/types/clients-types";
import { InputDiv } from "../containers/input-dev";
import { InputField } from "../inputs/input";
import { SettingsLabel } from "./settings-label";

export default async function PricePerCutInput({ pricePerCutPromise }: { pricePerCutPromise: Promise<Price | null> }) {
    const pricePerCut = (await pricePerCutPromise)?.price;
    return (
        <InputDiv >
            <SettingsLabel text="Price Per Cut" />
            <InputField name={"price_pre_cut"} type={"number"} step={0.01} defaultValue={pricePerCut || 0.00} />
        </InputDiv>
    );
}
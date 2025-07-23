import { Price } from "@/types/types";
import { InputDiv } from "../containers/input-dev";
import { InputField } from "../inputs/input";
import { SettingsLabel } from "./settings-label";

interface Props {
    pricePerCutPromise: Promise<Price | null>;
}

export default async function PricePerCutInput({ pricePerCutPromise }: Props) {
    const pricePerCut = (await pricePerCutPromise)?.price;
    return (
        <InputDiv >
            <SettingsLabel text="Price Per Cut" />
            <InputField id={"price_pre_cut"} name={"price_pre_cut"} type={"number"} step="0.01" defaultValue={pricePerCut} />
        </InputDiv>
    );
}
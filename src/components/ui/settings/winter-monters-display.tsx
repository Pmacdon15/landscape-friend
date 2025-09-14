import { EditSettingSheet } from "../sheets/edit-settings-sheet";
import SettingsForm from "../forms/settings-form";
import { Month } from "@/lib/enums/months";
import SettingsDisplayItem from "./settings-display-item";

export default function DisplayWinterMonths({
    startingMonth,
    endingMonth,
}: {
    startingMonth: Month;
    endingMonth: Month;
}) {
    return (
        <SettingsDisplayItem
            label="Winter Months"
            actions={
                <EditSettingSheet
                    title="Edit Setting"
                    prompt={"Edit Winter Months"}
                >
                    <SettingsForm>
                        <h1>test</h1>
                    </SettingsForm>
                </EditSettingSheet>
            }
        >
            <p>Starting: {startingMonth}</p>
            <p>Ending: {endingMonth}</p>
        </SettingsDisplayItem>
    );
}
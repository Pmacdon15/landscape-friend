import FormContainer from "../containers/form-container";
import { EditSettingSheet } from "../sheets/edit-settings-sheet";

import { Plus } from "lucide-react";
import { AddClientForm } from "./add-client-form";

export default function AddClientFormContainer() {

    return (
        <FormContainer>
            <div className="w-full flex justify-end">
                <EditSettingSheet
                    title={<><Plus /> Add a Client</>}
                    prompt={"Enter Client Information"}
                >
                    <AddClientForm />
                </EditSettingSheet>
            </div>
        </FormContainer>

    );
}
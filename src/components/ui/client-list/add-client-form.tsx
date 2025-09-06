import FormContainer from "../containers/form-container";
import { EditSettingSheet } from "../sheets/edit-settings-sheet";
import { AddClientFormServerComponent } from "./add-client-form-server-component";
import { Plus } from "lucide-react";

export default function AddClientForm() {

    return (
        <FormContainer>
            <div className="w-full flex justify-end">
                <EditSettingSheet
                    title={<><Plus /> Add a Client</>}
                    prompt={"Enter Client Information"}
                >
                    <AddClientFormServerComponent />
                </EditSettingSheet>
            </div>
        </FormContainer>

    );
}
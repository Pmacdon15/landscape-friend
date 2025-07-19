import SubmitAddClientToList from "../buttons/submit-add-client-to-list";
import { InputField } from "../inputs/input";

export function AddClientFormServerComponent() {
    return (
        <form className="flex flex-col md:flex-row gap-2 p-4 border rounded shadow-md">
            <div className="flex flex-col md:flex-row gap-2 ">
                <InputField id="full_name" name="full_name" type="text" placeholder="Full Name" required />
                <InputField id="email_address" name="email_address" type="email" placeholder="Email Address" required />
                <InputField id="client_address" name="address" type="text" placeholder="Address" required />
            </div>
            <div className="w-full flex justify-end">
                <SubmitAddClientToList />
            </div>
        </form>
    );
}


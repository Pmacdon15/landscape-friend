import SubmitAddClientToList from "../buttons/submit-add-client-to-list";
import FormHeader from "../header/form-header";
import { InputField } from "../inputs/input"; // Ensure InputField can accept className

export function AddClientFormServerComponent() {
    return (
        <form className="flex flex-col gap-6 w-full pb-2">
            <FormHeader text="Add New Client" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InputField id="full_name" name="full_name" type="text" placeholder="Full Name" required />
                <InputField id="phone_number" name="phone_number" type="tel" placeholder="Phone Number" required />
                <InputField id="email_address" name="email_address" type="email" placeholder="Email Address" required />
                <InputField id="client_address" name="address" type="text" placeholder="Address" required className="md:col-span-2 lg:col-span-3" /> {/* Full width on md and lg */}
            </div>
            <div className="flex justify-end">
                <SubmitAddClientToList />
            </div>
        </form>
    );
}


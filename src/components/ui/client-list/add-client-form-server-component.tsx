import SubmitAddClientToList from "../buttons/submit-add-client-to-list";
import FormHeader from "../header/form-header";
import { InputField } from "../inputs/input"; // Ensure InputField can accept className

export function AddClientFormServerComponent() {
    return (
        <form className="flex flex-col gap-6 p-2 border w-full rounded-lg shadow-md mx-auto bg-white">
            <div className='bg-background p-2 shadow-2xl rounded-sm border' >
                <div className="flex flex-col rounded-sm w-full p-4 md:p-6 bg-[url('/lawn3.jpg')] bg-cover bg-center bg-no-repeat shadow-2xl gap-2 border">                    
                    <FormHeader text="Add New Client" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <InputField id="full_name" name="full_name" type="text" placeholder="Full Name" required />
                        <InputField id="phone_number" name="phone_number" type="tel" placeholder="Phone Number" required />
                        <InputField id="email_address" name="email_address" type="email" placeholder="Email Address" required />
                        <InputField id="client_address" name="address" type="text" placeholder="Address" required className="md:col-span-2 lg:col-span-3" /> {/* Full width on md and lg */}
                    </div>
                    <div className="flex justify-end mt-4">
                        <SubmitAddClientToList />
                    </div>
                </div>
            </div>
        </form>
    );
}


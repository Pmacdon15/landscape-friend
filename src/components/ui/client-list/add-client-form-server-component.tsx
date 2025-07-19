// components/forms/AddClientFormServerComponent.jsx

import SubmitAddClientToList from "../buttons/submit-add-client-to-list";
import { InputField } from "../inputs/input"; // Ensure InputField can accept className

export function AddClientFormServerComponent() {
    return (
        <form className="flex flex-col gap-6 p-6 border w-full rounded-lg shadow-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Client</h2>

            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">              
                <InputField id="full_name" name="full_name" type="text" placeholder="Full Name" required />
                <InputField id="phone_number" name="phone_number" type="tel" placeholder="Phone Number" required /> 
                <InputField id="email_address" name="email_address" type="email" placeholder="Email Address" required />
                <InputField id="client_address" name="address" type="text" placeholder="Address" required className="md:col-span-2 lg:col-span-3" /> {/* Full width on md and lg */}
            </div>
           
            <div className="flex justify-end mt-4"> 
                <SubmitAddClientToList />
            </div>
        </form>
    );
}


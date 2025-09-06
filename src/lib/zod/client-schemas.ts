import { z } from 'zod';

export const AddClientFormSchema = z.object({
    full_name: z.string().min(1, { message: "Full name is required" }),
    phone_number: z.e164({ message: "Invalid E.164 phone number format (e.g., +12125550123)" }),
    email_address: z.email({ message: "Invalid email address" }),
    address: z.string().min(1, { message: "Address is required" }),
});

export type AddClientFormValues = z.infer<typeof AddClientFormSchema>;

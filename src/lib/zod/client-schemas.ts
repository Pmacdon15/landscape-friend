import { z } from 'zod';

export const AddClientFormSchema = z.object({
    full_name: z.string().min(1, { message: "Full name is required" }),
    phone_number: z.string().min(1, { message: "Phone number is required" }),
    email_address: z.string().email({ message: "Invalid email address" }),
    address: z.string().min(1, { message: "Address is required" }),
});

export type AddClientFormValues = z.infer<typeof AddClientFormSchema>;

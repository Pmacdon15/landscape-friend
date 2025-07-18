import { useMutation } from "@tanstack/react-query";
import revalidatePathAction from '@/actions/revalidatePath'
import { addClient } from "../src/actions/clients";

export const useAddInventory = () => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return addClient(formData);
        },
        onSuccess: () => {
            revalidatePathAction("/client-list")
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};


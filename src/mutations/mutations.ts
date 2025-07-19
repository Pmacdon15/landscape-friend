import { useMutation } from "@tanstack/react-query";
import revalidatePathAction from '@/actions/revalidatePath'
import { addClient } from "@/actions/clients";

export const useAddClient = () => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return addClient(formData);
        },
        // onSuccess: () => {
        //     revalidatePathAction("/client-list")
        // },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};


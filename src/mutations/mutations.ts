import { useMutation } from "@tanstack/react-query";
import { addClient, deleteClient, sendNewsLetter, updateClientPricePerCut } from "@/actions/clients";

export const useAddClient = () => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return addClient(formData);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

export const useUpdateClientPricePerCut = () => {
    return useMutation({
        mutationFn: ({ clientId, pricePerCut }: { clientId: number, pricePerCut: number }) => {
            return updateClientPricePerCut(clientId, pricePerCut);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};


export const useDeleteClient = () => {
    return useMutation({
        mutationFn: (clientId: number) => {
            return deleteClient(clientId);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

export const useSendNewsLetter = () => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return sendNewsLetter(formData);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};


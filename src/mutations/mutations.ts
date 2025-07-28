import { useMutation } from "@tanstack/react-query";
import { addClient, deleteClient, sendNewsLetter, updateClientPricePerCut, updateCuttingDay } from "@/actions/clients";
import { markYardCut } from "@/actions/cuts";

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

export const useUpdateCuttingDay = () => {
    return useMutation({
        mutationFn: ({ clientId, cuttingWeek, cuttingDay }: { clientId: number, cuttingWeek: number, cuttingDay: string }) => {
            return updateCuttingDay(clientId, cuttingWeek, cuttingDay);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

export const useMarkYardCut = () => {
    return useMutation({
        mutationFn: ({ clientId, date }: { clientId: number, date: Date }) => {
            return markYardCut(clientId, date);
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

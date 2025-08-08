import { useMutation } from "@tanstack/react-query";
import { addClient, deleteClient, updateClientPricePerCut, updateCuttingDay } from "@/actions/clients";
import { markYardCut } from "@/actions/cuts";
import { sendEmailWithTemplate, sendNewsLetter } from "@/actions/sendEmails";
import { updateStripeAPIKey } from "@/actions/stripe";
import revalidatePathAction from "@/actions/revalidatePath";
import { toggleSnowClient } from "@/actions/snow";

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

export const useAssignSnowClearing = () => {
    return useMutation({
        mutationFn: ({ clientId }: { clientId: number, }) => {
            return assignSnowClearing(clientId);
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

export const useToggleSnowClient = () => {
    return useMutation({
        mutationFn: ({ clientId }: { clientId: number }) => {
            return toggleSnowClient(clientId);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
};

export const useSendEmailWithTemplate = ({
    clientEmail,
    onSuccess,
}: {
    clientEmail: string;
    onSuccess?: () => void;
}) => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return sendEmailWithTemplate(formData, clientEmail);
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        },
        onSuccess: () => {
            onSuccess?.();
        },
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

export const useUpdateStripeAPIKey = () => {
    return useMutation({
        mutationFn: (formData: FormData) => {
            return updateStripeAPIKey({ formData });
        },
        onSuccess: () => {
            revalidatePathAction("/settings/stripe-api-key")
        },
        onError: (error) => {
            console.error('Mutation error:', error);
        }
    });
}